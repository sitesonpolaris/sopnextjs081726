import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
    const targetClientIds = body.client_ids || null;
    const debugMode = body.debug || false;

    const processedEmails = [];
    const errors = [];
    const debugLogs = [];

    const { data: activeTemplates, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('active', true);

    if (templateError) {
      throw new Error(`Failed to fetch templates: ${templateError.message}`);
    }

    if (!activeTemplates || activeTemplates.length === 0) {
      const message = 'No active templates found';
      if (debugMode) debugLogs.push(message);
      return new Response(
        JSON.stringify({
          success: true,
          message,
          processed: 0,
          debug: debugMode ? debugLogs : undefined,
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (debugMode) {
      debugLogs.push(`Found ${activeTemplates.length} active templates`);
      debugLogs.push(`Templates: ${activeTemplates.map(t => `${t.name} (${t.type})`).join(', ')}`);
    }

    let clientQuery = supabase.from('clients').select('*');

    if (targetClientIds && Array.isArray(targetClientIds) && targetClientIds.length > 0) {
      clientQuery = clientQuery.in('id', targetClientIds);
      if (debugMode) debugLogs.push(`Filtering to ${targetClientIds.length} specific client(s)`);
    }

    const { data: allClients, error: clientsError } = await clientQuery;

    if (clientsError) {
      throw new Error(`Failed to fetch clients: ${clientsError.message}`);
    }

    if (debugMode) debugLogs.push(`Processing ${allClients?.length || 0} clients`);

    for (const client of allClients || []) {
      if (debugMode) debugLogs.push(`\n=== Processing client: ${client.name} (${client.id}) ===`);

      const { data: preferences } = await supabase
        .from('client_email_preferences')
        .select('*')
        .eq('client_id', client.id)
        .maybeSingle();

      if (preferences && !preferences.opted_in) {
        if (debugMode) debugLogs.push(`  ❌ Skipped: Client opted out`);
        continue;
      }

      if (preferences?.pause_until_date) {
        const pauseDate = new Date(preferences.pause_until_date);
        if (pauseDate > new Date()) {
          if (debugMode) debugLogs.push(`  ❌ Skipped: Emails paused until ${pauseDate.toISOString()}`);
          continue;
        }
      }

      if (debugMode) debugLogs.push(`  ✅ Client opted in and not paused`);

      // Only finished work gets milestone and check-in emails. on_hold, awaiting_payment
      // and waiting_on_client are deliberately excluded.
      const { data: clientProjects } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', client.id)
        .in('status', ['retainer_active', 'completed_ongoing', 'completed_one_off']);

      if (!clientProjects || clientProjects.length === 0) {
        if (debugMode) debugLogs.push(`  ❌ No completed projects found (retainer_active, completed_ongoing or completed_one_off)`);
        continue;
      }

      if (debugMode) debugLogs.push(`  📁 Found ${clientProjects.length} completed project(s)`);

      for (const project of clientProjects) {
        if (project.milestone_emails_enabled === false) {
          continue;
        }

        const { data: payments } = await supabase
          .from('project_payments')
          .select('payment_date')
          .eq('project_id', project.id)
          .order('payment_date', { ascending: false })
          .limit(1);

        if (!payments || payments.length === 0) {
          continue;
        }

        const mostRecentPaymentDate = new Date(payments[0].payment_date);
        const now = new Date();
        const daysSincePayment = Math.floor(
          (now.getTime() - mostRecentPaymentDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSincePayment > 365) {
          if (debugMode) debugLogs.push(`    ⏭️  Project ${project.id} is ${daysSincePayment} days old (> 365, skipping milestones)`);
          continue;
        }

        if (debugMode) debugLogs.push(`    📊 Project ${project.id}: ${daysSincePayment} days since payment`);

        for (const template of activeTemplates) {
          if (template.type !== 'milestone') {
            continue;
          }

          const timingConfig = template.timing_config;
          const daysAfterCompletion = timingConfig?.days_after_completion;

          if (!daysAfterCompletion) {
            continue;
          }

          const toleranceDays = 2;
          if (daysSincePayment >= daysAfterCompletion) {
            const { data: existingEmail } = await supabase
              .from('scheduled_emails')
              .select('id, status')
              .eq('client_id', client.id)
              .eq('project_id', project.id)
              .eq('template_id', template.id)
              .in('status', ['pending_generation', 'pending_approval', 'approved', 'sent'])
              .maybeSingle();

            if (existingEmail) {
              if (debugMode) debugLogs.push(`      ⏭️  ${template.name}: Already exists (${existingEmail.status})`);
              continue;
            }

            if (daysSincePayment <= daysAfterCompletion + toleranceDays) {
              if (debugMode) debugLogs.push(`      ✅ ${template.name}: Creating email (${daysSincePayment} days matches ${daysAfterCompletion})`);
              try {
                const generateResponse = await fetch(
                  `${supabaseUrl}/functions/v1/generate-client-email`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${supabaseServiceKey}`,
                    },
                    body: JSON.stringify({
                      client_id: client.id,
                      project_id: project.id,
                      template_id: template.id,
                      scheduled_date: new Date().toISOString(),
                    }),
                  }
                );

                if (generateResponse.ok) {
                  const result = await generateResponse.json();
                  processedEmails.push({
                    client: client.name,
                    template: template.name,
                    email_id: result.scheduled_email?.id,
                  });
                  if (debugMode) debugLogs.push(`      ✅ Email created successfully`);
                } else {
                  const errorText = await generateResponse.text();
                  errors.push({
                    client: client.name,
                    template: template.name,
                    error: errorText,
                  });
                  if (debugMode) debugLogs.push(`      ❌ Email creation failed: ${errorText}`);
                }
              } catch (error) {
                errors.push({
                  client: client.name,
                  template: template.name,
                  error: error.message,
                });
                if (debugMode) debugLogs.push(`      ❌ Exception: ${error.message}`);
              }
            } else {
              if (debugMode) debugLogs.push(`      ⏭️  ${template.name}: Outside tolerance window (${daysSincePayment} > ${daysAfterCompletion + toleranceDays})`);
            }
          }
        }
      }

      const checkInTemplates = activeTemplates.filter(t => t.type === 'check-in');

      if (debugMode && checkInTemplates.length > 0) {
        debugLogs.push(`\n  🔄 Processing ${checkInTemplates.length} check-in template(s)`);
      }

      for (const template of checkInTemplates) {
        const timingConfig = template.timing_config;
        const frequencyDays = timingConfig?.days_after_last_contact || 30;

        if (debugMode) debugLogs.push(`\n  📧 Check-in template: ${template.name} (frequency: ${frequencyDays} days)`);

        let projectsWithPaymentDates = [];
        for (const project of clientProjects) {
          if (project.milestone_emails_enabled === false) {
            if (debugMode) debugLogs.push(`    ⏭️  Project ${project.id}: milestone emails disabled`);
            continue;
          }

          const { data: payments } = await supabase
            .from('project_payments')
            .select('payment_date')
            .eq('project_id', project.id)
            .order('payment_date', { ascending: false })
            .limit(1);

          if (payments && payments.length > 0) {
            projectsWithPaymentDates.push({
              ...project,
              mostRecentPaymentDate: new Date(payments[0].payment_date),
            });
            if (debugMode) {
              const days = Math.floor((new Date().getTime() - new Date(payments[0].payment_date).getTime()) / (1000 * 60 * 60 * 24));
              debugLogs.push(`    📊 Project ${project.id}: ${days} days since payment`);
            }
          }
        }

        if (projectsWithPaymentDates.length === 0) {
          if (debugMode) debugLogs.push(`    ❌ No projects with payments found`);
          continue;
        }

        if (debugMode) debugLogs.push(`    ✅ Found ${projectsWithPaymentDates.length} project(s) with payments`);

        const mostRecentProject = projectsWithPaymentDates.sort(
          (a, b) => b.mostRecentPaymentDate.getTime() - a.mostRecentPaymentDate.getTime()
        )[0];

        const daysSincePayment = Math.floor(
          (new Date().getTime() - mostRecentProject.mostRecentPaymentDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        const lastCheckIn = mostRecentProject.last_check_in_sent
          ? new Date(mostRecentProject.last_check_in_sent)
          : null;

        const daysSinceLastCheckIn = lastCheckIn
          ? Math.floor((new Date().getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24))
          : Infinity;

        if (debugMode) {
          debugLogs.push(`    📅 Most recent project: ${mostRecentProject.id}`);
          debugLogs.push(`       Days since payment: ${daysSincePayment}`);
          debugLogs.push(`       Last check-in sent: ${lastCheckIn ? lastCheckIn.toISOString() : 'NEVER'}`);
          debugLogs.push(`       Days since last check-in: ${lastCheckIn ? daysSinceLastCheckIn : 'N/A'}`);
        }

        const shouldSendCheckIn =
          (daysSincePayment > 365 && daysSinceLastCheckIn >= frequencyDays) ||
          (!lastCheckIn && daysSincePayment > 365);

        if (debugMode) {
          debugLogs.push(`       Should send check-in: ${shouldSendCheckIn ? 'YES ✅' : 'NO ❌'}`);
          if (!shouldSendCheckIn) {
            if (daysSincePayment <= 365) {
              debugLogs.push(`         Reason: Payment too recent (${daysSincePayment} <= 365 days)`);
            } else if (lastCheckIn && daysSinceLastCheckIn < frequencyDays) {
              debugLogs.push(`         Reason: Check-in sent too recently (${daysSinceLastCheckIn} < ${frequencyDays} days)`);
            }
          }
        }

        if (shouldSendCheckIn) {
          const { data: recentEmail } = await supabase
            .from('scheduled_emails')
            .select('id, status, created_at')
            .eq('client_id', client.id)
            .eq('template_id', template.id)
            .in('status', ['pending_generation', 'pending_approval', 'approved', 'sent'])
            .gte('created_at', new Date(Date.now() - frequencyDays * 24 * 60 * 60 * 1000).toISOString())
            .maybeSingle();

          if (recentEmail) {
            if (debugMode) debugLogs.push(`       ❌ Recent email already exists (${recentEmail.status}, created ${recentEmail.created_at})`);
            continue;
          }

          if (debugMode) debugLogs.push(`       ✅ No recent emails found, proceeding to create`);

          try {
            const generateResponse = await fetch(
              `${supabaseUrl}/functions/v1/generate-client-email`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${supabaseServiceKey}`,
                },
                body: JSON.stringify({
                  client_id: client.id,
                  project_id: mostRecentProject.id,
                  template_id: template.id,
                  scheduled_date: new Date().toISOString(),
                }),
              }
            );

            if (generateResponse.ok) {
              const result = await generateResponse.json();

              await supabase
                .from('projects')
                .update({ last_check_in_sent: new Date().toISOString() })
                .eq('id', mostRecentProject.id);

              processedEmails.push({
                client: client.name,
                template: template.name,
                email_id: result.scheduled_email?.id,
              });
              if (debugMode) debugLogs.push(`       ✅ Check-in email created successfully!`);
            } else {
              const errorText = await generateResponse.text();
              errors.push({
                client: client.name,
                template: template.name,
                error: errorText,
              });
              if (debugMode) debugLogs.push(`       ❌ Email creation failed: ${errorText}`);
            }
          } catch (error) {
            errors.push({
              client: client.name,
              template: template.name,
              error: error.message,
            });
            if (debugMode) debugLogs.push(`       ❌ Exception: ${error.message}`);
          }
        }
      }
    }

    if (debugMode) {
      debugLogs.push(`\n=== Summary ===`);
      debugLogs.push(`Total processed: ${processedEmails.length}`);
      debugLogs.push(`Total errors: ${errors.length}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: processedEmails.length,
        emails: processedEmails,
        errors: errors.length > 0 ? errors : undefined,
        debug: debugMode ? debugLogs : undefined,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error processing scheduled emails:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
