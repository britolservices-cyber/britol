require('dotenv').config();
const express = require('express');
const { Resend } = require('resend');
const path = require('path');

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/send-booking', (req, res) => {
  handleBooking(req, res).catch(err => {
    console.error('Unhandled route error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Server error. Please try again later.' });
    }
  });
});

async function handleBooking(req, res) {
  const {
    service,
    frequency,
    days,
    startDate,
    time,
    name,
    phone,
    email,
    address,
    notes
  } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ error: 'Name, phone and email are required.' });
  }

  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Booking – Britol Group</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#1a3a5c;padding:30px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;letter-spacing:0.5px;">Britol Group Pty Ltd</h1>
              <p style="margin:6px 0 0;color:#a8c4e0;font-size:13px;">New Cleaning Booking Request</p>
            </td>
          </tr>

          <!-- Alert bar -->
          <tr>
            <td style="background:#e8f4e8;border-left:4px solid #2d8a4e;padding:14px 40px;">
              <p style="margin:0;color:#1a5c2d;font-size:14px;font-weight:bold;">
                📋 &nbsp;A new booking has been submitted via the website.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">

              <!-- Service Details -->
              <h2 style="margin:0 0 16px;color:#1a3a5c;font-size:16px;border-bottom:2px solid #e8edf2;padding-bottom:8px;">
                🧹 &nbsp;Service Details
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:8px 0;color:#666;font-size:13px;width:40%;vertical-align:top;">Service Type</td>
                  <td style="padding:8px 0;color:#1a3a5c;font-size:13px;font-weight:bold;">${service || '—'}</td>
                </tr>
                <tr style="background:#f9fafb;">
                  <td style="padding:8px 6px;color:#666;font-size:13px;width:40%;vertical-align:top;">Frequency</td>
                  <td style="padding:8px 6px;color:#1a3a5c;font-size:13px;font-weight:bold;">${frequency || '—'}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#666;font-size:13px;width:40%;vertical-align:top;">Preferred Days</td>
                  <td style="padding:8px 0;color:#1a3a5c;font-size:13px;font-weight:bold;">${days || '—'}</td>
                </tr>
                <tr style="background:#f9fafb;">
                  <td style="padding:8px 6px;color:#666;font-size:13px;width:40%;vertical-align:top;">Start Date</td>
                  <td style="padding:8px 6px;color:#1a3a5c;font-size:13px;font-weight:bold;">${startDate || 'To be confirmed'}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#666;font-size:13px;width:40%;vertical-align:top;">Preferred Time</td>
                  <td style="padding:8px 0;color:#1a3a5c;font-size:13px;font-weight:bold;">${time || '—'}</td>
                </tr>
              </table>

              <!-- Client Details -->
              <h2 style="margin:0 0 16px;color:#1a3a5c;font-size:16px;border-bottom:2px solid #e8edf2;padding-bottom:8px;">
                👤 &nbsp;Client Details
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:8px 0;color:#666;font-size:13px;width:40%;vertical-align:top;">Full Name</td>
                  <td style="padding:8px 0;color:#1a3a5c;font-size:13px;font-weight:bold;">${name}</td>
                </tr>
                <tr style="background:#f9fafb;">
                  <td style="padding:8px 6px;color:#666;font-size:13px;width:40%;vertical-align:top;">Phone</td>
                  <td style="padding:8px 6px;color:#1a3a5c;font-size:13px;font-weight:bold;">
                    <a href="tel:${phone}" style="color:#1a3a5c;text-decoration:none;">${phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#666;font-size:13px;width:40%;vertical-align:top;">Email</td>
                  <td style="padding:8px 0;color:#1a3a5c;font-size:13px;font-weight:bold;">
                    <a href="mailto:${email}" style="color:#1a3a5c;text-decoration:none;">${email}</a>
                  </td>
                </tr>
                <tr style="background:#f9fafb;">
                  <td style="padding:8px 6px;color:#666;font-size:13px;width:40%;vertical-align:top;">Site Address</td>
                  <td style="padding:8px 6px;color:#1a3a5c;font-size:13px;font-weight:bold;">${address || '—'}</td>
                </tr>
              </table>

              ${notes ? `
              <!-- Notes -->
              <h2 style="margin:0 0 12px;color:#1a3a5c;font-size:16px;border-bottom:2px solid #e8edf2;padding-bottom:8px;">
                📝 &nbsp;Additional Notes
              </h2>
              <div style="background:#f9fafb;border-radius:6px;padding:14px 16px;margin-bottom:28px;">
                <p style="margin:0;color:#444;font-size:13px;line-height:1.6;">${notes.replace(/\n/g, '<br>')}</p>
              </div>
              ` : ''}

              <!-- Action reminder -->
              <div style="background:#fff8e1;border-radius:8px;padding:16px 20px;border-left:4px solid #f59e0b;">
                <p style="margin:0;color:#92400e;font-size:13px;">
                  ⏰ &nbsp;<strong>Action required:</strong> Please contact the client within <strong>24 hours</strong> to confirm the booking.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f4f6f9;padding:20px 40px;text-align:center;border-top:1px solid #e8edf2;">
              <p style="margin:0;color:#999;font-size:12px;">
                This email was automatically sent from the Britol Group website booking form.<br/>
                📞 <a href="tel:0405585405" style="color:#1a3a5c;">0405 585 405</a>
                &nbsp;·&nbsp;
                🌐 <a href="https://britolgroup.com.au" style="color:#1a3a5c;">britolgroup.com.au</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Britol Group Website <onboarding@resend.dev>',
      to: 'britolservices@gmail.com',
      replyTo: email,
      subject: `New Booking Request – ${service} – ${name}`,
      html: emailHtml
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email. Please try again.' });
    }

    console.log(`Booking email sent. ID: ${data.id}`);
    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
}

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Britol Group server running at http://localhost:${PORT}`);
});
