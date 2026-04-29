const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    iconAlt: {
      type: String,
      default: "",
      trim: true,
    },

    // main category: parentSlug = ""
    // sub category: parentSlug = "semiconductors"
    // child category: parentSlug = "audio-video-ics"
    parentSlug: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
      index: true,
    },

    group: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
      index: true,
    },

    countText: {
      type: String,
      default: "",
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    seo: {
      metaTitle: { type: String, default: "", trim: true },
      metaDescription: { type: String, default: "", trim: true },
      metaKeywords: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);