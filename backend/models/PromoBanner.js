const mongoose = require("mongoose");

const promoBannerSchema = new mongoose.Schema(
 {
  title: String,

  subtitle: String,

  desktopImage: {
    type: String,
    required: true,
  },

  mobileImage: {
    type: String,
    default: "",
  },

  buttonText: String,

  buttonLink: String,

  bannerType: {
    type: String,
    enum: [
      "full",
      "two-column",
      "three-column",
      "four-column",
    ],
    default: "full",
  },

  position: {
    type: String,
   enum: [
  "afterHero",
  "afterCategories",
  "afterTrendingProducts",
  "afterProducts",
  "beforeFooter",
],
    default: "afterHero",
  },

  sortOrder: {
    type: Number,
    default: 0,
  },

  active: {
    type: Boolean,
    default: true,
  },
},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PromoBanner",
  promoBannerSchema
);