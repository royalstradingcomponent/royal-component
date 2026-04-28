const axios = require("axios");

const sendWhatsAppMessage = async (phone, message) => {
  try {
    let clean = String(phone || "").replace(/\D/g, "");

    if (clean.length === 10) {
      clean = "91" + clean;
    }

    const formattedPhone = `whatsapp:+${clean}`;

    const res = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_SID}/Messages.json`,
      new URLSearchParams({
        From: process.env.TWILIO_WHATSAPP_FROM,
        To: formattedPhone,
        Body: message,
      }),
      {
        auth: {
          username: process.env.TWILIO_SID,
          password: process.env.TWILIO_AUTH_TOKEN,
        },
      }
    );

    console.log("✅ WhatsApp sent:", res.data.sid);
  } catch (err) {
    console.error("❌ WhatsApp error:", err.response?.data || err.message);
  }
};

module.exports = { sendWhatsAppMessage };