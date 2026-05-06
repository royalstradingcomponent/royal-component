const mongoose = require("mongoose");

const heroSlideSchema = new mongoose.Schema(
  {
    label: { type: String, default: "", trim: true },
    title1: { type: String, required: true, trim: true },
    title2: { type: String, required: true, trim: true },
    item: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },

    image: { type: String, required: true, trim: true },

    primaryText: { type: String, default: "Shop Components", trim: true },
    primaryLink: { type: String, default: "/products", trim: true },

    secondaryText: { type: String, default: "Request Bulk Quote", trim: true },
    secondaryLink: { type: String, default: "/quote-request", trim: true },

    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.HeroSlide || mongoose.model("HeroSlide", heroSlideSchema);