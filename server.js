// server.js
const express = require('express');
const cors = require('cors');
const EasyMailer = require('./EasyMailer');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Initialize EasyMailer with credentials from environment variables
const mailer = new EasyMailer(
  process.env.EMAIL_USER,
  process.env.EMAIL_PASS
);

/**
 * POST /api/send-email
 * Expects a JSON body with:
 * - to: recipient email address
 * - subject: (optional) email subject
 * - template: a template name (e.g., "otp")
 * - templateData: data to be inserted into the template (e.g., { otp: "123456", name: "User" })
 *
 * In this example, we are handling an OTP template inline.
 */
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, template, templateData } = req.body;

    // Validate required fields (you might add more validations as needed)
    if (!to || !template) {
      return res.status(400).json({ error: 'Missing required fields: to and template' });
    }

    let emailContent;
    switch (template) {
      case 'otp':
        // Customize your OTP email content here
        emailContent = `
          <h1>Your OTP Code</h1>
          <p>Hello ${templateData.name || 'there'},</p>
          <p>Your OTP code is: <strong>${templateData.otp}</strong></p>
          <p>Please use this code to verify your account.</p>
        `;
        break;
      default:
        emailContent = `
          <h1>Test Email</h1>
          <p>This is a test email sent using EasyMailer.</p>
        `;
    }

    const result = await mailer.sendEmail({
      to,
      subject: subject || `Silitech OTP Verification`,
      body: emailContent,
    });

    res.json({ success: true, messageId: result.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 45701;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
