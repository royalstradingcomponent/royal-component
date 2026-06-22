const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({
  to,
  subject,
  html,
}) => {
  try {
    const result = await resend.emails.send({
      from: process.env.OTP_FROM_EMAIL,
      to,
      subject,
      html,
    });

    console.log("✅ Resend Email Sent:", result);

    return true;
  } catch (error) {
    console.error("❌ Resend Error:", error);

    return false;
  }
};

const verifyEmailConfig = async () => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log("❌ RESEND_API_KEY missing");
      return false;
    }

    console.log("✅ Resend Ready");

    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
};

module.exports = {
  sendEmail,
  verifyEmailConfig,
};