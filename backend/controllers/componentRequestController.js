const ComponentRequest = require("../models/ComponentRequest");

const SupplierSource = require("../models/SupplierSource");

function escapeRegex(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// USER: create request
exports.createComponentRequest = async (req, res) => {
    try {
        const {
            items,
            description,
            customerName,
            customerEmail,
            customerPhone,
        } = req.body;

        let parsedItems = [];

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
            .filter((item) => item.componentName && item.quantity > 0);

        if (!parsedItems.length || !customerName || !customerEmail) {
            return res.status(400).json({
                success: false,
                message: "At least one component, customer name and email are required",
            });
        }

        const imageUrls =
            req.files?.images?.map((file) => `/uploads/requests/${file.filename}`) ||
            [];

        const datasheetUrls =
            req.files?.datasheets?.map(
                (file) => `/uploads/requests/${file.filename}`
            ) || [];

        const request = await ComponentRequest.create({
    items: parsedItems,
    description,
    customerName,
    customerEmail,
    customerPhone,
    user: req.user?._id || null,
    imageUrls,
    datasheetUrls,
    matchedSupplierSources,
});

        const supplierFilters = [];

parsedItems.forEach((item) => {
    if (item.partNumber) {
        supplierFilters.push({
            partNumber: { $regex: escapeRegex(item.partNumber), $options: "i" },
        });
    }

    if (item.componentName) {
        supplierFilters.push({
            componentName: {
                $regex: escapeRegex(item.componentName),
                $options: "i",
            },
        });
    }

    if (item.brand) {
        supplierFilters.push({
            brand: { $regex: escapeRegex(item.brand), $options: "i" },
        });
    }
});

let matchedSupplierSources = [];

if (supplierFilters.length) {
    const suppliers = await SupplierSource.find({
        isActive: true,
        $or: supplierFilters,
    })
        .sort({ isPreferred: -1, updatedAt: -1 })
        .limit(10);

    matchedSupplierSources = suppliers.map((source) => ({
        supplierSource: source._id,
        supplierCompany: source.supplierCompany || "",
        componentName: source.componentName || "",
        partNumber: source.partNumber || "",
        brand: source.brand || "",
        purchasePrice: source.purchasePrice || 0,
        moq: source.moq || 1,
        leadTime: source.leadTime || "",
        phone: source.phone || "",
        whatsapp: source.whatsapp || "",
        email: source.email || "",
        availabilityStatus: source.availabilityStatus || "",
        isPreferred: Boolean(source.isPreferred),
    }));
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
        const { status, search, page = 1, limit = 20 } = req.query;

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

        const skip = (Number(page) - 1) * Number(limit);

        const [requests, total] = await Promise.all([
            ComponentRequest.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
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

        if (adminPrice !== undefined) {
            const priceNumber = Number(adminPrice);
            request.adminPrice = Number.isFinite(priceNumber) ? priceNumber : 0;
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

        await request.save();


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
exports.getMyComponentRequests = async (req, res) => {
    try {
        const requests = await ComponentRequest.find({
            $or: [{ user: req.user._id }, { customerEmail: req.user.email }],
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            requests,
        });
    } catch (error) {
        console.error("My component requests error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching your requests",
        });
    }
};

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