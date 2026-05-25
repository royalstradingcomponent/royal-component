const mongoose = require("mongoose");

const purchaseHistorySchema = new mongoose.Schema(
  {
    supplierCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SupplierCompany",
      required: true,
    },

    supplierStock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SupplierStock",
      required: true,
    },

    componentName: {
      type: String,
      default: "",
    },

    partNumber: {
      type: String,
      default: "",
    },

    purchasedQty: {
      type: Number,
      default: 1,
    },

    purchasePrice: {
      type: Number,
      default: 0,
    },

    invoiceNumber: {
      type: String,
      default: "",
    },

    purchasedDate: {
      type: Date,
      default: Date.now,
    },

    adminNote: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "PurchaseHistory",
  purchaseHistorySchema
);