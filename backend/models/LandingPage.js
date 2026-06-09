const mongoose = require("mongoose");

const landingPageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    bannerImage: {
      type: String,
      default: "",
    },

    productImage: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    whatsappNumber: {
      type: String,
      default: "8851149032",
    },

    buyNowLink: {
      type: String,
      default: "",
    },

    linkedProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    priceTiers: [
      {
        label: String,
        price: Number,
      },
    ],

    features: [String],

    kitIncludes: [String],

    applications: [String],

    seoTitle: String,
    seoDescription: String,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "LandingPage",
  landingPageSchema
);