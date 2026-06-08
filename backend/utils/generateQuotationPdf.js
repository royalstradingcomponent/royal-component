const PDFDocument = require("pdfkit");

const generateQuotationPdf = async (reqData, res = null) => {
    const doc = new PDFDocument({
        margin: 40,
        size: "A4",
    });

    if (res) {
        res.setHeader("Content-Type", "application/pdf");

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${reqData.quotationNumber || "quotation"}.pdf`,
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

    doc.rect(0, 0, 650, 125).fill(primary);

    doc.rect(0, 110, 650, 15).fill("#2563eb");

    doc
        .fillColor("white")
        .fontSize(30)
        .font("Helvetica-Bold")
        .text("ROYAL TRADING CO", 40, 28);

    doc.fontSize(11).font("Helvetica").text(
        "Industrial Electronic Components Supplier",

        42,
        65,
    );
    doc
        .fontSize(10)
        .fillColor("#dbeafe")
        .text(
            "Trusted Global Semiconductor & Electronic Components Distributor",
            42,
            82,
        );

    // RIGHT CONTACT

    doc.fontSize(10).font("Helvetica").text("Email:", 360, 32);

    doc.text("royalstradingcomponent1@gmail.com", 360, 48, {
        width: 190,
    });

    doc.text("Phone: +91 88511 49032", 360, 72);

    // ======================================================
    // TITLE
    // ======================================================

    doc.roundedRect(40, 130, 515, 50, 8).fill(lightBlue);

    doc
        .fillColor(primary)
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("QUOTATION", 55, 145);

    // ======================================================
    // QUOTATION INFO
    // ======================================================

    doc
        .fillColor(dark)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(`Quotation No: ${reqData.quotationNumber || "N/A"}`, 40, 205);

    doc
        .font("Helvetica")
        .text(
            `Date: ${new Date(reqData.createdAt).toLocaleDateString("en-IN")}`,
            40,
            225,
        );

    // ======================================================
    // CUSTOMER DETAILS
    // ======================================================

    doc
        .fillColor(primary)
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("Customer Details", 40, 270);

    doc.roundedRect(40, 300, 515, 145, 10).fillAndStroke("#f8fbff", border);

    let cy = 320;

    const addLine = (label, value) => {
        doc
            .font("Helvetica-Bold")
            .fontSize(11)
            .fillColor(primary)
            .text(`${label}:`, 60, cy);

        doc
            .font("Helvetica")
            .fillColor(dark)
            .text(value || "N/A", 170, cy, {
                width: 320,
            });

        cy += 22;
    };

    addLine("Customer Name", reqData.customerName);

    addLine("Company", reqData.companyName);

    addLine("Phone", reqData.customerPhone);

    addLine("Email", reqData.customerEmail);

    addLine(
        "Address",
        `${reqData.addressLine1 || ""} ${reqData.addressLine2 || ""}`,
    );

    addLine(
        "City / State",
        `${reqData.city}, ${reqData.state} - ${reqData.pinCode}`,
    );

    let tableTop = 500;

    doc
        .fillColor(primary)
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("Quotation Items", 40, tableTop);

    const headers = [
        "Component",
        "Part No",
        "Brand",
        "Qty",
        "Unit Price",
        "GST/Unit",
        "Without GST",
        "GST",
        "Total",
    ];

    const colWidths = [
        65, // Component
        65, // Part No
        50, // Brand
        35, // Qty
        55, // Unit Price
        55, // GST/Unit
        65, // Without GST
        50, // GST
        65, // Total
    ];

    let x = 40;
    let y = tableTop + 35;

    const PAGE_BOTTOM = 700;

const redrawTableHeader = () => {
    let hx = 40;

    headers.forEach((header, index) => {
        doc.rect(hx, y, colWidths[index], 30)
            .fillAndStroke("#0f4c81", "#0f4c81");

        doc.fillColor("white")
            .fontSize(9)
            .font("Helvetica-Bold")
            .text(header, hx + 4, y + 10, {
                width: colWidths[index] - 8,
                align: "center",
            });

        hx += colWidths[index];
    });

    y += 30;
};

    headers.forEach((header, index) => {
        doc.rect(x, y, colWidths[index], 30).fillAndStroke("#0f4c81", "#0f4c81");

        doc
            .fillColor("white")
            .fontSize(9)
            .font("Helvetica-Bold")
            .text(header, x + 4, y + 10, {
                width: colWidths[index] - 8,
                align: "center",
            });

        x += colWidths[index];
    });

    y += 30;

    (reqData.items || []).forEach((item, index) => {

        if (y > PAGE_BOTTOM) {
    doc.addPage();
    y = 50;
    redrawTableHeader();
}

        const qty = Number(item.quantity || 0);

        const unitPrice = Number(item.unitPrice || 0);

        const gst = Number(item.gstAmount || 0);

        const gstPerUnit = qty > 0 ? gst / qty : 0;

        const withoutGST = qty * unitPrice;

        const total = Number(item.lineTotal || 0);

        let rowX = 40;

        const row = [
            item.componentName || "-",
            item.partNumber || "-",
            item.brand || "-",
            qty,
            unitPrice.toFixed(2),
            gstPerUnit.toFixed(2),
            withoutGST.toFixed(2),
            gst.toFixed(2),
            total.toFixed(2)
        ];

        row.forEach((value, colIndex) => {
            doc
                .rect(rowX, y, colWidths[colIndex], 30)
                .fillAndStroke(index % 2 === 0 ? "#f8fbff" : "#eef6ff", border);

            doc
                .fillColor(dark)
                .fontSize(9)
                .font("Helvetica")
                .text(String(value), rowX + 2, y + 6, {
                    width: colWidths[colIndex] - 4,
                    align: "center",
                });

            rowX += colWidths[colIndex];
        });

        y += 30;
    });

    if (y + 250 > PAGE_BOTTOM) {
    doc.addPage();
    y = 50;
}


// ==========================================
// QUOTATION SUMMARY CARD
// ==========================================

const quotationCardY = y;

doc
  .roundedRect(40, quotationCardY, 515, 170, 15)
  .fillAndStroke("#f8fbff", border);

doc
  .fillColor(dark)
  .fontSize(24)
  .font("Helvetica-Bold")
  .text("Quotation Summary", 60, quotationCardY + 25);

const qTableY = quotationCardY + 75;

doc
  .roundedRect(55, qTableY, 485, 45, 10)
  .fill("#2563eb");

const qHeaders = [
  "TOTAL ITEMS",
  "TOTAL QTY",
  "TOTAL GST",
  "TOTAL VALUE"
];

const qColW = 485 / 4;

qHeaders.forEach((head, i) => {
  doc
    .fillColor("white")
    .fontSize(11)
    .font("Helvetica-Bold")
    .text(
      head,
      55 + (i * qColW),
      qTableY + 15,
      {
        width: qColW,
        align: "center",
      }
    );
});

doc
  .fillColor(dark)
  .fontSize(16)
  .font("Helvetica-Bold");

const totalItems = (reqData.items || []).length;

const totalQty = (reqData.items || []).reduce(
  (sum, item) => sum + Number(item.quantity || 0),
  0
);

const totalGST = (reqData.items || []).reduce(
  (sum, item) => sum + Number(item.gstAmount || 0),
  0
);

doc
  .fillColor(dark)
  .fontSize(18)
  .font("Helvetica-Bold");

doc.text(
  String(totalItems),
  55,
  qTableY + 70,
  {
    width: qColW,
    align: "center"
  }
);

doc.text(
  String(totalQty),
  55 + qColW,
  qTableY + 70,
  {
    width: qColW,
    align: "center"
  }
);

doc.text(
  `${totalGST.toFixed(2)}`,
  55 + qColW * 2,
  qTableY + 70,
  {
    width: qColW,
    align: "center"
  }
);

doc.text(
  `${Number(reqData.adminPrice || 0).toFixed(2)}`,
  55 + qColW * 3,
  qTableY + 70,
  {
    width: qColW,
    align: "center"
  }
);

y = quotationCardY + 190;
    // ======================================================
    // QUOTATION SUMMARY (MATCH WEBSITE DESIGN)
    // ======================================================

    y += 10;

    const summaryCardX = 40;
    const summaryCardY = y;
    const summaryCardW = 515;
    const summaryCardH = 210;
    // Outer Card
    doc
        .roundedRect(summaryCardX, summaryCardY, summaryCardW, summaryCardH, 15)
        .fillAndStroke("#f8fbff", border);

    doc
        .fillColor(dark)
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("Pricing Summary", summaryCardX + 25, summaryCardY + 25);

    // Table Start
    const tableY = summaryCardY + 75;
    const colW = summaryCardW / 4;

    // Header Background
    doc
        .roundedRect(summaryCardX + 15, tableY, summaryCardW - 30, 45, 10)
        .fill(primary);

    // Header Titles
    const heads = ["SUBTOTAL", "SGST", "CGST", "GRAND TOTAL"];

    heads.forEach((head, i) => {
        doc
            .fillColor("white")
            .fontSize(11)
            .font("Helvetica-Bold")
            .text(
                head,
                summaryCardX + (i * colW),
                tableY + 15,
                {
                    width: colW,
                    align: "center",
                }
            );
    });

    // Values Row
    const valueY = tableY + 85;

    const values = [
        `${Number(reqData.subTotal || 0).toFixed(2)}`,
        `${Number(reqData.sgstAmount || 0).toFixed(2)}`,
        `${Number(reqData.cgstAmount || 0).toFixed(2)}`,
        `${Number(reqData.adminPrice || 0).toFixed(2)}`
    ];

    values.forEach((val, i) => {
        doc
            .fillColor(i === 3 ? green : dark)
            .fontSize(18)
            .font("Helvetica-Bold")
            .text(
                val,
                summaryCardX + (i * colW),
                valueY,
                {
                    width: colW,
                    align: "center",
                }
            );
    });
   
   doc
  .fillColor(primary)
  .fontSize(12)
  .font("Helvetica-Bold")
  .text(
    `Lead Time : ${reqData.adminLeadTime || "2-5 Business Days"}`,
    summaryCardX + 20,
    valueY + 40
  );

    y = summaryCardY + summaryCardH + 40;

    if (y + 120 > PAGE_BOTTOM) {
    doc.addPage();
    y = 50;
}

    // ======================================================
    // FOOTER
    // ======================================================

    const footerY = y;

    // Top Border
    doc
        .moveTo(40, footerY - 25)
        .lineTo(555, footerY - 25)
        .strokeColor("#dbeafe")
        .lineWidth(1)
        .stroke();

    // Thank You
    doc
        .fillColor(primary)
        .fontSize(20)
        .font("Helvetica-Bold")
        .text(
            "Thank You For Your Business!",
            40,
            footerY,
            {
                width: 515,
                align: "center",
            }
        );

    // Company
    doc
        .fillColor(dark)
        .fontSize(10)
        .font("Helvetica")
        .text(
            "Royal Trading Co. | Industrial Electronic Components Supplier",
            40,
            footerY + 35,
            {
                width: 515,
                align: "center",
            }
        );

    // Contact
    doc.text(
        "royalstradingcomponent1@gmail.com | +91 88511 49032",
        40,
        footerY + 50,
        {
            width: 515,
            align: "center",
        }
    );

    // Generated Date
    doc
        .fillColor("#64748b")
        .fontSize(8)
        .text(
            `Generated On : ${new Date().toLocaleDateString("en-IN")}`,
            40,
            footerY + 68,
            {
                width: 515,
                align: "center",
            }
        );
    doc.end();

    return new Promise((resolve) => {
        doc.on("end", () => {
            const pdfBuffer = Buffer.concat(chunks);

            resolve(pdfBuffer);
        });
    });
};

module.exports = generateQuotationPdf;
