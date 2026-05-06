const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    heading: { type: String, default: "", trim: true },
    content: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, default: "", trim: true },
    answer: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const policyPageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    shortDescription: { type: String, default: "", trim: true },
    content: { type: String, default: "", trim: true },
    sections: { type: [sectionSchema], default: [] },
    faqs: { type: [faqSchema], default: [] },
    isActive: { type: Boolean, default: true },
    seo: {
      metaTitle: { type: String, default: "", trim: true },
      metaDescription: { type: String, default: "", trim: true },
      metaKeywords: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

policyPageSchema.index({
  title: "text",
  slug: "text",
  shortDescription: "text",
});

module.exports =
  mongoose.models.PolicyPage ||
  mongoose.model("PolicyPage", policyPageSchema);