const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (email, subject, text) => {
  const mailOptions = {
    to: process.env.EMAIL_USER,
    subject: subject,
    text: text,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error
  }
};

module.exports = { sendMail };
