// EasyMailer.js
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

class EasyMailer {
  constructor(userEmail, userPassword, service = 'Gmail') {
    if (!userEmail || !userPassword) {
      throw new Error('Email and password are required');
    }

    this.transporter = nodemailer.createTransport({
      service: service,
      auth: {
        user: userEmail,
        pass: userPassword,
      },
    });

    this.templates = {};
    this.attachments = [];
  }

  addTemplate(templateName, htmlFilePath) {
    try {
      const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
      this.templates[templateName] = htmlContent;
      return true;
    } catch (error) {
      throw new Error(`Template loading failed: ${error.message}`);
    }
  }

  #replaceTemplateContent(template, data) {
    let content = template;
    for (const key in data) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, data[key]);
    }
    return content;
  }

  async sendEmail({ to, subject, body, templateName, templateData }) {
    if (!to || !subject || (!body && !templateName)) {
      throw new Error('Missing required fields');
    }

    let html = body;
    if (templateName) {
      if (!this.templates[templateName]) {
        throw new Error('Template not found');
      }
      html = this.#replaceTemplateContent(this.templates[templateName], templateData);
    }

    try {
      const info = await this.transporter.sendMail({
        from: this.transporter.options.auth.user,
        to,
        subject,
        html,
        attachments: this.attachments,
      });

      // Clear attachments after sending
      this.attachments = [];

      return { success: true, messageId: info.messageId };
    } catch (error) {
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  async sendBulkEmails(recipients, emailData) {
    if (!Array.isArray(recipients)) {
      throw new Error('Recipients must be an array');
    }

    const results = [];
    for (const recipient of recipients) {
      try {
        const result = await this.sendEmail({
          ...emailData,
          to: recipient,
        });
        results.push({ recipient, success: true, data: result });
      } catch (error) {
        results.push({ recipient, success: false, error: error.message });
      }
    }
    return results;
  }

  attachFile(filePath, options = {}) {
    try {
      const attachment = {
        filename: options.filename || path.basename(filePath),
        path: filePath,
        contentType: options.contentType || 'application/octet-stream',
      };
      this.attachments.push(attachment);
      return true;
    } catch (error) {
      throw new Error(`Attachment failed: ${error.message}`);
    }
  }
}

module.exports = EasyMailer;
