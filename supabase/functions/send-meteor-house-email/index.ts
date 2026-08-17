import { Resend } from "npm:resend@2.1.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey"
};

Deno.serve(async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  try {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const submission = await req.json();

    const submittedDate = new Date(submission.created_at || new Date());
    const formattedDate = submittedDate.toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short'
    });

    const fullName = `${submission.first_name} ${submission.last_name}`;

    const adminEmailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Meteor House Consultation Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #2D3142; padding: 40px 40px 30px 40px; text-align: center;">
              <img src="https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Branding/MH%20Logo%20for%20SoP.png" alt="Meteor House" style="height: 60px; width: auto;">
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 10px 0; color: #2D3142; font-size: 24px; font-weight: 700;">New Meteor House Consultation Request</h1>
              <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">Received ${formattedDate}</p>

              <div style="background-color: #FFF5F5; border-left: 4px solid #EF4444; padding: 20px; margin-bottom: 20px; border-radius: 4px;">
                <h2 style="margin: 0 0 15px 0; color: #EF4444; font-size: 16px; font-weight: 700;">Contact Information</h2>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600; width: 150px;">Name:</td>
                    <td style="padding: 8px 0; color: #2D3142; font-size: 14px;">${fullName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600;">Email:</td>
                    <td style="padding: 8px 0;"><a href="mailto:${submission.email}" style="color: #EF4444; text-decoration: none; font-size: 14px;">${submission.email}</a></td>
                  </tr>
                  ${submission.phone ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600;">Phone:</td><td style="padding: 8px 0;"><a href="tel:${submission.phone}" style="color: #EF4444; text-decoration: none; font-size: 14px;">${submission.phone}</a></td></tr>` : ''}
                  ${submission.company_name ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600;">Company:</td><td style="padding: 8px 0; color: #2D3142; font-size: 14px;">${submission.company_name}</td></tr>` : ''}
                </table>
              </div>

              ${submission.service_interest ? `
              <div style="background-color: #F9FAFB; padding: 20px; margin-bottom: 20px; border-radius: 4px;">
                <h2 style="margin: 0 0 15px 0; color: #2D3142; font-size: 16px; font-weight: 700;">Service Interest</h2>
                <p style="margin: 0; color: #2D3142; font-size: 14px; font-weight: 600;">${submission.service_interest}</p>
              </div>
              ` : ''}

              ${submission.message ? `
              <div style="background-color: #F9FAFB; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <h2 style="margin: 0 0 15px 0; color: #2D3142; font-size: 16px; font-weight: 700;">Message</h2>
                <p style="margin: 0; color: #2D3142; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${submission.message}</p>
              </div>
              ` : ''}

              <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:${submission.email}" style="display: inline-block; background-color: #EF4444; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: 700; font-size: 14px; margin-right: 10px;">Reply to ${fullName}</a>
                ${submission.phone ? `<a href="tel:${submission.phone}" style="display: inline-block; background-color: #2D3142; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: 700; font-size: 14px;">Call Client</a>` : ''}
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F9FAFB; padding: 30px 40px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 12px;">This is an automated notification from Meteor House consultation form.</p>
              <p style="margin: 0; color: #666; font-size: 12px;">Meteor House | Marketing Partner</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const userEmailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Meteor House Consultation Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #2D3142; padding: 40px 40px 30px 40px; text-align: center;">
              <img src="https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Branding/MH%20Logo%20for%20SoP.png" alt="Meteor House" style="height: 60px; width: auto;">
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 20px 0; color: #2D3142; font-size: 28px; font-weight: 700;">Thank You, ${submission.first_name}!</h1>
              <p style="margin: 0 0 20px 0; color: #2D3142; font-size: 16px; line-height: 1.6;">We're excited to help elevate your brand with explosive creativity!</p>

              <div style="background-color: #FFF5F5; border-left: 4px solid #EF4444; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <h2 style="margin: 0 0 10px 0; color: #EF4444; font-size: 18px; font-weight: 700;">What Happens Next?</h2>
                <ol style="margin: 0; padding-left: 20px; color: #2D3142; font-size: 14px; line-height: 1.8;">
                  <li>Our Meteor House team will review your project details within <strong>24 hours</strong></li>
                  <li>We'll reach out to schedule a free consultation call</li>
                  <li>We'll discuss your creative vision, timeline, and budget</li>
                  <li>You'll receive a custom proposal tailored to your brand</li>
                </ol>
              </div>

              <div style="background-color: #F9FAFB; padding: 20px; border-radius: 4px; margin: 30px 0;">
                <h2 style="margin: 0 0 15px 0; color: #2D3142; font-size: 16px; font-weight: 700;">Your Submitted Information</h2>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 6px 0; color: #666; font-size: 14px; font-weight: 600; width: 120px;">Email:</td>
                    <td style="padding: 6px 0; color: #2D3142; font-size: 14px;">${submission.email}</td>
                  </tr>
                  ${submission.phone ? `<tr><td style="padding: 6px 0; color: #666; font-size: 14px; font-weight: 600;">Phone:</td><td style="padding: 6px 0; color: #2D3142; font-size: 14px;">${submission.phone}</td></tr>` : ''}
                  ${submission.service_interest ? `<tr><td style="padding: 6px 0; color: #666; font-size: 14px; font-weight: 600;">Service:</td><td style="padding: 6px 0; color: #2D3142; font-size: 14px;">${submission.service_interest}</td></tr>` : ''}
                  ${submission.company_name ? `<tr><td style="padding: 6px 0; color: #666; font-size: 14px; font-weight: 600;">Company:</td><td style="padding: 6px 0; color: #2D3142; font-size: 14px;">${submission.company_name}</td></tr>` : ''}
                </table>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">Have questions? We're here to help:</p>
                <p style="margin: 0 0 15px 0;">
                  <a href="https://www.instagram.com/meteor_house_/" target="_blank" style="color: #EF4444; text-decoration: none; font-weight: 600; font-size: 16px;">@meteor_house_ on Instagram</a>
                </p>
                <p style="margin: 0;">
                  <a href="mailto:agileak@icloud.com" style="color: #EF4444; text-decoration: none; font-weight: 600; font-size: 16px;">agileak@icloud.com</a>
                </p>
              </div>

              <div style="text-align: center; padding: 20px; background-color: #F9FAFB; border-radius: 4px; margin-top: 30px;">
                <p style="margin: 0 0 10px 0; color: #2D3142; font-size: 16px; font-weight: 700;">Explosive Creativity</p>
                <p style="margin: 0; color: #666; font-size: 14px;">Top-tier branding, logo design & eye-catching animations</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #2D3142; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 14px; font-weight: 600;">Meteor House</p>
              <p style="margin: 0 0 15px 0; color: #E5E7EB; font-size: 12px;">Marketing Partner | Sites on Polaris</p>
              <p style="margin: 15px 0 0 0; color: #9CA3AF; font-size: 11px;">© 2025 Meteor House. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const [adminEmail, userEmail] = await Promise.all([
      resend.emails.send({
        from: "SoP <noreply@sitesonpolaris.com>",
        to: "agileak@icloud.com",
        subject: `New Meteor House Consultation - ${fullName}`,
        html: adminEmailHtml,
        replyTo: submission.email
      }),
      resend.emails.send({
        from: "Meteor House <noreply@sitesonpolaris.com>",
        to: submission.email,
        subject: "Your Meteor House Consultation Request",
        html: userEmailHtml,
        replyTo: "agileak@icloud.com"
      })
    ]);

    console.log("Admin email sent:", adminEmail);
    console.log("User email sent:", userEmail);

    return new Response(JSON.stringify({
      success: true,
      adminEmailId: adminEmail.data?.id,
      userEmailId: userEmail.data?.id
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error sending Meteor House emails:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});
