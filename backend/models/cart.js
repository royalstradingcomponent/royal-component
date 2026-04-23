const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    qty: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    // optional legacy fields
    size: {
      type: String,
      default: "",
      trim: true,
    },

    color: {
      type: String,
      default: "",
      trim: true,
    },

    // industrial cart snapshots
    nameSnapshot: {
      type: String,
      default: "",
      trim: true,
    },

    brandSnapshot: {
      type: String,
      default: "",
      trim: true,
    },

    skuSnapshot: {
      type: String,
      default: "",
      trim: true,
    },

    mpnSnapshot: {
      type: String,
      default: "",
      trim: true,
    },

    imageSnapshot: {
      type: String,
      default: "",
      trim: true,
    },

    slugSnapshot: {
      type: String,
      default: "",
      trim: true,
    },

    priceSnapshot: {
      type: Number,
      default: 0,
      min: 0,
    },

    mrpSnapshot: {
      type: Number,
      default: 0,
      min: 0,
    },

    gstPercent: {
      type: Number,
      default: 18,
      min: 0,
    },

    hsnCode: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);