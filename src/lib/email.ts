import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const notificationEmail = process.env.NOTIFICATION_EMAIL || 'info@nostbakery.com';

export interface ContactSubmissionPayload {
  name: string;
  phone: string;
  email?: string | null;
  type: string;
  message?: string;
  createdAt?: Date | string;
}

/**
 * Sends an email notification to the bakery staff when a new contact or order form is submitted.
 * Gracefully logs and returns failure instead of throwing to avoid breaking form submission flow.
 */
export async function sendContactNotification(submission: ContactSubmissionPayload): Promise<{
  success: boolean;
  data?: unknown;
  error?: unknown;
  reason?: string;
}> {
  if (!resend || !resendApiKey) {
    console.warn('[Email] RESEND_API_KEY is not configured. Skipping email notification.');
    return { success: false, reason: 'RESEND_API_KEY not configured' };
  }

  const { name, phone, email, type, message, createdAt } = submission;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString('en-US', {
        timeZone: 'Asia/Phnom_Penh',
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Phnom_Penh',
        dateStyle: 'medium',
        timeStyle: 'short',
      });

  const typeLabels: Record<string, string> = {
    RETAIL: 'Retail Order / Inquiry',
    CAKE_ORDER: 'Custom Cake Order',
    WHOLESALE: 'Wholesale & B2B Supply',
  };
  const readableType = typeLabels[type] || type;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Website Submission - ${readableType}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #FBF7F1;
            color: #3A2418;
            padding: 24px;
            margin: 0;
            line-height: 1.5;
          }
          .container {
            max-width: 580px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            border: 1px solid #F1E6D4;
            overflow: hidden;
            box-shadow: 0 4px 16px rgba(58, 36, 24, 0.06);
          }
          .header {
            background-color: #3A2418;
            color: #FBF7F1;
            padding: 28px 24px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 22px;
            letter-spacing: 0.04em;
            color: #F4D9A6;
            font-weight: 700;
          }
          .header p {
            margin: 8px 0 0;
            font-size: 13px;
            color: #FBF7F1;
            opacity: 0.85;
          }
          .content {
            padding: 28px 24px;
          }
          .badge {
            display: inline-block;
            background-color: #F4D9A6;
            color: #3A2418;
            font-weight: 700;
            font-size: 12px;
            padding: 5px 12px;
            border-radius: 9999px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 20px;
          }
          .field {
            margin-bottom: 18px;
          }
          .field-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: #A66A2A;
            font-weight: 700;
            margin-bottom: 6px;
          }
          .field-value {
            font-size: 15px;
            color: #3A2418;
            background-color: #FBF7F1;
            padding: 10px 14px;
            border-radius: 10px;
            border: 1px solid #F1E6D4;
          }
          .message-box {
            background-color: #FFFDF9;
            border: 1px solid #F1E6D4;
            padding: 14px;
            border-radius: 10px;
            white-space: pre-wrap;
            font-size: 14px;
            color: #3A2418;
          }
          .footer {
            padding: 18px 24px;
            background-color: #F1E6D4;
            font-size: 12px;
            text-align: center;
            color: #735747;
            border-top: 1px solid #E5D5C1;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>NOST BAKERY &amp; PASTRY</h1>
            <p>Siem Reap, Cambodia</p>
          </div>
          <div class="content">
            <span class="badge">${readableType}</span>

            <div class="field">
              <div class="field-label">Customer Name</div>
              <div class="field-value"><strong>${name}</strong></div>
            </div>

            <div class="field">
              <div class="field-label">Phone Number</div>
              <div class="field-value">
                <a href="tel:${phone}" style="color: #A66A2A; text-decoration: none; font-weight: 600;">
                  ${phone}
                </a>
              </div>
            </div>

            ${
              email
                ? `
            <div class="field">
              <div class="field-label">Email Address</div>
              <div class="field-value">
                <a href="mailto:${email}" style="color: #A66A2A; text-decoration: none;">
                  ${email}
                </a>
              </div>
            </div>`
                : ''
            }

            <div class="field">
              <div class="field-label">Inquiry Type</div>
              <div class="field-value">${readableType}</div>
            </div>

            <div class="field">
              <div class="field-label">Customer Message</div>
              <div class="message-box">${message?.trim() ? message : '<em>(No specific details provided)</em>'}</div>
            </div>

            <div class="field">
              <div class="field-label">Submission Received</div>
              <div class="field-value" style="font-size: 13px; color: #735747;">${formattedDate} (Cambodia Time)</div>
            </div>
          </div>
          <div class="footer">
            Angkor Mansion &amp; Residence, Siem Reap · Hotline: 060 731 888 / 099 200 076
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: 'NOST Bakery <notifications@nostbakery.com>',
      to: [notificationEmail],
      replyTo: email || undefined,
      subject: `[NOST Website] New ${readableType} from ${name}`,
      html: htmlContent,
    });
    return { success: true, data };
  } catch (error) {
    console.error('[Email] Failed to send contact notification email:', error);
    return { success: false, error };
  }
}
