const mongoose = require("mongoose");

const supplierSourceSchema = new mongoose.Schema(
  {
    componentName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    partNumber: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    brand: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    supplierCompany: {
      type: String,
      required: true,
      trim: true,
    },

    contactPerson: {
      type: String,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    whatsapp: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },

    purchasePrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    gstPercent: {
      type: Number,
      default: 18,
    },

    igstAmount: {
      type: Number,
      default: 0,
    },

    gstType: {
      type: String,
      enum: ["CGST_SGST", "IGST"],
      default: "CGST_SGST",
    },

    cgstPercent: {
      type: Number,
      default: 9,
    },

    sgstPercent: {
      type: Number,
      default: 9,
    },

    igstPercent: {
      type: Number,
      default: 0,
    },

    profitPercent: {
      type: Number,
      default: 20,
    },

    extraCharge: {
      type: Number,
      default: 0,
    },

    sellingPrice: {
      type: Number,
      default: 0,
    },

    subtotal: {
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

    grandTotal: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },

    usdPrice: {
      type: Number,
      default: 0,
    },

    usdRate: {
      type: Number,
      default: 0,
    },

    inrPurchasePrice: {
      type: Number,
      default: 0,
    },
    moq: {
      type: Number,
      default: 1,
      min: 1,
    },

    leadTime: {
      type: String,
      trim: true,
      default: "",
    },

    lastPurchaseDate: {
      type: Date,
      default: null,
    },

    availabilityStatus: {
      type: String,
      enum: ["available", "limited", "on_request", "unavailable"],
      default: "available",
      index: true,
    },

    qualityNote: {
      type: String,
      trim: true,
      default: "",
    },

    adminNote: {
      type: String,
      trim: true,
      default: "",
    },

    supplierPdf: {
      type: String,
      default: "",
    },

    supplierImages: {
      type: [String],
      default: [],
    },

    isPreferred: {
      type: Boolean,
      default: false,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

supplierSourceSchema.index({
  componentName: "text",
  partNumber: "text",
  brand: "text",
  supplierCompany: "text",
  phone: "text",
  email: "text",
});

module.exports = mongoose.model("SupplierSource", supplierSourceSchema);