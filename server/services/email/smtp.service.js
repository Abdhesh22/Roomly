const nodemailer = require("nodemailer");

class SmtpService {
  constructor() {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("⚠️  SMTP credentials are missing in .env file!");
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === "true", // read from .env
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail({ to, subject = "", html = "", text = "" }) {
    const mailOptions = {
      from: `"No Reply" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("✅ Email sent:", info.messageId);
      return info;
    } catch (error) {
      console.error("❌ Error sending email:", error.message);
      throw error;
    }
  }
}

module.exports = SmtpService;
