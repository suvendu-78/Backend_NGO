import nodemailer from "nodemailer";

const SendMail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",     // ⭐ REQUIRED for production
      port: 465,                  // ⭐ secure port
      secure: true,               // ⭐ MUST be true
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Book Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);

    return info;

  } catch (error) {
    console.error("Email send error:", error.message);
    throw error;
  }
};

export default SendMail;