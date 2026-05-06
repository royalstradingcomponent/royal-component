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

    purchasePrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
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