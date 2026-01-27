const nodemailer = require("nodemailer");
const contactEmailTemplate = require("../utils/contactEmailTemplate");

// Create transporter (email sender)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function that contact.routes.js will call
async function sendContactMail({ name, email, phone, country, message }) {
  await transporter.sendMail({
    from: `"Website Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,       // you receive the email
    replyTo: email,                   // reply goes to user
    subject: `New Contact Form Submission - ${name}`,
    html: contactEmailTemplate({
      name,
      email,
      phone,
      country,
      message,
    }),
  });
}

module.exports = { sendContactMail };
