const mongoose = require("mongoose");

const blogFaqSchema = new mongoose.Schema(
  {
    question: { type: String, trim: true, default: "" },
    answer: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const blogSectionSchema = new mongoose.Schema(
  {
    heading: { type: String, trim: true, default: "" },
    content: { type: String, trim: true, default: "" },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
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
      lowercase: true,
      trim: true,
    },

    excerpt: {
      type: String,
      default: "",
      trim: true,
    },

    content: {
      type: String,
      default: "",
    },

    bannerImage: {
      type: String,
      default: "",
    },

    featuredImage: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    authorName: {
      type: String,
      default: "Royal Trading Component",
      trim: true,
    },

    authorRole: {
      type: String,
      default: "Industrial Electronics Procurement Team",
    },

    sections: {
      type: [blogSectionSchema],
      default: [],
    },

    faqs: {
      type: [blogFaqSchema],
      default: [],
    },

    relatedProductSlugs: {
      type: [String],
      default: [],
    },

    relatedCategorySlugs: {
      type: [String],
      default: [],
    },

    metaTitle: {
      type: String,
      default: "",
    },

    metaDescription: {
      type: String,
      default: "",
    },

    metaKeywords: {
      type: [String],
      default: [],
    },

    primaryKeyword: {
  type: String,
  default: "",
},

secondaryKeywords: {
  type: [String],
  default: [],
},

tableOfContents: {
  type: [String],
  default: [],
},

industries: {
  type: [String],
  default: [],
},

applications: {
  type: [String],
  default: [],
},

advantages: {
  type: [String],
  default: [],
},

specifications: {
  type: [String],
  default: [],
},

locations: {
  type: [String],
  default: [],
},

trustSignals: {
  type: [String],
  default: [],
},

ctaTitle: {
  type: String,
  default: "",
},

ctaDescription: {
  type: String,
  default: "",
},

ctaButtonText: {
  type: String,
  default: "",
},

youtubeUrl: {
  type: String,
  default: "",
},

datasheetUrl: {
  type: String,
  default: "",
},

schemaType: {
  type: String,
  default: "Article",
},

    canonicalUrl: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isTrending: {
      type: Boolean,
      default: false,
    },

    views: {
      type: Number,
      default: 0,
    },

    readTime: {
      type: Number,
      default: 5,
    },

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

blogSchema.index({
  title: "text",
  excerpt: "text",
  content: "text",
  tags: "text",
  metaKeywords: "text",
});

blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ isFeatured: 1 });
blogSchema.index({ isTrending: 1 });

module.exports = mongoose.model("Blog", blogSchema);