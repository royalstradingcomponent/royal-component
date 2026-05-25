const mongoose = require("mongoose");

const supplierStockSchema = new mongoose.Schema(
  {
    supplierCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SupplierCompany",
      required: true,
    },

    componentName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    partNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    brand: {
      type: String,
      default: "",
      trim: true,
    },

    packageName: {
      type: String,
      default: "",
      trim: true,
    },

    purchasePrice: {
      type: Number,
      default: 0,
    },

    gstPercent: {
      type: Number,
      default: 18,
    },

    profitPercent: {
      type: Number,
      default: 20,
    },

    extraCharge: {
      type: Number,
      default: 0,
    },

    finalCustomerPrice: {
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

    qualityNote: {
      type: String,
      default: "",
    },

    adminNote: {
      type: String,
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

    availabilityStatus: {
      type: String,
      enum: [
        "available",
        "limited",
        "on_request",
        "unavailable",
      ],
      default: "available",
    },

    isPreferred: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "SupplierStock",
  supplierStockSchema
);