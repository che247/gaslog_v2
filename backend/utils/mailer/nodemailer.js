import dotenv from "dotenv";
const nodemailer = require("nodemailer");

dotenv.config();
const pass = process.env.GOOGLE_DEV_PW;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "che.dev247@gmail.com",
    pass: pass,
  },
});

export const sendEmail = async ({ from="che.dev247@gmail.com", to, subject, text, html }) => {
  const mailOptions = {
    from,
    to,
    subject,
    text,
  };

  if (html) {
    mailOptions.html = html;
  }

  const info = await transporter.sendMail({
    mailOptions,
  });

  console.log("Message sent: ", info.messageId);
};

const info = await transporter.sendMail({
  from: '"Che Meng Her" <pamela50@ethereal.email>',
  to: "pamela50@ethereal.email",
  subject: "TEST!",
  text: "Hello, this is a test message!",
  html: "<h1>Hello, this is a test message!</h1>",
});

console.log("Message sent: ", info.messageId);
