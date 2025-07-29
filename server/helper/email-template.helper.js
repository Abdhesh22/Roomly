const {
  EMAIL_TEMPLATE,
} = require("../utilities/constants/email-template.constant");

class EmailTemplate {
  createTemplate(type, options) {
    let html = ``;
    switch (type) {
      case EMAIL_TEMPLATE.OTP_SEND:
        html = `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>OTP Verification</h2>
            <p>We’ve sent this to <strong>${options.email}</strong></p>
            <p>Your One-Time Password (OTP) is:</p>
            <h1 style="color: #2c3e50;">${options.otp}</h1>
            <p>This OTP will expire in <b>10</b> minutes.</p>
            <p style="color: gray;">If you didn’t request this, you can ignore this email.</p>
          </div>`;
        break;
      default:
        break;
    }
    return `<!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8" />
                    <title>Your OTP Code</title>
                    <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .container { max-width: 600px; margin: auto; border: 1px solid #ccc; padding: 30px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        ${html}
                    </div>
                </body>
            </html>`;
  }

  createSubject(type) {
    switch (type) {
      case EMAIL_TEMPLATE.OTP_SEND:
        return `Roomly Otp Verification`;
      default:
        break;
    }
  }
}

module.exports = EmailTemplate;
