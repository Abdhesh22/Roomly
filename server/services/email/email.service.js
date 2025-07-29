const SmtpService = require("./smtp.service");

class EmailService extends SmtpService {
  constructor() {
    super();
  }

  async sendMail({ to, subject, html, text }) {
    return await super.sendMail({ to, subject, html, text });
  }
}

module.exports = EmailService;
