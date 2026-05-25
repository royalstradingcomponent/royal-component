const PDFDocument = require("pdfkit");

const generateQuotationPdf = async (reqData, res = null) => {

    const doc = new PDFDocument({
        margin: 40,
        size: "A4",
    });

    if (res) {

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${reqData.quotationNumber || "quotation"}.pdf`
        );
    }

    const chunks = [];

    doc.on("data", (chunk) => {
        chunks.push(chunk);
    });

    if (res) {
        doc.pipe(res);
    }

    // ======================================================
    // COLORS
    // ======================================================

    const primary = "#0f4c81";
    const lightBlue = "#eef6ff";
    const border = "#dbeafe";
    const dark = "#0f172a";
    const green = "#166534";

    // ======================================================
    // HEADER
    // ======================================================

    doc
        .rect(0, 0, 650, 125)
        .fill(primary);

    doc
        .rect(0, 110, 650, 15)
        .fill("#2563eb");

    doc
        .fillColor("white")
        .fontSize(30)
        .font("Helvetica-Bold")
        .text(
            "ROYAL TRADING CO",
            40,
            28
        );

    doc
        .fontSize(11)
        .font("Helvetica")
        .text(
            "Industrial Electronic Components Supplier",

            42,
            65
        );
    doc
        .fontSize(10)
        .fillColor("#dbeafe")
        .text(
            "Trusted Global Semiconductor & Electronic Components Distributor",
            42,
            82
        );

    // RIGHT CONTACT

    doc
        .fontSize(10)
        .font("Helvetica")
        .text(
            "Email:",
            360,
            32
        );

    doc.text(
        "royalstradingcomponent1@gmail.com",
        360,
        48,
        {
            width: 190,
        }
    );

    doc.text(
        "Phone: +91 9334966286",
        360,
        72
    );

    // ======================================================
    // TITLE
    // ======================================================

    doc
        .roundedRect(40, 130, 515, 50, 8)
        .fill(lightBlue);

    doc
        .fillColor(primary)
        .fontSize(24)
        .font("Helvetica-Bold")
        .text(
            "QUOTATION",
            55,
            145
        );

    // ======================================================
    // QUOTATION INFO
    // ======================================================

    doc
        .fillColor(dark)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(
            `Quotation No: ${reqData.quotationNumber || "N/A"}`,
            40,
            205
        );

    doc
        .font("Helvetica")
        .text(
            `Date: ${new Date(
                reqData.createdAt
            ).toLocaleDateString("en-IN")}`,
            40,
            225
        );

    // ======================================================
    // CUSTOMER DETAILS
    // ======================================================

    doc
        .fillColor(primary)
        .fontSize(18)
        .font("Helvetica-Bold")
        .text(
            "Customer Details",
            40,
            270
        );

    doc
        .roundedRect(
            40,
            300,
            515,
            145,
            10
        )
        .fillAndStroke("#f8fbff", border);

    let cy = 320;

    const addLine = (label, value) => {

        doc
            .font("Helvetica-Bold")
            .fontSize(11)
            .fillColor(primary)
            .text(
                `${label}:`,
                60,
                cy
            );

        doc
            .font("Helvetica")
            .fillColor(dark)
            .text(
                value || "N/A",
                170,
                cy,
                {
                    width: 320,
                }
            );

        cy += 22;
    };

    addLine(
        "Customer Name",
        reqData.customerName
    );

    addLine(
        "Company",
        reqData.companyName
    );

    addLine(
        "Phone",
        reqData.customerPhone
    );

    addLine(
        "Email",
        reqData.customerEmail
    );

    addLine(
        "Address",
        `${reqData.addressLine1 || ""} ${reqData.addressLine2 || ""}`
    );

    addLine(
        "City / State",
        `${reqData.city}, ${reqData.state} - ${reqData.pinCode}`
    );

    // ======================================================
    // COMPONENT DETAILS
    // ======================================================

    doc
        .fillColor(primary)
        .fontSize(18)
        .font("Helvetica-Bold")
        .text(
            "Component Details",
            40,
            480
        );

    // TABLE HEADER

    const tableTop = 520;

    const col1 = 50;
    const col2 = 230;
    const col3 = 360;
    const col4 = 470;

    doc
        .rect(40, tableTop, 500, 35)
        .fill(primary);

    doc
        .fillColor("white")
        .fontSize(11)
        .font("Helvetica-Bold");

    doc.text(
        "Component",
        col1,
        tableTop + 11
    );

    doc.text(
        "Part Number",
        col2,
        tableTop + 11
    );

    doc.text(
        "Brand",
        col3,
        tableTop + 11
    );

    doc.text(
        "Qty",
        col4,
        tableTop + 11
    );

    let rowY = tableTop + 35;

    reqData.items.forEach((item, index) => {

        doc
            .rect(
                40,
                rowY,
                500,
                38
            )
            .fillAndStroke(
                index % 2 === 0
                    ? "#f8fbff"
                    : "#eef6ff",
                border
            );

        doc
            .fillColor(dark)
            .font("Helvetica")
            .fontSize(10);

        doc.text(
            item.componentName,
            col1,
            rowY + 12,
            {
                width: 150,
            }
        );

        doc.text(
            item.partNumber,
            col2,
            rowY + 12,
            {
                width: 110,
            }
        );

        doc.text(
            item.brand,
            col3,
            rowY + 12,
            {
                width: 90,
            }
        );

        doc.text(
            String(item.quantity),
            col4,
            rowY + 12
        );

        rowY += 38;
    });

    // ======================================================
    // PRICING SECTION
    // ======================================================

    // ======================================================
    // PRICING SECTION
    // ======================================================

    doc.addPage();

    doc
        .fillColor(primary)
        .fontSize(20)
        .font("Helvetica-Bold")
        .text(
            "Pricing Summary",
            40,
            50
        );

    // TABLE START

    const startX = 40;
    const startY = 100;

    const colWidths = [
        80,
        75,
        95,
        75,
        75,
        120,
    ];

    const headers = [
        "Unit Price",
        "Quantity",
        "Sub Total",
        "SGST",
        "CGST",
        "Grand Total",
    ];

    const values = [

        `Rs. ${(
            reqData.subTotal /
            reqData.items[0].quantity
        ).toFixed(2)}`,

        `${reqData.items[0].quantity}`,

        `Rs. ${Number(
            reqData.subTotal || 0
        ).toFixed(2)}`,

        `Rs. ${Number(
            reqData.sgstAmount || 0
        ).toFixed(2)}`,

        `Rs. ${Number(
            reqData.cgstAmount || 0
        ).toFixed(2)}`,

        `Rs. ${Number(
            reqData.adminPrice || 0
        ).toFixed(2)}`,
    ];

    // HEADER ROW

    let currentX = startX;

    headers.forEach((header, index) => {

        doc
            .rect(
                currentX,
                startY,
                colWidths[index],
                45
            )
            .fillAndStroke(
                primary,
                border
            );

        doc
            .fillColor("white")
            .fontSize(11)
            .font("Helvetica-Bold")
            .text(
                header,
                currentX + 8,
                startY + 15,
                {
                    width:
                        colWidths[index] - 10,
                    align: "center",
                }
            );

        currentX += colWidths[index];
    });

    // VALUE ROW

    currentX = startX;

    values.forEach((value, index) => {

        doc
            .rect(
                currentX,
                startY + 45,
                colWidths[index],
                60
            )
            .fillAndStroke(
                "#f8fbff",
                border
            );

        doc
            .fillColor(
                index === 5
                    ? green
                    : dark
            )
            .fontSize(
                index === 5
                    ? 16
                    : 12
            )
            .font(
                index === 5
                    ? "Helvetica-Bold"
                    : "Helvetica"
            )
            .text(
                value,
                currentX + 5,
                startY + 68,
                {
                    width:
                        colWidths[index] - 10,
                    align: "center",
                }
            );

        currentX += colWidths[index];
    });

    // LEAD TIME

    doc
        .roundedRect(
            40,
            230,
            500,
            55,
            8
        )
        .fill("#fff7ed");

    doc
        .fillColor("#b45309")
        .fontSize(14)
        .font("Helvetica-Bold")
        .text(
            "Lead Time",
            60,
            245
        );

    doc
        .fillColor(dark)
        .fontSize(12)
        .font("Helvetica")
        .text(
            reqData.adminLeadTime ||
            "2-5 business days",
            180,
            245
        );
    doc.moveDown(6);

   // ======================================================
// QUOTATION READY SECTION
// ======================================================

const readyTop = 310;

doc
    .roundedRect(40, readyTop, 500, 220, 12)
    .fill("#eff6ff");

doc
    .fillColor("#1e3a8a")
    .fontSize(24)
    .font("Helvetica-Bold")
    .text(
        "Quotation Details",
        60,
        readyTop + 20
    );

doc
    .fillColor("#111827")
    .fontSize(15)
    .font("Helvetica")
    .text(
        `Dear ${reqData.customerName},`,
        60,
        readyTop + 65
    );

doc
    .fontSize(14)
    .fillColor("#374151")
    .text(
        "Thank you for choosing Royal Trading Component.",
        60,
        readyTop + 95
    );

doc.text(
    "We are pleased to inform you that your requested components are currently available and your quotation has been successfully prepared.",
    60,
    readyTop + 125,
    {
        width: 420,
        lineGap: 5,
    }
);

// ======================================================
// INFO TABLE
// ======================================================

const infoTop = readyTop + 240;

doc
    .roundedRect(40, infoTop, 500, 115, 10)
    .fill("#ffffff");

doc
    .strokeColor("#dbeafe")
    .lineWidth(1)
    .roundedRect(40, infoTop, 500, 115, 10)
    .stroke();

doc
    .fillColor("#0f172a")
    .fontSize(13)
    .font("Helvetica-Bold");

doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .fillColor("#0f172a");

doc.text(
    `Quotation No : ${reqData.quotationNumber}`,
    60,
    infoTop + 25
);

doc.text(
    `Status : Quotation Ready`,
    60,
    infoTop + 55
);

doc.text(
    `Lead Time : ${reqData.adminLeadTime || "2-5 Business Days"}`,
    60,
    infoTop + 85
);

// ======================================================
// QUOTATION SUMMARY
// ======================================================

// ======================================================
// QUOTATION SUMMARY
// ======================================================

const summaryTop = infoTop + 145;

doc
    .fillColor("#0f172a")
    .fontSize(20)
    .font("Helvetica-Bold")
    .text(
        "Quotation Summary",
        40,
        summaryTop
    );

// HEADER

doc
    .rect(40, summaryTop + 35, 500, 38)
    .fill("#2563eb");

doc
    .fillColor("white")
    .fontSize(11)
    .font("Helvetica-Bold");

doc.text("Component", 60, summaryTop + 48);
doc.text("Qty", 285, summaryTop + 48);
doc.text("Unit Price", 355, summaryTop + 48);
doc.text("Total", 465, summaryTop + 48);

// ROW

const item = reqData.items?.[0];

doc
    .rect(40, summaryTop + 73, 500, 42)
    .fill("#f8fbff");

doc
    .strokeColor("#dbeafe")
    .lineWidth(1)
    .rect(40, summaryTop + 73, 500, 42)
    .stroke();

doc
    .fillColor("#111827")
    .font("Helvetica")
    .fontSize(11);

doc.text(
    item?.componentName || "-",
    60,
    summaryTop + 88,
    {
        width: 170,
    }
);

doc.text(
    String(item?.quantity || 0),
    295,
    summaryTop + 88
);

doc.text(
    `Rs. ${(
        reqData.subTotal /
        (item?.quantity || 1)
    ).toFixed(2)}`,
    350,
    summaryTop + 88
);

doc.text(
    `Rs. ${Number(
        reqData.subTotal || 0
    ).toFixed(2)}`,
    455,
    summaryTop + 88
);

// ======================================================
// NEW PAGE
// ======================================================

doc.addPage();

// ======================================================
// PRICING SUMMARY
// ======================================================

const pricingTop = 240;

doc
    .fillColor("#0f172a")
    .fontSize(22)
    .font("Helvetica-Bold")
    .text(
        "Pricing Summary",
        40,
        pricingTop
    );

doc
    .rect(40, pricingTop + 40, 500, 40)
    .fill("#0f4c81");

doc
    .fillColor("white")
    .fontSize(12)
    .font("Helvetica-Bold");

doc.text("Sub Total", 70, pricingTop + 53);
doc.text("SGST", 210, pricingTop + 53);
doc.text("CGST", 320, pricingTop + 53);
doc.text("Grand Total", 430, pricingTop + 53);

doc
    .rect(40, pricingTop + 80, 500, 55)
    .fill("#eff6ff");

doc
    .strokeColor("#dbeafe")
    .lineWidth(1)
    .rect(40, pricingTop + 80, 500, 55)
    .stroke();

doc
    .fillColor("#111827")
    .font("Helvetica")
    .fontSize(13);

doc.text(
    `Rs. ${Number(
        reqData.subTotal || 0
    ).toFixed(2)}`,
    70,
    pricingTop + 100
);

doc.text(
    `Rs. ${Number(
        reqData.sgstAmount || 0
    ).toFixed(2)}`,
    210,
    pricingTop + 100
);

doc.text(
    `Rs. ${Number(
        reqData.cgstAmount || 0
    ).toFixed(2)}`,
    320,
    pricingTop + 100
);

doc
    .fillColor("#166534")
    .font("Helvetica-Bold")
    .fontSize(16)
    .text(
        `Rs. ${Number(
            reqData.adminPrice || 0
        ).toFixed(2)}`,
        425,
        pricingTop + 98
    );

// ======================================================
// SUPPORT BOX
// ======================================================

const supportTop = 430;

doc
    .roundedRect(40, supportTop, 500, 90, 10)
    .fill("#f8fafc");

doc
    .fillColor("#374151")
    .font("Helvetica")
    .fontSize(13)
    .text(
        "For bulk orders, technical verification, urgent dispatch or custom pricing support, please contact our sales team.",
        65,
        supportTop + 28,
        {
            width: 420,
            lineGap: 4,
        }
    );

// ======================================================
// FOOTER
// ======================================================

const footerTop = 560;

doc
    .moveTo(40, footerTop)
    .lineTo(540, footerTop)
    .strokeColor("#cbd5e1")
    .stroke();

doc
    .fillColor("#111827")
    .fontSize(14)
    .font("Helvetica-Bold")
    .text(
        "Regards,",
        40,
        footerTop + 20
    );

doc
    .fillColor("#0f4c81")
    .fontSize(20)
    .font("Helvetica-Bold")
    .text(
        "Royal Trading Component",
        40,
        footerTop + 50
    );

doc
    .fillColor("#374151")
    .fontSize(13)
    .font("Helvetica")
    .text(
        "sales@royaltradingcomponent.com",
        40,
        footerTop + 82
    );

doc.text(
    "+91 93349 66286",
    40,
    footerTop + 102
);
    // ======================================================
    // FOOTER
    // ======================================================

    doc
        .rect(0, 770, 650, 50)
        .fill(dark);

    doc
        .fillColor("white")
        .fontSize(10)
        .font("Helvetica")
        .text(
            "Thank you for choosing Royal Trading Co.",
            0,
            785,
            {
                align: "center",
            }
        );

    doc.end();

    return new Promise((resolve) => {

        doc.on("end", () => {

            const pdfBuffer =
                Buffer.concat(chunks);

            resolve(pdfBuffer);
        });
    });
};

module.exports = generateQuotationPdf;