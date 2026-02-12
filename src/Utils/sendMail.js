// import nodemailer from "nodemailer";

// const SendMail = async ({ to, subject, html }) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.ADMIN_EMAIL,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: `"Book Store" <${process.env.ADMIN_EMAIL}>`,
//     to,
//     subject,
//     html,
//   });
// };

// export default SendMail;

import nodemailer from "nodemailer";

const SendMail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Book Store" <${process.env.ADMIN_EMAIL}>`,
    to,
    subject,
    html,
  });

  return info; // ⭐ ADD THIS LINE
};

export default SendMail;
