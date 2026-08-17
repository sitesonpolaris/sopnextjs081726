import { Resend } from "npm:resend@2.1.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BookingSubmission {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  company_phone?: string;
  company_email?: string;
  company_address?: string;
  business_description?: string;
  product_services?: string;
  target_market?: string;
  competitor_difference?: string;
  project_type?: string;
  additional_functionality?: string[];
  standard_pages?: string[];
  additional_pages?: string;
  design_tone?: string;
  brand_colors?: string;
  avoid_colors?: string;
  inspiration_sites?: string;
  has_domain?: string;
  domain_name?: string;
  domain_registrar?: string;
  domain_expiration?: string;
  additional_services?: string[];
  how_did_you_find?: string;
  quiz_score?: number;
  challenges?: string[];
  budget_range?: string;
  timeline?: string;
  project_details?: string;
  submission_source?: string;
  created_at?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const submission: BookingSubmission = await req.json();

    const submittedDate = new Date(submission.created_at || new Date());
    const formattedDate = submittedDate.toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
    const fullName = `${submission.first_name} ${submission.last_name}`;

    const isQuickBooking = submission.submission_source === 'booking-form';

    let adminEmailHtml: string;
    let userEmailHtml: string;

    if (isQuickBooking) {
      adminEmailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Quick Consultation Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #2D3142; padding: 40px 40px 30px 40px; text-align: center;">
              <img src="https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Branding/SOP_Logo_Full_RGB_SOP_Logo_Full_RGB_Orange_Rev.png" alt="Sites on Polaris" style="height: 50px; width: auto;">
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 10px 0; color: #2D3142; font-size: 24px; font-weight: 700;">New Quick Consultation Request</h1>
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

              ${submission.project_type ? `
              <div style="background-color: #F9FAFB; padding: 20px; margin-bottom: 20px; border-radius: 4px;">
                <h2 style="margin: 0 0 15px 0; color: #2D3142; font-size: 16px; font-weight: 700;">Project Overview</h2>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600; width: 150px;">Project Type:</td>
                    <td style="padding: 8px 0; color: #2D3142; font-size: 14px; font-weight: 700;">${submission.project_type}</td>
                  </tr>
                </table>
              </div>
              ` : ''}

              ${submission.challenges && submission.challenges.length > 0 ? `
              <div style="background-color: #FFF5F5; border-left: 4px solid #EF4444; padding: 20px; margin-bottom: 20px; border-radius: 4px;">
                <h2 style="margin: 0 0 15px 0; color: #EF4444; font-size: 16px; font-weight: 700;">Current Challenges</h2>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                  ${submission.challenges.map(challenge => `<span style="display: inline-block; background-color: #EF4444; color: white; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; margin: 4px;">${challenge}</span>`).join('')}
                </div>
              </div>
              ` : ''}

              ${submission.budget_range || submission.timeline ? `
              <div style="background-color: #F9FAFB; padding: 20px; margin-bottom: 20px; border-radius: 4px;">
                <h2 style="margin: 0 0 15px 0; color: #2D3142; font-size: 16px; font-weight: 700;">Budget & Timeline</h2>
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${submission.budget_range ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600; width: 150px;">Budget Range:</td><td style="padding: 8px 0; color: #2D3142; font-size: 14px; font-weight: 700;">${submission.budget_range}</td></tr>` : ''}
                  ${submission.timeline ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600;">Timeline:</td><td style="padding: 8px 0; color: #2D3142; font-size: 14px;">${submission.timeline}</td></tr>` : ''}
                </table>
              </div>
              ` : ''}

              ${submission.project_details ? `
              <div style="background-color: #FFF5F5; border-left: 4px solid #EF4444; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <h2 style="margin: 0 0 15px 0; color: #EF4444; font-size: 16px; font-weight: 700;">Project Details</h2>
                <p style="margin: 0; color: #2D3142; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${submission.project_details}</p>
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
              <p style="margin: 0 0 10px 0; color: #666; font-size: 12px;">This is an automated notification from your consultation booking system.</p>
              <p style="margin: 0; color: #666; font-size: 12px;">Sites on Polaris | Charlotte, NC</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

      userEmailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Free Web Design Consultation - Sites on Polaris</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #2D3142; padding: 40px 40px 30px 40px; text-align: center;">
              <img src="https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Branding/SOP_Logo_Full_RGB_SOP_Logo_Full_RGB_Orange_Rev.png" alt="Sites on Polaris" style="height: 50px; width: auto;">
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 20px 0; color: #2D3142; font-size: 28px; font-weight: 700;">Thank You, ${submission.first_name}!</h1>
              <p style="margin: 0 0 20px 0; color: #2D3142; font-size: 16px; line-height: 1.6;">We're excited to help bring your web design project to life!</p>

              <div style="background-color: #FFF5F5; border-left: 4px solid #EF4444; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <h2 style="margin: 0 0 10px 0; color: #EF4444; font-size: 18px; font-weight: 700;">What Happens Next?</h2>
                <ol style="margin: 0; padding-left: 20px; color: #2D3142; font-size: 14px; line-height: 1.8;">
                  <li>Our team will review your project details within <strong>24 hours</strong></li>
                  <li>We'll reach out to schedule a free consultation call</li>
                  <li>We'll discuss your vision, timeline, and budget</li>
                  <li>You'll receive a custom proposal tailored to your needs</li>
                </ol>
              </div>

              <div style="background-color: #F9FAFB; padding: 20px; border-radius: 4px; margin: 30px 0;">
                <h2 style="margin: 0 0 15px 0; color: #2D3142; font-size: 16px; font-weight: 700;">Your Consultation Request Summary</h2>
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${submission.project_type ? `<tr><td style="padding: 6px 0; color: #666; font-size: 14px; font-weight: 600; width: 120px;">Project Type:</td><td style="padding: 6px 0; color: #2D3142; font-size: 14px;">${submission.project_type}</td></tr>` : ''}
                  ${submission.budget_range ? `<tr><td style="padding: 6px 0; color: #666; font-size: 14px; font-weight: 600;">Budget Range:</td><td style="padding: 6px 0; color: #2D3142; font-size: 14px;">${submission.budget_range}</td></tr>` : ''}
                  ${submission.timeline ? `<tr><td style="padding: 6px 0; color: #666; font-size: 14px; font-weight: 600;">Timeline:</td><td style="padding: 6px 0; color: #2D3142; font-size: 14px;">${submission.timeline}</td></tr>` : ''}
                  ${submission.company_name ? `<tr><td style="padding: 6px 0; color: #666; font-size: 14px; font-weight: 600;">Company:</td><td style="padding: 6px 0; color: #2D3142; font-size: 14px;">${submission.company_name}</td></tr>` : ''}
                </table>
              </div>

              ${submission.challenges && submission.challenges.length > 0 ? `
              <div style="background-color: #F9FAFB; padding: 20px; border-radius: 4px; margin: 30px 0;">
                <h2 style="margin: 0 0 15px 0; color: #2D3142; font-size: 16px; font-weight: 700;">Challenges We'll Address</h2>
                <ul style="margin: 0; padding-left: 20px; color: #2D3142; font-size: 14px; line-height: 1.8;">
                  ${submission.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                </ul>
              </div>
              ` : ''}

              <div style="text-align: center; margin: 30px 0;">
                <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">Have questions? Contact us anytime:</p>
                <p style="margin: 0 0 8px 0;">
                  <a href="tel:7042515030" style="color: #EF4444; text-decoration: none; font-weight: 600; font-size: 16px;">(704) 251-5030</a>
                </p>
                <p style="margin: 0;">
                  <a href="mailto:hello@sitesonpolaris.com" style="color: #EF4444; text-decoration: none; font-weight: 600; font-size: 16px;">hello@sitesonpolaris.com</a>
                </p>
              </div>

              <div style="text-align: center; padding: 20px; background-color: #F9FAFB; border-radius: 4px; margin-top: 30px;">
                <p style="margin: 0 0 5px 0; color: #EF4444; font-size: 24px; font-weight: 700;">⭐⭐⭐⭐⭐</p>
                <p style="margin: 0; color: #2D3142; font-size: 14px; font-weight: 600;">5.0 Google Rating | 50+ Successful Projects</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #2D3142; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 14px; font-weight: 600;">Sites on Polaris</p>
              <p style="margin: 0 0 15px 0; color: #E5E7EB; font-size: 12px;">Professional Web Design | Charlotte, NC</p>
              <p style="margin: 15px 0 0 0; color: #9CA3AF; font-size: 11px;">© 2025 Sites on Polaris. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    } else {
      adminEmailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Consultation Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #2D3142; padding: 40px 40px 30px 40px; text-align: center;">
              <img src="https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Branding/SOP_Logo_Full_RGB_SOP_Logo_Full_RGB_Orange_Rev.png" alt="Sites on Polaris" style="height: 50px; width: auto;">
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 10px 0; color: #2D3142; font-size: 24px; font-weight: 700;">New Consultation Request</h1>
              <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">Received ${formattedDate}</p>
              ${submission.quiz_score ? `<div style="text-align: center; margin-bottom: 20px;"><span style="background-color: #EF4444; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 700; font-size: 14px;">Quiz Score: ${submission.quiz_score} points</span></div>` : ''}

              <div style="background-color: #FFF5F5; border-left: 4px solid #EF4444; padding: 20px; margin-bottom: 20px; border-radius: 4px;">
                <h2 style="margin: 0 0 15px 0; color: #EF4444; font-size: 16px; font-weight: 700;">Personal Information</h2>
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
                  ${submission.how_did_you_find ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600;">How Found Us:</td><td style="padding: 8px 0; color: #2D3142; font-size: 14px;">${submission.how_did_you_find}</td></tr>` : ''}
                </table>
              </div>

              ${submission.company_name ? `
              <div style="background-color: #F9FAFB; padding: 20px; margin-bottom: 20px; border-radius: 4px;">
                <h2 style="margin: 0 0 15px 0; color: #2D3142; font-size: 16px; font-weight: 700;">Company Information</h2>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600; width: 150px;">Company Name:</td>
                    <td style="padding: 8px 0; color: #2D3142; font-size: 14px;">${submission.company_name}</td>
                  </tr>
                  ${submission.company_email ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600;">Company Email:</td><td style="padding: 8px 0; color: #2D3142; font-size: 14px;">${submission.company_email}</td></tr>` : ''}
                  ${submission.company_phone ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600;">Company Phone:</td><td style="padding: 8px 0; color: #2D3142; font-size: 14px;">${submission.company_phone}</td></tr>` : ''}
                  ${submission.company_address ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600;">Address:</td><td style="padding: 8px 0; color: #2D3142; font-size: 14px;">${submission.company_address}</td></tr>` : ''}
                  ${submission.business_description ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600; vertical-align: top;">Description:</td><td style="padding: 8px 0; color: #2D3142; font-size: 14px;">${submission.business_description}</td></tr>` : ''}
                  ${submission.product_services ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600; vertical-align: top;">Products/Services:</td><td style="padding: 8px 0; color: #2D3142; font-size: 14px;">${submission.product_services}</td></tr>` : ''}
                  ${submission.target_market ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600; vertical-align: top;">Target Market:</td><td style="padding: 8px 0; color: #2D3142; font-size: 14px;">${submission.target_market}</td></tr>` : ''}
                  ${submission.competitor_difference ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600; vertical-align: top;">Differentiators:</td><td style="padding: 8px 0; color: #2D3142; font-size: 14px;">${submission.competitor_difference}</td></tr>` : ''}
                </table>
              </div>
              ` : ''}

              ${submission.project_type ? `
              <div style="background-color: #FFF5F5; border-left: 4px solid #EF4444; padding: 20px; margin-bottom: 20px; border-radius: 4px;">
                <h2 style="margin: 0 0 15px 0; color: #EF4444; font-size: 16px; font-weight: 700;">Project Details</h2>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600; width: 150px;">Project Type:</td>
                    <td style="padding: 8px 0; color: #2D3142; font-size: 14px; font-weight: 700;">${submission.project_type}</td>
                  </tr>
                  ${submission.additional_functionality && submission.additional_functionality.length > 0 ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600; vertical-align: top;">Features:</td><td style="padding: 8px 0; color: #2D3142; font-size: 14px;">${submission.additional_functionality.join(', ')}</td></tr>` : ''}
                  ${submission.standard_pages && submission.standard_pages.length > 0 ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600; vertical-align: top;">Pages:</td><td style="padding: 8px 0; color: #2D3142; font-size: 14px;">${submission.standard_pages.join(', ')}</td></tr>` : ''}
                  ${submission.additional_pages ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600; vertical-align: top;">Additional Pages:</td><td style="padding: 8px 0; color: #2D3142; font-size: 14px;">${submission.additional_pages}</td></tr>` : ''}
                </table>
              </div>
              ` : ''}

              ${submission.design_tone || submission.brand_colors || submission.inspiration_sites ? `
              <div style="background-color: #F9FAFB; padding: 20px; margin-bottom: 20px; border-radius: 4px;">
                <h2 style="margin: 0 0 15px 0; color: #2D3142; font-size: 16px; font-weight: 700;">Design Preferences</h2>
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${submission.design_tone ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600; width: 150px;">Design Tone:</td><td style="padding: 8px 0; color: #2D3142; font-size: 14px;">${submission.design_tone}</td></tr>` : ''}
                  ${submission.brand_colors ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600;">Brand Colors:</td><td style="padding: 8px 0; color: #2D3142; font-size: 14px;">${submission.brand_colors}</td></tr>` : ''}
                  ${submission.avoid_colors ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600;">Avoid Colors:</td><td style="padding: 8px 0; color: #2D3142; font-size: 14px;">${submission.avoid_colors}</td></tr>` : ''}
                  ${submission.inspiration_sites ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600; vertical-align: top;">Inspiration:</td><td style="padding: 8px 0; color: #2D3142; font-size: 14px;">${submission.inspiration_sites}</td></tr>` : ''}
                </table>
              </div>
              ` : ''}

              ${submission.has_domain ? `
              <div style="background-color: #F9FAFB; padding: 20px; margin-bottom: 20px; border-radius: 4px;">
                <h2 style="margin: 0 0 15px 0; color: #2D3142; font-size: 16px; font-weight: 700;">Domain & Hosting</h2>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600; width: 150px;">Has Domain:</td>
                    <td style="padding: 8px 0; color: #2D3142; font-size: 14px;">${submission.has_domain}</td>
                  </tr>
                  ${submission.domain_name ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600;">Domain Name:</td><td style="padding: 8px 0; color: #2D3142; font-size: 14px;">${submission.domain_name}</td></tr>` : ''}
                  ${submission.domain_registrar ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600;">Registrar:</td><td style="padding: 8px 0; color: #2D3142; font-size: 14px;">${submission.domain_registrar}</td></tr>` : ''}
                  ${submission.domain_expiration ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: 600;">Expiration:</td><td style="padding: 8px 0; color: #2D3142; font-size: 14px;">${submission.domain_expiration}</td></tr>` : ''}
                </table>
              </div>
              ` : ''}

              ${submission.additional_services && submission.additional_services.length > 0 ? `
              <div style="background-color: #FFF5F5; border-left: 4px solid #EF4444; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <h2 style="margin: 0 0 15px 0; color: #EF4444; font-size: 16px; font-weight: 700;">Additional Services</h2>
                <p style="margin: 0; color: #2D3142; font-size: 14px;">${submission.additional_services.join(', ')}</p>
              </div>
              ` : ''}

              <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:${submission.email}" style="display: inline-block; background-color: #EF4444; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: 700; font-size: 14px; margin-right: 10px;">Reply to ${fullName}</a>
                <a href="tel:${submission.phone || submission.company_phone || ''}" style="display: inline-block; background-color: #2D3142; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: 700; font-size: 14px;">Call Client</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F9FAFB; padding: 30px 40px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 12px;">This is an automated notification from your consultation booking system.</p>
              <p style="margin: 0; color: #666; font-size: 12px;">Sites on Polaris | Charlotte, NC</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

      userEmailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Free Web Design Consultation - Sites on Polaris</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #2D3142; padding: 40px 40px 30px 40px; text-align: center;">
              <img src="https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Branding/SOP_Logo_Full_RGB_SOP_Logo_Full_RGB_Orange_Rev.png" alt="Sites on Polaris" style="height: 50px; width: auto;">
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 20px 0; color: #2D3142; font-size: 28px; font-weight: 700;">Thank You, ${submission.first_name}!</h1>
              <p style="margin: 0 0 20px 0; color: #2D3142; font-size: 16px; line-height: 1.6;">We're excited to help bring your web design project to life!</p>

              <div style="background-color: #FFF5F5; border-left: 4px solid #EF4444; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <h2 style="margin: 0 0 10px 0; color: #EF4444; font-size: 18px; font-weight: 700;">What Happens Next?</h2>
                <ol style="margin: 0; padding-left: 20px; color: #2D3142; font-size: 14px; line-height: 1.8;">
                  <li>Our team will review your project details within <strong>24 hours</strong></li>
                  <li>We'll reach out to schedule a free consultation call</li>
                  <li>We'll discuss your vision, timeline, and budget</li>
                  <li>You'll receive a custom proposal tailored to your needs</li>
                </ol>
              </div>

              ${submission.quiz_score ? `
              <div style="text-align: center; padding: 20px; background-color: #F9FAFB; border-radius: 4px; margin: 30px 0;">
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your Project Readiness Score</p>
                <p style="margin: 0; color: #EF4444; font-size: 36px; font-weight: 700;">${submission.quiz_score} points</p>
                <p style="margin: 10px 0 0 0; color: #666; font-size: 12px;">We'll discuss how to maximize your project's success</p>
              </div>
              ` : ''}

              <div style="background-color: #F9FAFB; padding: 20px; border-radius: 4px; margin: 30px 0;">
                <h2 style="margin: 0 0 15px 0; color: #2D3142; font-size: 16px; font-weight: 700;">Your Submitted Project Summary</h2>
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${submission.project_type ? `<tr><td style="padding: 6px 0; color: #666; font-size: 14px; font-weight: 600; width: 120px;">Project Type:</td><td style="padding: 6px 0; color: #2D3142; font-size: 14px;">${submission.project_type}</td></tr>` : ''}
                  ${submission.company_name ? `<tr><td style="padding: 6px 0; color: #666; font-size: 14px; font-weight: 600;">Company:</td><td style="padding: 6px 0; color: #2D3142; font-size: 14px;">${submission.company_name}</td></tr>` : ''}
                  <tr><td style="padding: 6px 0; color: #666; font-size: 14px; font-weight: 600;">Email:</td><td style="padding: 6px 0; color: #2D3142; font-size: 14px;">${submission.email}</td></tr>
                  ${submission.phone ? `<tr><td style="padding: 6px 0; color: #666; font-size: 14px; font-weight: 600;">Phone:</td><td style="padding: 6px 0; color: #2D3142; font-size: 14px;">${submission.phone}</td></tr>` : ''}
                </table>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">Have questions? Contact us anytime:</p>
                <p style="margin: 0 0 8px 0;">
                  <a href="tel:7042515030" style="color: #EF4444; text-decoration: none; font-weight: 600; font-size: 16px;">(704) 251-5030</a>
                </p>
                <p style="margin: 0;">
                  <a href="mailto:hello@sitesonpolaris.com" style="color: #EF4444; text-decoration: none; font-weight: 600; font-size: 16px;">hello@sitesonpolaris.com</a>
                </p>
              </div>

              <div style="text-align: center; padding: 20px; background-color: #F9FAFB; border-radius: 4px; margin-top: 30px;">
                <p style="margin: 0 0 5px 0; color: #EF4444; font-size: 24px; font-weight: 700;">⭐⭐⭐⭐⭐</p>
                <p style="margin: 0; color: #2D3142; font-size: 14px; font-weight: 600;">5.0 Google Rating | 50+ Successful Projects</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #2D3142; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 14px; font-weight: 600;">Sites on Polaris</p>
              <p style="margin: 0 0 15px 0; color: #E5E7EB; font-size: 12px;">Professional Web Design | Charlotte, NC</p>
              <p style="margin: 15px 0 0 0; color: #9CA3AF; font-size: 11px;">© 2025 Sites on Polaris. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
    }

    const [adminEmail, userEmail] = await Promise.all([
      resend.emails.send({
        from: "Sites on Polaris <noreply@sitesonpolaris.com>",
        to: "hello@sitesonpolaris.com",
        subject: `${isQuickBooking ? 'New Quick Consultation' : 'New Consultation Request'} - ${fullName}`,
        html: adminEmailHtml,
        replyTo: submission.email,
      }),
      resend.emails.send({
        from: "Sites on Polaris <noreply@sitesonpolaris.com>",
        to: submission.email,
        subject: "Your Free Web Design Consultation - Sites on Polaris",
        html: userEmailHtml,
        replyTo: "hello@sitesonpolaris.com",
      }),
    ]);

    console.log("Admin email sent:", adminEmail);
    console.log("User email sent:", userEmail);

    return new Response(
      JSON.stringify({
        success: true,
        adminEmailId: adminEmail.data?.id,
        userEmailId: userEmail.data?.id,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending emails:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
