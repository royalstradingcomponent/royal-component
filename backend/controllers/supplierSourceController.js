const SupplierSource = require("../models/SupplierSource");
const { parseSupplierPdfService } = require("../services/pdf-parser");
const { parseImageOCR } = require("../services/image-ocr-parser");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

const fs = require("fs");

function escapeRegex(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSearchFilter(search) {
  if (!search) return {};

  const value = escapeRegex(search.trim());

  return {
    $or: [
      { componentName: { $regex: value, $options: "i" } },
      { partNumber: { $regex: value, $options: "i" } },
      { brand: { $regex: value, $options: "i" } },
      { supplierCompany: { $regex: value, $options: "i" } },
      { phone: { $regex: value, $options: "i" } },
      { whatsapp: { $regex: value, $options: "i" } },
      { email: { $regex: value, $options: "i" } },
    ],
  };
}

exports.createSupplierSource = async (req, res) => {
  try {
    const payload = req.body || {};

    console.log("CREATE PAYLOAD =", payload);

    console.log("GST TYPE =", payload.gstType);
    console.log("TYPE OF GST =", typeof payload.gstType);

    const supplierPdf = req.files?.supplierPdf?.[0]
      ? `/uploads/supplier-files/${req.files.supplierPdf[0].filename}`
      : "";

    const supplierImages =
      req.files?.supplierImages?.map(
        (file) => `/uploads/supplier-files/${file.filename}`,
      ) || [];

    if (!payload.componentName || !payload.supplierCompany) {
      return res.status(400).json({
        success: false,
        message: "Component name and supplier company are required",
      });
    }

    const source = await SupplierSource.create({
      componentName: payload.componentName,
      partNumber: payload.partNumber || "",
      brand: payload.brand || "",
      supplierCompany: payload.supplierCompany,
      contactPerson: payload.contactPerson || "",
      phone: payload.phone || "",
      whatsapp: payload.whatsapp || "",
      email: payload.email || "",
      address: payload.address || "",
      purchasePrice: Number(payload.purchasePrice || 0),
      usdPrice: Number(payload.usdPrice || 0),

      usdRate: Number(payload.usdRate || 0),

      inrPurchasePrice: Number(payload.inrPurchasePrice || 0),

      sellingPrice: Number(payload.sellingPrice || 0),

      subtotal: Number(payload.subtotal || 0),

      sgstAmount: Number(payload.sgstAmount || 0),

      cgstAmount: Number(payload.cgstAmount || 0),

      grandTotal: Number(payload.grandTotal || 0),

      igstAmount: Number(payload.igstAmount || 0),

      gstType: Array.isArray(payload.gstType)
        ? payload.gstType[0]
        : payload.gstType || "CGST_SGST",

      cgstPercent: Number(payload.cgstPercent || 9),

      sgstPercent: Number(payload.sgstPercent || 9),

      igstPercent: Number(payload.igstPercent || 0),

      gstPercent: Number(payload.gstPercent || 0),
      profitPercent: Number(payload.profitPercent || 20),
      extraCharge: Number(payload.extraCharge || 0),
      currency: payload.currency || "INR",
      moq: Number(payload.moq || 1),
      leadTime: payload.leadTime || "",
      lastPurchaseDate: payload.lastPurchaseDate || null,
      availabilityStatus: payload.availabilityStatus || "available",
      qualityNote: payload.qualityNote || "",
      adminNote: payload.adminNote || "",
      supplierPdf,
      supplierImages,
      isPreferred: Boolean(payload.isPreferred),
      isActive: payload.isActive !== false,
    });

    res.status(201).json({
      success: true,
      message: "Supplier source created successfully",
      source,
    });
  } catch (error) {
    console.error("Create supplier source error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating supplier source",
    });
  }
};

exports.getSupplierSources = async (req, res) => {
  try {
    const {
      search = "",
      status = "all",
      active = "all",
      page = 1,
      limit = 50,
    } = req.query;

    const filter = buildSearchFilter(search);

    if (status && status !== "all") {
      filter.availabilityStatus = status;
    }

    if (active !== "all") {
      filter.isActive = active === "true";
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [sources, total] = await Promise.all([
      SupplierSource.find(filter)
        .sort({ isPreferred: -1, updatedAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      SupplierSource.countDocuments(filter),
    ]);

    const preferredCount = await SupplierSource.countDocuments({
      isPreferred: true,
    });

    const activeCount = await SupplierSource.countDocuments({
      isActive: true,
    });

    const availableCount = await SupplierSource.countDocuments({
      availabilityStatus: "available",
    });

    res.json({
      success: true,
      sources,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),

      stats: {
        total,
        preferred: preferredCount,
        active: activeCount,
        available: availableCount,
      },
    });
  } catch (error) {
    console.error("Get supplier sources error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching supplier sources",
    });
  }
};

exports.getSupplierSourceById = async (req, res) => {
  try {
    const source = await SupplierSource.findById(req.params.id);
    console.log("DB SOURCE =", source);
    if (!source) {
      return res.status(404).json({
        success: false,
        message: "Supplier source not found",
      });
    }

    res.json({
      success: true,
      source,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.updateSupplierSource = async (req, res) => {
  try {
    const payload = req.body || {};

    console.log("UPDATE PAYLOAD =", payload);
    console.log("USD =", payload.usdPrice);
    console.log("RATE =", payload.usdRate);
    console.log("INR =", payload.inrPurchasePrice);

    const source = await SupplierSource.findById(req.params.id);

    if (!source) {
      return res.status(404).json({
        success: false,
        message: "Supplier source not found",
      });
    }

    

    console.log("GST TYPE =", payload.gstType);
    console.log("TYPE OF GST =", typeof payload.gstType);

    if (Array.isArray(payload.gstType)) {
      payload.gstType = payload.gstType[0];
    }

    const supplierPdf = req.files?.supplierPdf?.[0]
      ? `/uploads/supplier-files/${req.files.supplierPdf[0].filename}`
      : source.supplierPdf;

    const supplierImages = req.files?.supplierImages?.length
      ? req.files.supplierImages.map(
          (file) => `/uploads/supplier-files/${file.filename}`,
        )
      : source.supplierImages;

    const fields = [
      "componentName",
      "partNumber",
      "brand",
      "supplierCompany",
      "contactPerson",
      "phone",
      "whatsapp",
      "email",
      "currency",
      "leadTime",
      "availabilityStatus",
      "qualityNote",
      "adminNote",
    ];

    fields.forEach((field) => {
      if (payload[field] !== undefined) {
        source[field] = payload[field];
      }
    });

    const purchasePriceValue = Number(payload.inrPurchasePrice);

    source.purchasePrice = Number.isFinite(purchasePriceValue)
      ? purchasePriceValue
      : Number(payload.purchasePrice || 0);

    source.usdPrice = isNaN(Number(payload.usdPrice))
      ? 0
      : Number(payload.usdPrice);

    source.usdRate = isNaN(Number(payload.usdRate))
      ? 0
      : Number(payload.usdRate);

    source.inrPurchasePrice = isNaN(Number(payload.inrPurchasePrice))
      ? 0
      : Number(payload.inrPurchasePrice);

    source.gstPercent = Number(payload.gstPercent || 0);

    source.profitPercent = Number(payload.profitPercent || 20);

    source.extraCharge = Number(payload.extraCharge || 0);

    source.sellingPrice = Number(payload.sellingPrice || 0);

    source.subtotal = Number(payload.subtotal || 0);

    source.sgstAmount = Number(payload.sgstAmount || 0);

    source.cgstAmount = Number(payload.cgstAmount || 0);

    source.grandTotal = Number(payload.grandTotal || 0);

    source.igstAmount = Number(payload.igstAmount || 0);

    source.gstType = Array.isArray(payload.gstType)
      ? payload.gstType[0]
      : payload.gstType || "CGST_SGST";

    ((source.cgstPercent = Number(payload.cgstPercent || 0)),
      (source.sgstPercent = Number(payload.sgstPercent || 0)),
      (source.igstPercent = Number(payload.igstPercent || 0)));

    if (payload.moq !== undefined) {
      const moq = Number(payload.moq);
      source.moq = Number.isFinite(moq) && moq > 0 ? moq : 1;
    }

    if (payload.lastPurchaseDate !== undefined) {
      source.lastPurchaseDate = payload.lastPurchaseDate || null;
    }

    if (payload.isPreferred !== undefined) {
      source.isPreferred = Boolean(payload.isPreferred);
    }

    if (payload.isActive !== undefined) {
      source.isActive = Boolean(payload.isActive);
    }

    source.address = payload.address || "";

    source.supplierPdf = supplierPdf;

    source.supplierImages = supplierImages;

    await source.save();

    res.json({
      success: true,
      message: "Supplier source updated successfully",
      source,
    });
  } catch (error) {
    console.error("Update supplier source error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating supplier source",
    });
  }
};

exports.deleteSupplierSource = async (req, res) => {
  try {
    const source = await SupplierSource.findById(req.params.id);

    if (!source) {
      return res.status(404).json({
        success: false,
        message: "Supplier source not found",
      });
    }

    await source.deleteOne();

    res.json({
      success: true,
      message: "Supplier source deleted successfully",
    });
  } catch (error) {
    console.error("Delete supplier source error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting supplier source",
    });
  }
};

exports.matchSupplierSources = async (req, res) => {
  try {
    const { items } = req.body;

    const parsedItems = Array.isArray(items) ? items : [];

    if (!parsedItems.length) {
      return res.json({
        success: true,
        matches: [],
      });
    }

    const orFilters = [];

    parsedItems.forEach((item) => {
      const componentName = String(item.componentName || "").trim();
      const partNumber = String(item.partNumber || "").trim();
      const brand = String(item.brand || "").trim();

      if (partNumber) {
        orFilters.push({
          partNumber: { $regex: escapeRegex(partNumber), $options: "i" },
        });
      }

      if (componentName) {
        orFilters.push({
          componentName: { $regex: escapeRegex(componentName), $options: "i" },
        });
      }

      if (brand) {
        orFilters.push({
          brand: { $regex: escapeRegex(brand), $options: "i" },
        });
      }
    });

    if (!orFilters.length) {
      return res.json({
        success: true,
        matches: [],
      });
    }

    const sources = await SupplierSource.find({
      isActive: true,
      $or: orFilters,
    })
      .sort({ isPreferred: -1, updatedAt: -1 })
      .limit(20);

    res.json({
      success: true,
      matches: sources,
    });
  } catch (error) {
    console.error("Match supplier source error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while matching supplier sources",
    });
  }
};

exports.importOfferText = async (req, res) => {
  try {
    const { configText } = req.body;

    if (!configText) {
      return res.status(400).json({
        success: false,
        message: "Config text required",
      });
    }

    const lines = configText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    let supplierCompany = "";
    let contactPerson = "";
    let phone = "";
    let whatsapp = "";
    let email = "";
    let address = "";
    let gstPercent = 18;
    let profitPercent = 20;
    let extraCharge = 0;

    const created = [];

    for (const line of lines) {
      if (line.startsWith("SUPPLIER=")) {
        supplierCompany = line.replace("SUPPLIER=", "").trim();
        continue;
      }

      if (line.startsWith("GST=")) {
        gstPercent = Number(line.replace("GST=", "").trim());
        continue;
      }

      if (line.startsWith("CONTACT=")) {
        contactPerson = line.replace("CONTACT=", "").trim();
        continue;
      }

      if (line.startsWith("PHONE=")) {
        phone = line.replace("PHONE=", "").trim();
        continue;
      }

      if (line.startsWith("WHATSAPP=")) {
        whatsapp = line.replace("WHATSAPP=", "").trim();
        continue;
      }

      if (line.startsWith("EMAIL=")) {
        email = line.replace("EMAIL=", "").trim();
        continue;
      }

      if (line.startsWith("ADDRESS=")) {
        address = line.replace("ADDRESS=", "").trim();
        continue;
      }

      if (line.startsWith("PROFIT=")) {
        profitPercent = Number(line.replace("PROFIT=", "").trim());
        continue;
      }

      if (line.startsWith("EXTRA=")) {
        extraCharge = Number(line.replace("EXTRA=", "").trim());
        continue;
      }

      if (line.includes("|")) {
        const [partNumber, brand, packageName, purchasePrice] = line.split("|");

        const supplierPdf = req.files?.supplierPdf?.[0]
          ? `/uploads/supplier-files/${req.files.supplierPdf[0].filename}`
          : "";

        const supplierImages =
          req.files?.supplierImages?.map(
            (file) => `/uploads/supplier-files/${file.filename}`,
          ) || [];

        const source = await SupplierSource.create({
          componentName: partNumber,
          partNumber,
          brand,

          supplierCompany,
          contactPerson,
          phone,
          whatsapp,
          email,
          address,

          purchasePrice: Number(purchasePrice || 0),

          usdPrice: 0,

          usdRate: 0,

          inrPurchasePrice: 0,

          gstPercent,

          gstPercent,
          profitPercent,
          extraCharge,

          adminNote: packageName || "",

          availabilityStatus: "available",
          isPreferred: true,
          isActive: true,
        });

        created.push(source);
      }
    }

    res.json({
      success: true,
      total: created.length,
      created,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Import failed",
    });
  }
};

exports.bulkImportSupplierSources = async (req, res) => {
  try {
    const items = req.body.items || [];

    if (!items.length) {
      return res.status(400).json({
        success: false,
        message: "No items found",
      });
    }

    const finalItems = items.map((item) => {
      const purchasePrice = Number(item.purchasePrice || 0);

      const profitAmount =
        (purchasePrice * Number(item.profitPercent || 0)) / 100;

      const sellingPrice =
        purchasePrice + profitAmount + Number(item.extraCharge || 0);

      const gstPercent = Number(item.gstPercent || 0);

      const gstType = item.gstType || "CGST_SGST";

      const gstAmount = (sellingPrice * gstPercent) / 100;

      let cgstAmount = 0;
      let sgstAmount = 0;
      let igstAmount = 0;

      if (gstType === "IGST") {
        igstAmount = gstAmount;
      } else {
        cgstAmount = gstAmount / 2;
        sgstAmount = gstAmount / 2;
      }

      return {
        componentName: item.componentName || "",

        partNumber: item.partNumber || "",

        brand: item.brand || "",

        supplierCompany: item.supplierCompany || "",

        contactPerson: item.contactPerson || "",

        phone: item.phone || "",

        whatsapp: item.whatsapp || "",

        email: item.email || "",

        address: item.address || "",

        purchasePrice,

        gstPercent,

        profitPercent: Number(item.profitPercent || 20),

        extraCharge: Number(item.extraCharge || 0),

        sellingPrice,

        subtotal: sellingPrice,

        gstType,

        cgstPercent: Number(item.cgstPercent || 0),

        sgstPercent: Number(item.sgstPercent || 0),

        igstPercent: Number(item.igstPercent || 0),

        sgstAmount,

        cgstAmount,

        igstAmount,

        grandTotal: sellingPrice + gstAmount,

        currency: item.currency || "INR",

        moq: Number(item.moq || 1),

        leadTime: item.leadTime || "",

        availabilityStatus: item.availabilityStatus || "available",

        qualityNote: item.qualityNote || "",

        adminNote: item.adminNote || "",

        isPreferred: Boolean(item.isPreferred),

        isActive: item.isActive !== false,
      };
    });

    const savedItems = [];

    for (const item of finalItems) {
      const exists = await SupplierSource.findOne({
        partNumber: item.partNumber,
        supplierCompany: item.supplierCompany,
      });

      if (!exists) {
        const created = await SupplierSource.create(item);

        savedItems.push(created);
      }
    }

    res.json({
      success: true,
      count: savedItems.length,
      message: "Bulk supplier import success",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Bulk import failed",
    });
  }
};

exports.parseSupplierPdf = async (req, res) => {
  try {
    const pdfFile = req.files?.pdf?.[0];

    if (!pdfFile) {
      return res.status(400).json({
        success: false,
        message: "PDF required",
      });
    }

    const result = await parseSupplierPdfService(pdfFile.path);

    const { companyDetails, components } = result;

    let envText = `
SUPPLIER=${companyDetails.supplier}
CONTACT_PERSON=
PHONE=${companyDetails.phone}
WHATSAPP=${companyDetails.whatsapp}
EMAIL=${companyDetails.email}
ADDRESS=${companyDetails.address}
GST=${companyDetails.gst}
PROFIT=${companyDetails.profit}
`;

    components.forEach((item) => {
      envText += `
${item.componentName}|${item.brand}|${item.package}|${item.price}
`;
    });

    res.json({
      success: true,
      envText,
      totalComponents: components.length,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "PDF parse failed",
    });
  }
};

exports.parseSupplierImage = async (req, res) => {
  try {
    const images = req.files?.images || [];

    if (!images.length) {
      return res.status(400).json({
        success: false,
        message: "Images required",
      });
    }

    const imagePaths = images.map((img) => img.path);

    const result = await parseImageOCR(imagePaths);

    const { companyDetails, components } = result;

    let envText = `
SUPPLIER=${companyDetails.supplier}
CONTACT_PERSON=${companyDetails.contactPerson}
PHONE=${companyDetails.phone}
WHATSAPP=${companyDetails.whatsapp}
EMAIL=${companyDetails.email}
ADDRESS=${companyDetails.address}
GST=${companyDetails.gst}
PROFIT=${companyDetails.profit}
`;

    components.forEach((item) => {
      envText += `
${String(item.componentName || "").trim()}|${String(item.brand || "GENERIC").trim()}|${String(item.package || "NA").trim()}|${Number(item.price || 0)}
`;
    });

    res.json({
      success: true,
      envText,
      totalComponents: components.length,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Image OCR failed",
    });
  }
};
