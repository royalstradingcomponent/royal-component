const ComponentRequest = require("../models/ComponentRequest");
const SupplierSource = require("../models/SupplierSource");
const PurchaseHistory = require("../models/PurchaseHistory");
const sendQuotationEmail = require("../utils/sendQuotationEmail");
// const sendWhatsAppQuotation = require("../utils/sendWhatsAppQuotation");
const generateQuotationPdf = require("../utils/generateQuotationPdf");
const sendQuotedQuotationEmail = require("../utils/sendQuotedQuotationEmail");
const PDFDocument = require("pdfkit");
const path = require("path");

const {
    runOCRFallback,
} = require(
    "../services/pdf-parser/ocrService"
);

const {
    mergeBrokenLines,
} = require(
    "../services/pdf-parser/smartImageParser"
);

const {
    extractComponents,
} = require(
    "../services/pdf-parser/componentExtractor"
);

// USER: create request
exports.createComponentRequest = async (req, res) => {
    try {
        const {
            items,
            description,
            customerName,
            customerEmail,
            customerPhone,

            companyName,
            addressLine1,
            addressLine2,
            city,
            state,
            pinCode,
        } = req.body;

        let parsedItems = [];
        let autoExtractedItems = [];

        try {
            parsedItems = typeof items === "string" ? JSON.parse(items) : items;
        } catch {
            parsedItems = [];
        }

        parsedItems = (parsedItems || [])
            .map((item) => ({
                componentName: String(item.componentName || "").trim(),
                partNumber: String(item.partNumber || "").trim(),
                brand: String(item.brand || "").trim(),
                quantity: Number(item.quantity || 1),
            }))
            .filter((item) => item.quantity > 0);

        if (
            !customerName?.trim() ||
            !customerEmail?.trim() ||
            !customerPhone?.trim() ||
            !description?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields",
            });
        }


        let matchedSupplierSources = [];

        let autoAdminPrice = 0;
        let subTotal = 0;

        let sgstAmount = 0;

        let cgstAmount = 0;

        const GST_PERCENT = 18;

        let autoLeadTime = "2-5 business days";

        let requestStatus = "checking";
        let foundSupplier = false;

        let autoCustomerMessage =
            "Thank you for your BOM requirement. Our sourcing team has reviewed your request and matching components are available. Final pricing, stock confirmation and fast delivery support are ready. Please contact our sales team for priority dispatch, bulk pricing and technical assistance.";

        const imageUrls =
            req.files?.images?.map(
                (file) => `/uploads/requests/${file.filename}`,
            ) || [];

        const datasheetUrls =
            req.files?.datasheets?.map(
                (file) => `/uploads/requests/${file.filename}`,
            ) || [];

        const hasPdf = datasheetUrls.length > 0;

        if (hasPdf) {
            console.time("TOTAL_PDF_PROCESS");
            try {

                const pdfFile =
                    req.files?.datasheets?.[0];

                if (pdfFile) {

                    const pdfParse =
                        require("pdf-parse");

                    const fs =
                        require("fs");

                    const buffer =
                        fs.readFileSync(
                            pdfFile.path
                        );
                    console.time("PDF_PARSE");

                    const pdfData =
                        await pdfParse(
                            buffer
                        );

                    console.timeEnd("PDF_PARSE");

                    let rawLines =
                        pdfData.text
                            .split("\n")
                            .map((line) =>
                                line.trim()
                            )
                            .filter(Boolean);

                    console.time("OCR");

                    if (
                        rawLines.length === 0
                    ) {
                        rawLines =
                            await runOCRFallback(
                                pdfFile.path
                            );
                    }

                    console.timeEnd("OCR");

                    const mergedLines =
                        mergeBrokenLines(
                            rawLines
                        );

                    console.time("EXTRACT_COMPONENTS");

                    const components =
                        extractComponents(
                            mergedLines
                        );



                    autoExtractedItems =
                        components.map(
                            (item) => ({
                                componentName:
                                    item.componentName || "",

                                partNumber:
                                    item.partNumber ||
                                    item.componentName ||
                                    "",

                                brand:
                                    item.brand ||
                                    "",

                                quantity:
                                    Number(
                                        item.quantity || 1
                                    ),
                            })
                        );

                    console.timeEnd("TOTAL_PDF_PROCESS");

                    if (
                        autoExtractedItems.length > 0
                    ) {
                        parsedItems =
                            autoExtractedItems;
                    }
                }

            } catch (error) {

                console.log(
                    "PDF OCR ERROR =>",
                    error
                );

            }
        }

        if (!hasPdf) {

            const invalidItem = parsedItems.find(
                (item) =>
                    !item.componentName ||
                    !item.partNumber ||
                    !item.brand ||
                    item.quantity <= 0
            );

            if (invalidItem) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Component Name, Part Number, Brand and Quantity are required when PDF is not uploaded",
                });
            }
        }


        console.log(
            "TOTAL COMPONENTS =>",
            parsedItems.length
        );

        const allSuppliers =
            await SupplierSource.find({
                availabilityStatus: "available",
                isActive: true,
            }).lean();

        console.time("MATCHING");
        for (const item of parsedItems) {

            item.availabilityStatus = "checking";

            item.unitPrice = 0;

            item.gstAmount = 0;

            item.lineTotal = 0;

            const supplier =
                allSuppliers.find((s) => {

                    const requestPart =
                        String(item.partNumber || "")
                            .trim()
                            .toUpperCase();

                    const supplierPart =
                        String(s.partNumber || "")
                            .trim()
                            .toUpperCase();

                    return (
                        requestPart &&
                        supplierPart &&
                        requestPart === supplierPart
                    );
                });

            if (!supplier) {
                continue;
            }

            foundSupplier = true;

            item.availabilityStatus =
                "available";

            const requestedQty =
                Number(item.quantity || 1);

            const unitPrice =
                Number(
                    supplier.sellingPrice || 0
                );

            const lineSubTotal =
                unitPrice * requestedQty;

            const gstAmount =
                (lineSubTotal *
                    Number(
                        supplier.gstPercent || 18
                    )) /
                100;

            const lineTotal =
                lineSubTotal + gstAmount;

            item.unitPrice =
                Number(
                    unitPrice.toFixed(2)
                );

            item.gstAmount =
                Number(
                    gstAmount.toFixed(2)
                );

            item.lineTotal =
                Number(
                    lineTotal.toFixed(2)
                );

            subTotal += lineSubTotal;

            matchedSupplierSources.push({
                supplierSource:
                    supplier._id,

                supplierCompany:
                    supplier.supplierCompany,

                componentName:
                    supplier.componentName,

                partNumber:
                    supplier.partNumber,

                brand:
                    supplier.brand,

                purchasePrice:
                    supplier.purchasePrice,

                requestedQty,

                unitPrice,

                lineTotal,

                finalSellingPrice:
                    Number(
                        lineTotal.toFixed(2)
                    ),

                gstPercent:
                    supplier.gstPercent,

                gstAmount,

                profitPercent:
                    supplier.profitPercent,

                extraCharge:
                    supplier.extraCharge,

                moq:
                    supplier.moq,

                leadTime:
                    supplier.leadTime,

                phone:
                    supplier.phone,

                email:
                    supplier.email,

                availabilityStatus:
                    "available",
            });
        }

        sgstAmount =
            subTotal * 0.09;

        cgstAmount =
            subTotal * 0.09;

        autoAdminPrice =
            subTotal +
            sgstAmount +
            cgstAmount;

        console.log(
            "MATCHED =>",
            matchedSupplierSources.length
        );

        console.timeEnd("MATCHING");
        if (foundSupplier) {
            requestStatus = "available";
        }
        console.time("DB_SAVE");


        const request = await ComponentRequest.create({
            quotationNumber: `RTC-${Date.now()}`,

            items: parsedItems,
            description,
            customerName,
            customerEmail,
            customerPhone,
            companyName,
            addressLine1,
            addressLine2,
            city,
            state,
            pinCode,
            user: req.user?._id || null,
            imageUrls,
            datasheetUrls,
            matchedSupplierSources,

            adminPrice: Number(autoAdminPrice.toFixed(0)),
            subTotal: Number(subTotal.toFixed(2)),

            sgstAmount: Number(sgstAmount.toFixed(2)),

            cgstAmount: Number(cgstAmount.toFixed(2)),
            adminLeadTime: autoLeadTime,
            customerMessage: autoCustomerMessage,

            activityLogs: [
                {
                    message: "Customer submitted BOM request",
                },

                {
                    message: "Automatic supplier matching completed",
                },
            ],
            status: requestStatus,
        });

        console.timeEnd("DB_SAVE");

        if (requestStatus === "available") {

            console.log("REQUEST STATUS =>", requestStatus);

            const pdfBuffer = await generateQuotationPdf(request);

            await sendQuotationEmail({
                customerEmail,
                customerName,
                items: parsedItems,
                totalPrice: autoAdminPrice,
                leadTime: autoLeadTime,
                quotationNumber: request.quotationNumber,
                pdfBuffer,
            });

            // console.log("CALLING WHATSAPP FUNCTION");

            // await sendWhatsAppQuotation({
            //     customerPhone,
            //     items: parsedItems,
            //     totalPrice: autoAdminPrice,
            //     leadTime: autoLeadTime,
            // });

            // console.log("WHATSAPP FUNCTION FINISHED");
        }

        res.status(201).json({
            success: true,
            message: "Requirement submitted successfully",
            request,
        });
    } catch (error) {
        console.error("Create component request error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while submitting request",
        });
    }
};

// ADMIN: get all requests
exports.getAllComponentRequests = async (req, res) => {
    try {
        const {
            status,
            search,
            page = 1,
            limit = 100000
        } = req.query;

        const filter = {};

        if (status && status !== "all") {
            filter.status = status;
        }

        if (search) {
            filter.$or = [
                { "items.componentName": { $regex: search, $options: "i" } },
                { "items.partNumber": { $regex: search, $options: "i" } },
                { "items.brand": { $regex: search, $options: "i" } },
                { customerEmail: { $regex: search, $options: "i" } },
                { customerPhone: { $regex: search, $options: "i" } },
            ];
        }

        const [requests, total] = await Promise.all([
            ComponentRequest.find(filter)
                .sort({ createdAt: -1 }),

            ComponentRequest.countDocuments(filter),
        ]);

        res.json({
            success: true,
            requests,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
        });
    } catch (error) {
        console.error("Get component requests error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching requests",
        });
    }
};

// ADMIN: update request
exports.updateComponentRequest = async (req, res) => {
    try {
        const {
            status,
            adminPrice,
            adminLeadTime,
            adminNote,
            customerMessage,
            adminContactNumber,
            availableItemsNote,
        } = req.body;

        const updatedItems = req.body.items || [];

        const request = await ComponentRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found",
            });
        }

        const allowedStatus = [
            "new",
            "checking",
            "available",
            "quoted",
            "unavailable",
            "closed",
        ];

        if (status && allowedStatus.includes(status)) {
            request.status = status;
        }

        if (status === "available" || status === "quoted") {
            // quotation number generate
            if (!request.quotationNumber) {
                request.quotationNumber = `RTC-${Date.now()}`;
            }

            // component data
            const componentName = request.items?.[0]?.componentName || "";

            const quantity = request.items?.[0]?.quantity || 0;

            const unitPrice = request.subTotal || 0;

            const gst = (request.sgstAmount || 0) + (request.cgstAmount || 0);

            const finalTotal = request.adminPrice || 0;

            // automatic customer message
            request.quotationSentAt = new Date();

            request.customerMessage = `
                    Dear ${request.customerName},

    Thank you for choosing Royal Trading Component.

    We are pleased to inform you that your requested components are currently available and your quotation has been successfully prepared.

    Quotation Details:
    ------------------------------------------------
    Quotation No: ${request.quotationNumber}
    Status: ${status === "quoted" ? "Quotation Ready" : "Product Available"}

    Lead Time: ${request.adminLeadTime || "2-5 Business Days"}
    Validity: 7 Days
    ------------------------------------------------

    Please find the quotation summary below:

    Component Name:
    ${componentName}

    Quantity:
    ${quantity}

    Unit Price:
    ₹${unitPrice}

    GST:
    ₹${gst}

    Final Total:
    ₹${finalTotal}

    The detailed quotation PDF is attached with this email.

    For bulk orders, technical verification, urgent dispatch, or custom pricing, please contact our sales team.

    Regards,
    Royal Trading Component
    sales@royaltradingcomponent.com
    `;
        }
        request.activityLogs.push({
            message: `Request status changed to ${status}`,
        });

        if (adminPrice !== undefined) {
            const subTotal = Number(adminPrice || 0);

            const sgstAmount = Math.round(subTotal * 0.09);

            const cgstAmount = Math.round(subTotal * 0.09);

            const finalTotal = subTotal + sgstAmount + cgstAmount;

            request.subTotal = subTotal;

            request.sgstAmount = sgstAmount;

            request.cgstAmount = cgstAmount;

            request.adminPrice = finalTotal;
        }

        if (adminLeadTime !== undefined) {
            request.adminLeadTime = String(adminLeadTime || "").trim();
        }

        if (adminNote !== undefined) {
            request.adminNote = String(adminNote || "").trim();
        }

        if (customerMessage !== undefined) {
            request.customerMessage = String(customerMessage || "").trim();
        }

        if (adminContactNumber !== undefined) {
            request.adminContactNumber = String(adminContactNumber || "").trim();
        }

        if (availableItemsNote !== undefined) {
            request.availableItemsNote = String(availableItemsNote || "").trim();
        }

        if (updatedItems.length) {

            let subTotal = 0;

            updatedItems.forEach((item) => {

                const qty =
                    Number(item.quantity || 0);

                const unitPrice =
                    Number(item.unitPrice || 0);

                const gstAmount =
                    Number(item.gstAmount || 0);

                const lineTotal =
                    (qty * unitPrice) + gstAmount;

                item.lineTotal =
                    Number(lineTotal.toFixed(2));

                subTotal += lineTotal;

            });

            const sgstAmount =
                Number((subTotal * 0.09).toFixed(2));

            const cgstAmount =
                Number((subTotal * 0.09).toFixed(2));

            request.subTotal =
                Number(subTotal.toFixed(2));

            request.sgstAmount =
                sgstAmount;

            request.cgstAmount =
                cgstAmount;

            request.adminPrice =
                Number(
                    (subTotal + sgstAmount + cgstAmount)
                        .toFixed(2)
                );

            let availableCount = 0;

            updatedItems.forEach((item) => {
                if (item.availabilityStatus === "available") {
                    availableCount++;
                }
            });

            if (availableCount > 0) {
                request.status = "available";
            } else {
                request.status = "checking";
            }

            request.items =
                updatedItems;



            request.activityLogs.push({
                message:
                    "Component pricing and availability updated by admin",
            });

        }

        console.log("REQUEST BEFORE SAVE =>", {
            customerName: request.customerName,
            city: request.city,
            addressLine1: request.addressLine1,
            state: request.state,
            pinCode: request.pinCode,
            status: request.status,
        });

        await request.save();

        if (status === "quoted") {
            const pdfBuffer = await generateQuotationPdf(request);

            await sendQuotedQuotationEmail({
                customerEmail: request.customerEmail,

                customerName: request.customerName,

                items: request.items,

                totalPrice: request.adminPrice,

                leadTime: request.adminLeadTime,

                quotationNumber: request.quotationNumber,

                pdfBuffer,
            });
        }

        res.json({
            success: true,
            message: "Request updated successfully",
            request,
        });
    } catch (error) {
        console.error("Update component request error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while updating request",
        });
    }
};

// USER: my requests

exports.getComponentRequestsByEmail = async (req, res) => {
    try {
        const { search } = req.query;

        if (!search) {
            return res.status(400).json({
                success: false,
                message: "Search value is required",
            });
        }

        const value = String(search).trim();

        const requests = await ComponentRequest.find({
            $or: [
                {
                    customerEmail: {
                        $regex: value,
                        $options: "i",
                    },
                },

                {
                    customerPhone: {
                        $regex: value,
                        $options: "i",
                    },
                },

                {
                    "items.componentName": {
                        $regex: value,
                        $options: "i",
                    },
                },

                {
                    "items.partNumber": {
                        $regex: value,
                        $options: "i",
                    },
                },

                {
                    "items.brand": {
                        $regex: value,
                        $options: "i",
                    },
                },
            ],
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            requests,
        });
    } catch (error) {
        console.error("Get component requests lookup error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching requests",
        });
    }
};

// USER: all public requests

exports.getMyComponentRequests = async (req, res) => {
    try {
        const filters = [];

        // user id match
        if (req.user?._id) {
            filters.push({
                user: req.user._id,
            });
        }

        // email match
        if (req.user?.email) {
            filters.push({
                customerEmail: {
                    $regex: new RegExp(`^${req.user.email}$`, "i"),
                },
            });
        }

        // phone match
        if (req.user?.phone) {
            filters.push({
                customerPhone: {
                    $regex: new RegExp(req.user.phone, "i"),
                },
            });
        }

        const requests = await ComponentRequest.find(
            { $or: filters },
            {
                matchedSupplierSources: 0,
                activityLogs: 0,
            }
        )
            .sort({ createdAt: -1 })
            .lean();

        res.json({
            success: true,
            requests,
        });
    } catch (error) {
        console.error("Get my requests error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching requests",
        });
    }
};

exports.downloadQuotationPdf = async (req, res) => {
    try {
        const quotation = await ComponentRequest.findById(req.params.id);

        if (!quotation) {
            return res.status(404).json({
                message: "Quotation not found",
            });
        }

        quotation.activityLogs.push({
            message: "Quotation PDF downloaded",
        });

        await quotation.save();

        generateQuotationPdf(quotation, res);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "PDF generation failed",
        });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const totalRequests = await ComponentRequest.countDocuments();

        const availableRequests = await ComponentRequest.countDocuments({
            status: "available",
        });

        const quotedRequests = await ComponentRequest.countDocuments({
            status: "quoted",
        });

        const closedRequests = await ComponentRequest.countDocuments({
            status: "closed",
        });

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const todayRequests = await ComponentRequest.countDocuments({
            createdAt: {
                $gte: today,
            },
        });

        const revenueResult = await ComponentRequest.aggregate([
            {
                $match: {
                    status: {
                        $in: ["available", "quoted", "closed"],
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$adminPrice",
                    },
                },
            },
        ]);

        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        const recentRequests = await ComponentRequest.find()
            .sort({ createdAt: -1 })
            .limit(5);

        const totalQuotationRequests = await ComponentRequest.find().sort({
            createdAt: -1,
        });

        const todayQuotationRequests = await ComponentRequest.find({
            createdAt: {
                $gte: today,
            },
        }).sort({ createdAt: -1 });

        const latestQuotations = await ComponentRequest.find({
            status: {
                $in: ["available", "quoted"],
            },
        })
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,

            stats: {
                totalRequests,
                availableRequests,
                quotedRequests,
                closedRequests,
                todayRequests,
                totalRevenue,
            },

            recentRequests,

            totalQuotationRequests,

            todayQuotationRequests,

            latestQuotations,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Dashboard stats failed",
        });
    }
};

exports.getSingleComponentRequest = async (req, res) => {
    try {
        const request = await ComponentRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found",
            });
        }

        res.json({
            success: true,
            request,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.getCalendarRequests = async (req, res) => {
    try {
        const month = Number(req.query.month);

        const year = Number(req.query.year);

        const startDate = new Date(year, month, 1);

        const endDate = new Date(year, month + 1, 1);

        const requests = await ComponentRequest.find({
            createdAt: {
                $gte: startDate,
                $lt: endDate,
            },
        }).sort({ createdAt: -1 });

        const totalRevenue = requests.reduce(
            (acc, item) => acc + Number(item.adminPrice || 0),
            0,
        );

        const quotedRequests = requests.filter((r) => r.status === "quoted").length;

        res.json({
            success: true,

            stats: {
                totalRequests: requests.length,

                quotedRequests,

                totalRevenue,
            },

            requests,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Calendar data fetch failed",
        });
    }
};

exports.getRevenueRequests = async (req, res) => {

    try {

        const requests =
            await ComponentRequest.find({

                status: {
                    $in: ["quoted", "closed"],
                },

            }).sort({
                createdAt: -1,
            });

        const totalRevenue =
            requests.reduce(
                (acc, item) =>
                    acc +
                    Number(item.adminPrice || 0),
                0
            );

        res.json({

            success: true,

            totalRevenue,

            totalRequests:
                requests.length,

            requests,

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message:
                "Revenue fetch failed",

        });

    }

};
const downloadFullRequestPdf = async (req, res) => {
    try {
        const request = await ComponentRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                message: "Request not found",
            });
        }

        const doc = new PDFDocument({
            size: "A4",
            margin: 40,
        });

        const filename = `Request-${request.quotationNumber}.pdf`;

        res.setHeader("Content-Type", "application/pdf");

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}"`
        );

        doc.pipe(res);

        // =========================
        // COLORS
        // =========================

        const COLORS = {
            primary: "#1e3a8a",
            secondary: "#2563eb",
            border: "#bfdbfe",
            bg: "#f8fafc",
            text: "#111827",
            gray: "#6b7280",
            white: "#ffffff",
        };

        // =========================
        // SIZES
        // =========================

        const PAGE_WIDTH =
            doc.page.width -
            doc.page.margins.left -
            doc.page.margins.right;

        const CARD_WIDTH = PAGE_WIDTH;

        const START_X = 40;

        const FOOTER_SPACE = 55;

        let currentY = 40;

        // =========================
        // PAGE HELPER
        // =========================

        const safeBottom = () =>
            doc.page.height -
            doc.page.margins.bottom -
            FOOTER_SPACE;

        const checkPageBreak = (heightNeeded = 100) => {
            if (currentY + heightNeeded > safeBottom()) {
                doc.addPage();
                currentY = 40;
            }
        };

        // =========================
        // HEADER
        // =========================

        const drawHeader = () => {
            doc
                .rect(0, 0, doc.page.width, 95)
                .fill(COLORS.primary);

            doc
                .fillColor(COLORS.white)
                .font("Helvetica-Bold")
                .fontSize(24)
                .text(
                    "Royal Trading Component",
                    0,
                    28,
                    { align: "center" }
                );

            doc
                .font("Helvetica")
                .fontSize(13)
                .text(
                    "Professional Quotation Request",
                    0,
                    60,
                    { align: "center" }
                );

            currentY = 120;
        };

        drawHeader();

        // =========================
        // SECTION TITLE
        // =========================

        const drawSectionTitle = (title) => {
            checkPageBreak(60);

            doc
                .fillColor(COLORS.primary)
                .font("Helvetica-Bold")
                .fontSize(22)
                .text(title, START_X, currentY);

            currentY += 35;
        };

        // =========================
        // CARD
        // =========================

        const drawCard = ({
            rows = [],
            title = "",
        }) => {

            const LABEL_WIDTH = 160;

            const VALUE_WIDTH = 300;

            let contentHeight = 20;

            if (title) {
                contentHeight += 28;
            }

            rows.forEach((row) => {

                const rowHeight = Math.max(

                    doc.heightOfString(
                        row.label || "",
                        {
                            width: LABEL_WIDTH,
                        }
                    ),

                    doc.heightOfString(
                        row.value || "",
                        {
                            width: VALUE_WIDTH,
                        }
                    )

                );

                contentHeight += rowHeight + 10;
            });

            const finalHeight =
                contentHeight + 25;

            checkPageBreak(finalHeight + 20);

            doc
                .roundedRect(
                    START_X,
                    currentY,
                    CARD_WIDTH,
                    finalHeight,
                    12
                )
                .fillAndStroke(
                    COLORS.bg,
                    COLORS.border
                );

            let innerY =
                currentY + 18;

            if (title) {
                doc
                    .fillColor(COLORS.secondary)
                    .font("Helvetica-Bold")
                    .fontSize(16)
                    .text(
                        title,
                        START_X + 18,
                        innerY
                    );

                innerY += 28;
            }

            rows.forEach((row) => {

                const rowHeight = Math.max(

                    doc.heightOfString(
                        row.label || "",
                        {
                            width: LABEL_WIDTH,
                        }
                    ),

                    doc.heightOfString(
                        row.value || "",
                        {
                            width: VALUE_WIDTH,
                        }
                    )

                );

                doc
                    .fillColor(COLORS.text)
                    .font("Helvetica-Bold")
                    .fontSize(12)
                    .text(
                        row.label,
                        START_X + 18,
                        innerY,
                        {
                            width: LABEL_WIDTH,
                        }
                    );

                doc
                    .font("Helvetica")
                    .text(
                        row.value || "N/A",
                        START_X + 180,
                        innerY,
                        {
                            width: VALUE_WIDTH,
                        }
                    );

                innerY += rowHeight + 10;
            });

            currentY +=
                finalHeight + 12;
        };

        // =========================
        // QUOTATION INFO
        // =========================

        drawCard({
            rows: [
                {
                    label: "Quotation Number",
                    value: request.quotationNumber || "N/A",
                },
                {
                    label: "Status",
                    value: String(
                        request.status || "N/A"
                    ).toUpperCase(),
                },
                {
                    label: "Lead Time",
                    value:
                        request.adminLeadTime ||
                        "2-5 Business Days",
                },
                {
                    label: "Total Amount",
                    value: `Rs. ${Number(
                        request.adminPrice || 0
                    ).toLocaleString("en-IN")}`,
                },
            ],
        });

        // =========================
        // CUSTOMER INFO
        // =========================

        drawCard({
            title: "Customer Information",
            rows: [
                {
                    label: "Name",
                    value: request.customerName,
                },
                {
                    label: "Email",
                    value: request.customerEmail,
                },
                {
                    label: "Phone",
                    value: request.customerPhone,
                },
                {
                    label: "Company",
                    value: request.companyName || "N/A",
                },
                {
                    label: "Address",
                    value: [
                        request.addressLine1,
                        request.addressLine2,
                        request.city,
                        request.state,
                        request.pinCode,
                    ]
                        .filter(Boolean)
                        .join(", "),
                },
            ],
        });

        // =========================
        // REQUESTED COMPONENTS
        // =========================

        drawSectionTitle(
            "Requested Components"
        );

        request.items.forEach((item) => {

            drawCard({
                rows: [
                    {
                        label: "Component",
                        value: item.componentName,
                    },
                    {
                        label: "Part Number",
                        value: item.partNumber,
                    },
                    {
                        label: "Brand",
                        value: item.brand,
                    },
                    {
                        label: "Quantity",
                        value: String(item.quantity),
                    },
                ],
            });

        });

        // =========================
        // SUPPLIER HISTORY
        // =========================

        if (
            request.matchedSupplierSources &&
            request.matchedSupplierSources.length
        ) {

            drawSectionTitle(
                "Supplier History"
            );

            request.matchedSupplierSources.forEach(
                (supplier) => {

                    drawCard({
                        rows: [
                            {
                                label: "Supplier",
                                value:
                                    supplier.supplierCompany || "N/A",
                            },
                            {
                                label: "Component",
                                value:
                                    supplier.componentName || "N/A",
                            },
                            {
                                label: "Part Number",
                                value:
                                    supplier.partNumber || "N/A",
                            },
                            {
                                label: "Brand",
                                value:
                                    supplier.brand || "N/A",
                            },
                            {
                                label: "MOQ",
                                value:
                                    String(supplier.moq || 0),
                            },
                            {
                                label: "Purchase Price",
                                value:
                                    `Rs. ${supplier.purchasePrice || 0}`,
                            },
                            {
                                label: "Profit %",
                                value:
                                    `${supplier.profitPercent || 0}%`,
                            },
                            {
                                label: "GST %",
                                value:
                                    `${supplier.gstPercent || 0}%`,
                            },
                            {
                                label: "GST Amount",
                                value:
                                    `Rs. ${supplier.gstAmount || 0}`,
                            },
                            {
                                label: "Final Selling Price",
                                value:
                                    `Rs. ${supplier.finalSellingPrice || 0}`,
                            },
                            {
                                label: "Lead Time",
                                value:
                                    supplier.leadTime || "N/A",
                            },
                            {
                                label: "Availability",
                                value:
                                    supplier.availabilityStatus || "N/A",
                            },
                        ],
                    });

                }
            );
        }

        // =========================
        // ADMIN NOTE
        // =========================

        if (request.adminNote) {

            drawSectionTitle(
                "Admin Notes"
            );

            drawCard({
                rows: [
                    {
                        label: "Note",
                        value: request.adminNote,
                    },
                ],
            });

        }

        // =========================
        // FOOTER
        // =========================

        doc
            .fontSize(9)
            .fillColor(COLORS.gray)
            .text(
                "Generated by Royal Trading Component",
                0,
                doc.page.height - 38,
                {
                    align: "center",
                }
            );

        doc.end();

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "PDF generation failed",
        });

    }
};

exports.downloadFullRequestPdf =
    downloadFullRequestPdf;



