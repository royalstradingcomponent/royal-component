const SupplierSource = require("../models/SupplierSource");

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
      purchasePrice: Number(payload.purchasePrice || 0),
      currency: payload.currency || "INR",
      moq: Number(payload.moq || 1),
      leadTime: payload.leadTime || "",
      lastPurchaseDate: payload.lastPurchaseDate || null,
      availabilityStatus: payload.availabilityStatus || "available",
      qualityNote: payload.qualityNote || "",
      adminNote: payload.adminNote || "",
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

    res.json({
      success: true,
      sources,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("Get supplier sources error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching supplier sources",
    });
  }
};

exports.updateSupplierSource = async (req, res) => {
  try {
    const source = await SupplierSource.findById(req.params.id);

    if (!source) {
      return res.status(404).json({
        success: false,
        message: "Supplier source not found",
      });
    }

    const payload = req.body || {};

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

    if (payload.purchasePrice !== undefined) {
      const price = Number(payload.purchasePrice);
      source.purchasePrice = Number.isFinite(price) ? price : 0;
    }

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