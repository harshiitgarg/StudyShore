import nodemailer from "nodemailer";
import { asyncHandler } from "./asyncHandler.js";

const mailSender = asyncHandler(async (email, title, body) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  const info = await transporter.sendMail({
    from: "StudyShore", // sender address
    to: `${email}`, // list of receivers
    subject: `${title}`, // Subject line
    html: `${body}`, // html body
  });
  console.log(info);
  return info;
});

export default mailSender;
