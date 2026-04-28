const { sendEmail } = require("./emailService");
const axios = require("axios");

// ===============================
// 🌐 URL CONFIG
// ===============================
const normalizeBaseUrl = (url = "") => String(url).replace(/\/+$/, "");

const FRONTEND_URL = normalizeBaseUrl(
  process.env.PUBLIC_BASE_URL ||
    process.env.FRONTEND_URL ||
    "http://localhost:3000"
);

const BACKEND_URL = normalizeBaseUrl(
  process.env.BACKEND_URL ||
    process.env.API_BASE_URL ||
    "http://localhost:5000"
);

// ===============================
// 🧼 HELPERS
// ===============================
const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const formatCurrency = (value) =>
  `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const getImageUrl = (img) => {
  if (!img) return "https://placehold.co/90x90?text=No+Image";

  const cleanImg = String(img).trim();

  if (cleanImg.startsWith("http://") || cleanImg.startsWith("https://")) {
    return encodeURI(cleanImg);
  }

  if (cleanImg.startsWith("/uploads")) {
    return encodeURI(`${BACKEND_URL}${cleanImg}`);
  }

  if (cleanImg.startsWith("uploads")) {
    return encodeURI(`${BACKEND_URL}/${cleanImg}`);
  }

  if (cleanImg.startsWith("/")) {
    return encodeURI(`${FRONTEND_URL}${cleanImg}`);
  }

  return encodeURI(`${BACKEND_URL}/${cleanImg}`);
};

const normalizePhoneForWhatsApp = (phone = "") => {
  let clean = String(phone).replace(/\D/g, "");

  if (!clean) return "";

  if (clean.length === 10) {
    return `+91${clean}`;
  }

  if (clean.length === 12 && clean.startsWith("91")) {
    return `+${clean}`;
  }

  if (clean.length > 10) {
    return `+${clean}`;
  }

  return "";
};

const getCustomerPhone = (order) => {
  return (
    order?.userInfo?.phone ||
    order?.userInfo?.alternatePhone ||
    order?.phone ||
    ""
  );
};

// ===============================
// 📲 WHATSAPP SEND FUNCTION
// ===============================
const sendWhatsAppMessage = async (to, message) => {
  try {
    const whatsappPhone = normalizePhoneForWhatsApp(to);

    if (!whatsappPhone) {
      console.log("❌ WhatsApp phone missing or invalid");
      return false;
    }

    if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.log("❌ Twilio credentials missing");
      return false;
    }

    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_SID}/Messages.json`,
      new URLSearchParams({
        From: process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886",
        To: `whatsapp:${whatsappPhone}`,
        Body: message,
      }),
      {
        auth: {
          username: process.env.TWILIO_SID,
          password: process.env.TWILIO_AUTH_TOKEN,
        },
      }
    );

    console.log("✅ WhatsApp sent:", response.data.sid);
    return true;
  } catch (err) {
    console.error("❌ WhatsApp error:", err.response?.data || err.message);
    return false;
  }
};

// ===============================
// 📦 ORDER PLACED NOTIFICATION
// ===============================
async function sendOrderPlacedNotification(order) {
  const email = order?.userInfo?.email;
  const phone = getCustomerPhone(order);
  const trackingUrl = `${FRONTEND_URL}/checkout/success/${order._id}`;

  const productsHtml = (order.products || [])
    .map((item) => {
      const imageUrl = getImageUrl(item.img);

      return `
        <tr>
          <td style="padding:14px 10px;border-bottom:1px solid #e5e7eb;width:90px;">
            <img
              src="${imageUrl}"
              width="76"
              height="76"
              alt="${escapeHtml(item.name)}"
              style="display:block;width:76px;height:76px;border-radius:10px;object-fit:cover;border:1px solid #e5e7eb;background:#f8fafc;"
            />
          </td>

          <td style="padding:14px 10px;border-bottom:1px solid #e5e7eb;">
            <div style="font-size:15px;font-weight:700;color:#102033;margin-bottom:4px;">
              ${escapeHtml(item.name)}
            </div>
            <div style="font-size:13px;color:#64748b;line-height:1.6;">
              Brand: ${escapeHtml(item.brand || "Generic")}<br/>
              SKU: ${escapeHtml(item.sku || "N/A")}<br/>
              Qty: ${Number(item.quantity || 1)}
            </div>
          </td>

          <td style="padding:14px 10px;border-bottom:1px solid #e5e7eb;text-align:right;font-size:14px;font-weight:700;color:#102033;white-space:nowrap;">
            ${formatCurrency(item.lineTotal)}
          </td>
        </tr>
      `;
    })
    .join("");

  // ================= EMAIL =================
  if (email) {
    await sendEmail({
      to: email,
      subject: `Order Placed - ${order.orderNumber}`,
      html: `
        <div style="margin:0;padding:0;background:#eef3f8;font-family:Arial,Helvetica,sans-serif;">
          <div style="max-width:760px;margin:0 auto;padding:24px 12px;">
            <div style="background:#ffffff;border:1px solid #dbe4ee;border-radius:16px;overflow:hidden;">
              
              <div style="background:#102033;padding:22px 26px;text-align:center;">
                <div style="font-size:24px;font-weight:800;color:#ffffff;">
                  Royal Component
                </div>
                <div style="font-size:13px;color:#cbd5e1;margin-top:5px;">
                  Industrial Components | Bulk Supply | Trusted Support
                </div>
              </div>

              <div style="padding:28px 26px;">
                <h2 style="margin:0 0 16px;color:#102033;font-size:24px;">
                  🎉 Order Placed Successfully
                </h2>

                <p style="margin:0 0 14px;font-size:15px;color:#1f2937;">
                  Dear ${escapeHtml(order.userInfo?.name || "Customer")},
                </p>

                <p style="margin:0 0 18px;font-size:15px;color:#475569;line-height:1.7;">
                  Thank you for choosing <b>Royal Component</b>. Your order request has been received successfully.
                  Our team will verify product availability, quantity, pricing and dispatch details shortly.
                </p>

                <div style="background:#f8fbff;border:1px solid #dbeafe;border-radius:12px;padding:16px;margin:18px 0;">
                  <table width="100%" style="border-collapse:collapse;">
                    <tr>
                      <td style="font-size:14px;color:#64748b;padding:4px 0;">Order No</td>
                      <td style="font-size:14px;color:#102033;font-weight:700;text-align:right;padding:4px 0;">
                        ${escapeHtml(order.orderNumber)}
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size:14px;color:#64748b;padding:4px 0;">Status</td>
                      <td style="font-size:14px;color:#102033;font-weight:700;text-align:right;padding:4px 0;">
                        ${escapeHtml(order.orderStatus)}
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size:14px;color:#64748b;padding:4px 0;">Total Amount</td>
                      <td style="font-size:15px;color:#102033;font-weight:800;text-align:right;padding:4px 0;">
                        ${formatCurrency(order.pricing?.totalAmount)}
                      </td>
                    </tr>
                  </table>
                </div>

                <h3 style="margin:22px 0 10px;color:#102033;font-size:18px;">
                  🛒 Ordered Products
                </h3>

                <table width="100%" style="border-collapse:collapse;">
                  ${productsHtml}
                </table>

                <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:14px;margin-top:20px;color:#7c2d12;font-size:14px;line-height:1.6;">
                  <b>Estimated delivery:</b> 2-5 business days after confirmation.
                  For bulk or industrial items, delivery time may vary based on stock availability.
                </div>

                <div style="text-align:center;margin-top:26px;">
                  <a href="${trackingUrl}"
                    style="display:inline-block;background:#2454b5;color:#ffffff;text-decoration:none;padding:13px 26px;border-radius:10px;font-size:14px;font-weight:700;">
                    Track Your Order
                  </a>
                </div>

                <p style="margin:24px 0 0;font-size:14px;color:#64748b;line-height:1.7;">
                  Need help? Contact Royal Component support team anytime for order updates, quotation, bulk pricing or technical product assistance.
                </p>
              </div>

              <div style="background:#f8fafc;border-top:1px solid #e5e7eb;padding:18px;text-align:center;">
                <p style="margin:0;font-size:13px;color:#64748b;">
                  💙 Royal Component — Industrial Solutions Store
                </p>
                <p style="margin:6px 0 0;font-size:12px;color:#94a3b8;">
                  Fast Procurement | Trusted Components | Bulk Support
                </p>
              </div>

            </div>
          </div>
        </div>
      `,
    });
  }

  // ================= WHATSAPP PROFESSIONAL MESSAGE =================
  if (phone) {
    const productList = (order.products || [])
      .map((item, index) => {
        const imageUrl = getImageUrl(item.img);

        return `${index + 1}. ${item.name}
Brand: ${item.brand || "Generic"}
SKU: ${item.sku || "N/A"}
Quantity: ${Number(item.quantity || 1)}
Amount: ${formatCurrency(item.lineTotal)}
Product Image: ${imageUrl}`;
      })
      .join("\n\n");

    const whatsappMessage = `🎉 Order Request Received Successfully

Dear ${order.userInfo?.name || "Customer"},

Thank you for choosing Royal Component. We have received your order request and our team will review product availability, quantity, pricing and dispatch details shortly.

Order Summary
Order No: ${order.orderNumber}
Status: ${order.orderStatus}
Total Amount: ${formatCurrency(order.pricing?.totalAmount)}

Ordered Products:
${productList}

Delivery Information
Estimated delivery: 2-5 business days after confirmation.
For bulk or industrial components, delivery time may vary based on stock availability.

Track Your Order:
${trackingUrl}

Need assistance?
Our support team can help you with order updates, bulk pricing, quotations and technical product guidance.

Royal Component
Industrial Components | Bulk Supply | Trusted Support`;

    await sendWhatsAppMessage(phone, whatsappMessage);
  }
}

// ===============================
// 🚚 DELIVERED
// ===============================
async function sendOrderDeliveredNotification(order) {
  const email = order?.userInfo?.email;
  const phone = getCustomerPhone(order);
  const trackingUrl = `${FRONTEND_URL}/checkout/success/${order._id}`;

  const whatsappMsg = `✅ Order Delivered Successfully

Dear ${order.userInfo?.name || "Customer"},

Your order has been delivered successfully.

Order No: ${order.orderNumber}
Status: ${order.orderStatus}

View Order:
${trackingUrl}

Thank you for choosing Royal Component.

Royal Component
Industrial Components | Bulk Supply | Trusted Support`;

  if (email) {
    await sendEmail({
      to: email,
      subject: `Order Delivered - ${order.orderNumber}`,
      html: `
        <div style="font-family:Arial;background:#eef3f8;padding:24px;">
          <div style="max-width:650px;margin:auto;background:#fff;border-radius:14px;padding:24px;border:1px solid #e5e7eb;">
            <h2 style="color:#102033;">✅ Order Delivered</h2>
            <p>Dear ${escapeHtml(order.userInfo?.name || "Customer")},</p>
            <p>Your order <b>${escapeHtml(order.orderNumber)}</b> has been delivered successfully.</p>
            <p>Thank you for choosing <b>Royal Component</b>.</p>
            <div style="text-align:center;margin-top:20px;">
              <a href="${trackingUrl}" style="background:#2454b5;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;">
                View Order
              </a>
            </div>
          </div>
        </div>
      `,
    });
  }

  if (phone) {
    await sendWhatsAppMessage(phone, whatsappMsg);
  }
}

// ===============================
// ❌ CANCELLED
// ===============================
async function sendOrderCancelNotification(order) {
  const email = order?.userInfo?.email;
  const phone = getCustomerPhone(order);

  const whatsappMsg = `❌ Order Cancelled

Dear ${order.userInfo?.name || "Customer"},

Your order has been cancelled.

Order No: ${order.orderNumber}

For any help or clarification, please contact Royal Component support team.

Royal Component
Industrial Components | Bulk Supply | Trusted Support`;

  if (email) {
    await sendEmail({
      to: email,
      subject: `Order Cancelled - ${order.orderNumber}`,
      html: `
        <div style="font-family:Arial;background:#eef3f8;padding:24px;">
          <div style="max-width:650px;margin:auto;background:#fff;border-radius:14px;padding:24px;border:1px solid #e5e7eb;">
            <h2 style="color:#991b1b;">❌ Order Cancelled</h2>
            <p>Dear ${escapeHtml(order.userInfo?.name || "Customer")},</p>
            <p>Your order <b>${escapeHtml(order.orderNumber)}</b> has been cancelled.</p>
            <p style="color:#64748b;">For any help, contact Royal Component support team.</p>
          </div>
        </div>
      `,
    });
  }

  if (phone) {
    await sendWhatsAppMessage(phone, whatsappMsg);
  }
}

// ===============================
// EXPORTS
// ===============================
module.exports = {
  sendOrderPlacedNotification,
  sendOrderDeliveredNotification,
  sendOrderCancelNotification,
};