const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendWhatsAppQuotation = async ({
  customerPhone,
  items,
  totalPrice,
  leadTime,
}) => {
  try {

    const item = items?.[0];

    const quantity =
      Number(item?.quantity || 1);

    const unitPrice =
      Math.round(
        Number(totalPrice || 0) / quantity
      );

    const message = `
Royal Trading Co

Your quotation is ready.

Component:
${item?.componentName}

Part Number:
${item?.partNumber}

Brand:
${item?.brand}

Quantity:
${quantity}

Unit Price:
₹${unitPrice}

Total Amount:
₹${Number(totalPrice || 0).toLocaleString("en-IN")}

Lead Time:
${leadTime || "2-5 business days"}

Please reply on WhatsApp for order confirmation.
`;

    let cleanPhone =
      String(customerPhone || "")
        .replace(/\D/g, "");

    if (cleanPhone.length === 10) {
      cleanPhone = "91" + cleanPhone;
    }

    await client.messages.create({

      from:
        process.env.TWILIO_WHATSAPP_FROM,

      to:
        `whatsapp:+${cleanPhone}`,

      body:
        message,
    });

    console.log(
      "✅ WhatsApp quotation sent"
    );

  } catch (error) {

    console.log(
      "❌ TWILIO ERROR =>",
      error.message
    );

    console.log(
      error?.response?.data || error
    );
  }
};

module.exports = sendWhatsAppQuotation;