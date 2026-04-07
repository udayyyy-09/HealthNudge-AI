const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL/TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  const url = `https://health-ai-plum.vercel.app/verifyEmail?token=${token}`;     //url to verify email

  const html = `
    <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="text-align: center; color: #333333;">Welcome to <span style="color: #007BFF;">HealthNudge</span> 👋</h2>
        <p style="font-size: 16px; color: #555555;">Hi there,</p>
        <p style="font-size: 16px; color: #555555;">
          Thank you ${email} for registering with <strong>HealthNudge</strong>. To get started, please verify your email address by clicking the button below:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background: #007BFF; color: #ffffff; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold;">Verify Email</a>
        </div>
        <p style="font-size: 14px; color: #888888; text-align: center;">
          If you didn't create an account, you can safely ignore this email.
        </p>
        <p style="font-size: 14px; color: #999999; text-align: center;">
          — The HealthNudge
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: "HealthNudge- Your Health Companion", // sender address
    to: email,
    subject: 'Verify Your Email - HealthNudge',
    html
  });
};


module.exports = sendVerificationEmail;