const mongoose = require("mongoose");

const homeSectionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      default: "",
      trim: true,
    },

    categorySlug: {
      type: String,
      default: "",
      trim: true,
    },

    limit: {
      type: Number,
      default: 8,
    },

    viewAllText: {
      type: String,
      default: "View All",
      trim: true,
    },

    viewAllLink: {
      type: String,
      default: "/products",
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.HomeSection ||
  mongoose.model("HomeSection", homeSectionSchema);