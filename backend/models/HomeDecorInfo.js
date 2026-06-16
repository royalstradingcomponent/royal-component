const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    slug: String,

    image: String,

    hoverImage: String,

    title: String,

    shortDescription: String,

    category: String,

    sku: String,

    badge: String,

    price: Number,

    mrp: Number,

    discount: String,

    buttonText: String,

    buttonLink: String,

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isNewLaunch: {
      type: Boolean,
      default: false,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const homeDecorInfoSchema = new mongoose.Schema(
  {
    sectionTitle: {
      type: String,
      default: "Trending & New Launches",
    },

    viewAllText: {
  type: String,
  default: "View All",
},

viewAllLink: {
  type: String,
  default: "/products",
},

autoplay: {
  type: Boolean,
  default: true,
},

sliderSpeed: {
  type: Number,
  default: 3000,
},

    viewAllText: {
  type: String,
  default: "View All",
},

viewAllLink: {
  type: String,
  default: "/products",
},

    products: {
      type: [productSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "HomeDecorInfo",
  homeDecorInfoSchema
);