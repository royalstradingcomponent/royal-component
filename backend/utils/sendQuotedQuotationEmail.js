const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendQuotedQuotationEmail = async ({
  customerEmail,
  customerName,
  items,
  totalPrice,
  leadTime,
  quotationNumber,
  pdfBuffer,
}) => {

  const itemHtml = items
    .map(
      (item) => `
        <tr>

          <td style="padding:14px;border:1px solid #dbeafe;font-size:14px;">
            ${item.componentName || "-"}
          </td>

          <td style="padding:14px;border:1px solid #dbeafe;font-size:14px;">
            ${item.partNumber || "-"}
          </td>

          <td style="padding:14px;border:1px solid #dbeafe;font-size:14px;">
            ${item.brand || "-"}
          </td>

          <td style="padding:14px;border:1px solid #dbeafe;font-size:14px;text-align:center;">
            ${item.quantity || 0}
          </td>

        </tr>
      `
    )
    .join("");

  const unitPrice = (
    Number(totalPrice || 0) /
    Number(items?.[0]?.quantity || 1)
  ).toFixed(2);

  await transporter.sendMail({

    from: process.env.SMTP_FROM,

    to: customerEmail,

    subject: `Quotation Ready - ${quotationNumber}`,

    html: `

    <div
      style="
        background:#f4f7fb;
        padding:40px 0;
        font-family:Arial,sans-serif;
      "
    >

      <div
        style="
          max-width:750px;
          margin:auto;
          background:#ffffff;
          border-radius:14px;
          overflow:hidden;
          border:1px solid #dbeafe;
        "
      >

        <!-- HEADER -->

        <div
          style="
            background:#0f4c81;
            padding:35px;
            color:white;
          "
        >

          <h1
            style="
              margin:0;
              font-size:30px;
              font-weight:700;
            "
          >
            Royal Trading Component
          </h1>

          <p
            style="
              margin-top:10px;
              font-size:14px;
              color:#dbeafe;
            "
          >
            Industrial Electronic Components Supplier
          </p>

        </div>

        <!-- BODY -->

        <div style="padding:40px;">

          <h2
            style="
              margin-top:0;
              color:#0f172a;
              font-size:28px;
            "
          >
            Quotation Ready
          </h2>

          <p
            style="
              font-size:16px;
              color:#111827;
              line-height:28px;
            "
          >
            Dear ${customerName},
          </p>

          <p
            style="
              font-size:16px;
              color:#374151;
              line-height:30px;
            "
          >
            Thank you for choosing Royal Trading Component.
            We are pleased to inform you that your requested
            quotation has been successfully prepared and is
            ready for review.
          </p>

          <!-- INFO BOX -->

          <div
            style="
              background:#eff6ff;
              border:1px solid #dbeafe;
              border-radius:12px;
              padding:25px;
              margin-top:30px;
            "
          >

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
            >

              <tr>
                <td
                  style="
                    padding:10px 0;
                    font-weight:bold;
                    color:#0f172a;
                    width:180px;
                  "
                >
                  Quotation Number
                </td>

                <td
                  style="
                    padding:10px 0;
                    color:#374151;
                  "
                >
                  ${quotationNumber}
                </td>
              </tr>

              <tr>
                <td
                  style="
                    padding:10px 0;
                    font-weight:bold;
                    color:#0f172a;
                  "
                >
                  Status
                </td>

                <td
                  style="
                    padding:10px 0;
                    color:#16a34a;
                    font-weight:bold;
                  "
                >
                  Quotation Ready
                </td>
              </tr>

              <tr>
                <td
                  style="
                    padding:10px 0;
                    font-weight:bold;
                    color:#0f172a;
                  "
                >
                  Lead Time
                </td>

                <td
                  style="
                    padding:10px 0;
                    color:#374151;
                  "
                >
                  ${leadTime || "2-5 Business Days"}
                </td>
              </tr>

              <tr>
                <td
                  style="
                    padding:10px 0;
                    font-weight:bold;
                    color:#0f172a;
                  "
                >
                  Validity
                </td>

                <td
                  style="
                    padding:10px 0;
                    color:#374151;
                  "
                >
                  7 Days
                </td>
              </tr>

            </table>

          </div>

          <!-- COMPONENT TABLE -->

          <h3
            style="
              margin-top:40px;
              margin-bottom:18px;
              color:#0f172a;
              font-size:24px;
            "
          >
            Component Summary
          </h3>

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
              border-collapse:collapse;
              border:1px solid #dbeafe;
            "
          >

            <thead>

              <tr style="background:#2563eb;">

                <th
                  style="
                    padding:15px;
                    color:white;
                    text-align:left;
                    font-size:14px;
                  "
                >
                  Component
                </th>

                <th
                  style="
                    padding:15px;
                    color:white;
                    text-align:left;
                    font-size:14px;
                  "
                >
                  Part Number
                </th>

                <th
                  style="
                    padding:15px;
                    color:white;
                    text-align:left;
                    font-size:14px;
                  "
                >
                  Brand
                </th>

                <th
                  style="
                    padding:15px;
                    color:white;
                    text-align:center;
                    font-size:14px;
                  "
                >
                  Qty
                </th>

              </tr>

            </thead>

            <tbody>
              ${itemHtml}
            </tbody>

          </table>

          <!-- PRICING -->

          <h3
            style="
              margin-top:40px;
              margin-bottom:18px;
              color:#0f172a;
              font-size:24px;
            "
          >
            Pricing Summary
          </h3>

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
              border-collapse:collapse;
              border:1px solid #dbeafe;
            "
          >

            <thead>

              <tr style="background:#0f4c81;">

                <th
                  style="
                    padding:15px;
                    color:white;
                    font-size:14px;
                  "
                >
                  Unit Price
                </th>

                <th
                  style="
                    padding:15px;
                    color:white;
                    font-size:14px;
                  "
                >
                  Quantity
                </th>

                <th
                  style="
                    padding:15px;
                    color:white;
                    font-size:14px;
                  "
                >
                  Grand Total
                </th>

              </tr>

            </thead>

            <tbody>

              <tr style="background:#f8fbff;">

                <td
                  style="
                    padding:18px;
                    border:1px solid #dbeafe;
                    text-align:center;
                    font-size:15px;
                    color:#111827;
                  "
                >
                  ₹${unitPrice}
                </td>

                <td
                  style="
                    padding:18px;
                    border:1px solid #dbeafe;
                    text-align:center;
                    font-size:15px;
                    color:#111827;
                  "
                >
                  ${items?.[0]?.quantity || 1}
                </td>

                <td
                  style="
                    padding:18px;
                    border:1px solid #dbeafe;
                    text-align:center;
                    font-size:22px;
                    font-weight:bold;
                    color:#166534;
                  "
                >
                  ₹${Number(totalPrice || 0).toLocaleString("en-IN")}
                </td>

              </tr>

            </tbody>

          </table>

          <!-- SUPPORT BOX -->

          <div
            style="
              margin-top:35px;
              background:#f8fafc;
              border-radius:12px;
              padding:25px;
              border:1px solid #e2e8f0;
            "
          >

            <p
              style="
                margin:0;
                font-size:15px;
                line-height:28px;
                color:#374151;
              "
            >
              For bulk orders, urgent dispatch,
              technical verification or custom pricing,
              please contact our sales team.
            </p>

          </div>

          <!-- FOOTER -->

          <div
            style="
              margin-top:40px;
              padding-top:25px;
              border-top:1px solid #dbeafe;
            "
          >

            <p
              style="
                margin:0;
                font-size:15px;
                color:#111827;
              "
            >
              Regards,
            </p>

            <h3
              style="
                margin:10px 0 8px;
                color:#0f4c81;
                font-size:26px;
              "
            >
              Royal Trading Component
            </h3>

            <p
              style="
                margin:4px 0;
                color:#374151;
                font-size:15px;
              "
            >
              sales@royaltradingcomponent.com
            </p>

            <p
              style="
                margin:4px 0;
                color:#374151;
                font-size:15px;
              "
            >
              +91 93349 66286
            </p>

          </div>

        </div>

      </div>

    </div>
    `,

    attachments: pdfBuffer
      ? [
          {
            filename: `${quotationNumber}.pdf`,
            content: pdfBuffer,
          },
        ]
      : [],
  });
};

module.exports = sendQuotedQuotationEmail;