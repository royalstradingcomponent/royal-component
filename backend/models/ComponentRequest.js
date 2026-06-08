const mongoose = require("mongoose");

const requestItemSchema = new mongoose.Schema(
  {
    componentName: {
      type: String,
      default: "",
      trim: true,
    },

    partNumber: {
      type: String,
      default: "",
      trim: true,
    },

    brand: {
      type: String,
      default: "",
      trim: true,
    },
    quantity: {
      type: Number, required: true, min: 1, default: 1
    },

    availabilityStatus: {
      type: String,
      enum: ["available", "checking"],
      default: "checking",
    },

    unitPrice: {
      type: Number,
      default: 0,
    },

    gstAmount: {
      type: Number,
      default: 0,
    },

    lineTotal: {
      type: Number,
      default: 0,
    },

  },
  { _id: false },
);

const componentRequestSchema = new mongoose.Schema(
  {
    items: {
      type: [requestItemSchema],
      required: true,
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "At least one component is required",
      },
    },

    description: { type: String, required: true, trim: true },

    datasheetUrls: [{ type: String, default: "" }],
    imageUrls: [{ type: String, default: "" }],

    customerName: { type: String, required: true, trim: true },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    customerPhone: { type: String, required: true, trim: true },

    companyName: {
      type: String,
      default: "",
      trim: true,
    },

    addressLine1: {
      type: String,
      required: true,
      trim: true,
    },

    addressLine2: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    pinCode: {
      type: String,
      required: true,
      trim: true,
    },

    quotationNumber: {
      type: String,
      default: "",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["new", "checking", "available", "quoted", "unavailable", "closed"],
      default: "new",
    },

    adminPrice: { type: Number, default: 0 },
    subTotal: {
      type: Number,
      default: 0,
    },

    sgstAmount: {
      type: Number,
      default: 0,
    },

    cgstAmount: {
      type: Number,
      default: 0,
    },
    adminLeadTime: { type: String, default: "" },
    adminNote: { type: String, default: "" },

    customerMessage: {
      type: String,
      default: "",
    },
    quotationValidity: {
      type: String,
      default: "7 Days",
    },

    quotationSentAt: {
      type: Date,
      default: null,
    },

    adminContactNumber: {
      type: String,
      default: "",
    },

    availableItemsNote: {
      type: String,
      default: "",
    },

    activityLogs: [
      {
        message: {
          type: String,
          default: "",
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    matchedSupplierSources: [
      {
        supplierSource: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SupplierSource",
          default: null,
        },

        supplierCompany: {
          type: String,
          default: "",
        },

        componentName: {
          type: String,
          default: "",
        },

        partNumber: {
          type: String,
          default: "",
        },

        brand: {
          type: String,
          default: "",
        },

        purchasePrice: {
          type: Number,
          default: 0,
        },

        requestedQty: {
          type: Number,
          default: 1,
        },

        unitPrice: {
          type: Number,
          default: 0,
        },

        lineTotal: {
          type: Number,
          default: 0,
        },

        finalSellingPrice: {
          type: Number,
          default: 0,
        },

        gstPercent: {
          type: Number,
          default: 0,
        },

        gstAmount: {
          type: Number,
          default: 0,
        },

        profitPercent: {
          type: Number,
          default: 0,
        },

        profitAmount: {
          type: Number,
          default: 0,
        },

        extraCharge: {
          type: Number,
          default: 0,
        },

        moq: {
          type: Number,
          default: 1,
        },

        leadTime: {
          type: String,
          default: "",
        },

        lastPurchaseDate: {
          type: Date,
          default: null,
        },

        contactPerson: {
          type: String,
          default: "",
        },

        address: {
          type: String,
          default: "",
        },

        qualityNote: {
          type: String,
          default: "",
        },

        phone: {
          type: String,
          default: "",
        },

        whatsapp: {
          type: String,
          default: "",
        },

        email: {
          type: String,
          default: "",
        },

        availabilityStatus: {
          type: String,
          default: "",
        },

        isPreferred: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true },
);

componentRequestSchema.index({
  "items.componentName": "text",
  "items.partNumber": "text",
  "items.brand": "text",
  customerEmail: "text",
});

componentRequestSchema.index({
  user: 1,
  createdAt: -1,
});

componentRequestSchema.index({
  customerEmail: 1,
});

componentRequestSchema.index({
  customerPhone: 1,
});

module.exports = mongoose.model("ComponentRequest", componentRequestSchema);
