require('dotenv').config();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetEmail = async (toEmail, otp) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/?token=${otp}`;

  const htmlContent = `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
    <div style="max-width: 520px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden;">
      
      <div style="background: linear-gradient(90deg, #d32f2f, #1976d2); padding: 20px; color: white;">
        <h2 style="margin: 0;">Password Reset</h2>
      </div>

      <div style="padding: 24px; color: #333;">
        <p>Hello,</p>

        <p>You requested to reset your password. Use the OTP below or click the button to continue.</p>

        <div style="text-align: center; margin: 24px 0;">
          <div style="
            display: inline-block;
            font-size: 26px;
            letter-spacing: 6px;
            font-weight: bold;
            padding: 14px 24px;
            background: #f1f1f1;
            border-radius: 6px;
            color: #000;">
            ${otp}
          </div>
        </div>

        <p style="text-align: center; margin: 20px 0;">OR</p>

        <div style="text-align: center;">
          <a href="${resetLink}"
            style="
              display: inline-block;
              padding: 12px 24px;
              background-color: #1976d2;
              color: #ffffff;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;">
            Reset Password
          </a>
        </div>

        <p style="margin-top: 24px;">
          This OTP will expire in <strong>10 minutes</strong>.
          If you didn’t request this, you can safely ignore this email.
        </p>

        <p style="margin-top: 32px;">
          Regards,<br />
          <strong>Your App Team</strong>
        </p>
      </div>
    </div>
  </div>
  `;

  await transporter.sendMail({
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Reset Your Password',
    html: htmlContent,
  });
};

module.exports = { sendResetEmail };
