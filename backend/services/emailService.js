const nodemailer = require("nodemailer");

// ===============================
// 📧 TRANSPORTER
// ===============================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT || 587) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ===============================
// ✅ VERIFY SMTP CONNECTION
// ===============================
const verifyEmailConfig = async () => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("❌ SMTP_USER or SMTP_PASS missing in .env");
      return false;
    }

    await transporter.verify();
    console.log("✅ SMTP server is ready to send emails");
    return true;
  } catch (error) {
    console.error("❌ SMTP verify failed:", error.message);
    return false;
  }
};

// ===============================
// 📧 SEND EMAIL FUNCTION
// ===============================
const sendEmail = async ({ to, subject, html }) => {
  if (!to) {
    console.log("❌ No email provided");
    return false;
  }

  if (!subject) {
    console.log("❌ Email subject missing");
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `Royal Component <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: html || "",
    });

    console.log("✅ Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Email send error:", error.message);

    if (error.code) {
      console.error("SMTP error code:", error.code);
    }

    if (error.response) {
      console.error("SMTP response:", error.response);
    }

    return false;
  }
};

// ===============================
// EXPORTS
// ===============================
module.exports = {
  sendEmail,
  verifyEmailConfig,
};