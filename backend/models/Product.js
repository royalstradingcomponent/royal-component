const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    altText: { type: String, default: "", trim: true },
    isPrimary: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const specificationSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["datasheet", "manual", "catalog", "certificate", "other"],
      default: "other",
    },
  },
  { _id: false }
);

const highlightSchema = new mongoose.Schema(
  {
    title: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    icon: { type: String, default: "ShieldCheck", trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    text: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const customSectionSchema = new mongoose.Schema(
  {
    title: { type: String, default: "", trim: true },
    content: { type: String, default: "", trim: true },
    image: { type: String, default: "", trim: true },
    buttonText: { type: String, default: "", trim: true },
    buttonLink: { type: String, default: "", trim: true },
    type: {
      type: String,
      enum: ["text", "image", "card", "banner"],
      default: "text",
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      index: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    sku: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true,
      index: true,
    },

    mpn: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    brand: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    subCategory: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
      index: true,
    },

    shortDescription: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    thumbnail: {
      type: String,
      default: "",
      trim: true,
    },

    images: {
      type: [imageSchema],
      default: [],
    },

    specifications: {
      type: [specificationSchema],
      default: [],
    },

    documents: {
      type: [documentSchema],
      default: [],
    },

    highlights: {
  type: [highlightSchema],
  default: [],
},

applications: {
  type: [applicationSchema],
  default: [],
},

customSections: {
  type: [customSectionSchema],
  default: [],
},

    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
      index: true,
    },

    mrp: {
      type: Number,
      min: 0,
      default: 0,
    },

    discount: {
      type: Number,
      min: 0,
      default: 0,
    },

    stock: {
      type: Number,
      min: 0,
      default: 0,
      index: true,
    },

    moq: {
      type: Number,
      min: 1,
      default: 1,
    },

    unit: {
      type: String,
      default: "piece",
      trim: true,
    },

    leadTimeDays: {
      type: Number,
      min: 0,
      default: 0,
    },

    countryOfOrigin: {
      type: String,
      default: "",
      trim: true,
    },

    warranty: {
      type: String,
      default: "",
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
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

productSchema.index({ name: "text", brand: "text", sku: "text", mpn: "text" });
productSchema.index({ category: 1, subCategory: 1, brand: 1 });
productSchema.index({ isActive: 1, status: 1, category: 1, price: 1 });

productSchema.pre("validate", function () {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-");
  }

  if (this.mrp > this.price && this.mrp > 0) {
    this.discount = Math.round(((this.mrp - this.price) / this.mrp) * 100);
  } else {
    this.discount = 0;
  }

  if (!this.thumbnail && this.images.length > 0) {
    const primary = this.images.find((img) => img.isPrimary) || this.images[0];
    this.thumbnail = primary?.url || "";
  }
});
module.exports = mongoose.model("Product", productSchema);