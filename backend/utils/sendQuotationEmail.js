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

const sendQuotationEmail = async ({
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
            <td style="padding:10px;border:1px solid #ddd;">
                ${item.componentName}
            </td>

            <td style="padding:10px;border:1px solid #ddd;">
                ${item.partNumber}
            </td>

            <td style="padding:10px;border:1px solid #ddd;">
                ${item.brand}
            </td>

            <td style="padding:10px;border:1px solid #ddd;">
                ${item.quantity}
            </td>
        </tr>
    `
        )
        .join("");

    await transporter.sendMail({
        from: process.env.SMTP_FROM,

        to: customerEmail,

        subject:
            "Quotation Ready - Royal Trading Co",

        html: `
        <div style="font-family:Arial;padding:20px;">

            <h2 style="color:#0f4c81;">
                Royal Trading Co
            </h2>

            <p>
                Hello ${customerName},
            </p>

            <div
    style="
        background:#f4f7fb;
        padding:20px;
        border-radius:10px;
        margin-top:20px;
        line-height:1.8;
        font-size:16px;
        color:#1e293b;
    "
>

    <strong style="font-size:18px;color:#0f4c81;">
        Great news!
    </strong>

    Your required components are currently
    available in stock and ready for dispatch.

    <br /><br />

    We have prepared your quotation with
    best pricing, fast delivery timeline
    and procurement support.

    <br /><br />

    For bulk discount, technical confirmation
    or immediate order processing, please
    call or WhatsApp our sales team.

</div>

            <table
                style="
                    border-collapse:collapse;
                    width:100%;
                    margin-top:20px;
                "
            >
                <thead>
                    <tr style="background:#0f4c81;color:white;">
                        <th style="padding:10px;border:1px solid #ddd;">
                            Component
                        </th>

                        <th style="padding:10px;border:1px solid #ddd;">
                            Part Number
                        </th>

                        <th style="padding:10px;border:1px solid #ddd;">
                            Brand
                        </th>

                        <th style="padding:10px;border:1px solid #ddd;">
                            Qty
                        </th>
                    </tr>
                </thead>

                <tbody>
                    ${itemHtml}
                </tbody>
            </table>

            <h3 style="margin-top:25px;color:#0f4c81;">
    Final Quotation
</h3>

<p style="font-size:16px;">
    Unit Price:
    ₹${(
                Number(totalPrice) /
                Number(items[0]?.quantity || 1)
            ).toFixed(2)}
</p>

<p style="font-size:16px;">
    Quantity:
    ${items[0]?.quantity || 1}
</p>

<h2 style="color:#0f4c81;">
    Total Amount:
    ₹${Number(totalPrice).toLocaleString("en-IN")}
</h2>

            <p>
                Lead Time:
                ${leadTime}
            </p>

            <p>
                For bulk orders and urgent dispatch,
                contact us directly.
            </p>

            <h3>
                📞 +91 88511 49032
            </h3>

            <p>
                Thank you,
                <br />
                Royal Trading Co
            </p>

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

module.exports = sendQuotationEmail;