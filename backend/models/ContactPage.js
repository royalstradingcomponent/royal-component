const mongoose = require("mongoose");

const contactCardSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    value: { type: String, trim: true },
    subText: { type: String, trim: true },
    icon: { type: String, default: "phone" },
    link: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const ContactPageSchema = new mongoose.Schema(
  {
    heroTitle: {
      type: String,
      default: "Contact Royal Component",
      trim: true,
    },

    heroSubtitle: {
      type: String,
      default:
        "Need help with industrial components, bulk quotation, GST invoice, datasheet, payment proof or order tracking? Our support team is ready to assist you.",
      trim: true,
    },

    supportTitle: {
      type: String,
      default: "Industrial Procurement Support",
      trim: true,
    },

    supportDescription: {
      type: String,
      default:
        "Share your part number, SKU, MPN, quantity, delivery location or payment details and our team will help you with the right solution.",
      trim: true,
    },

    email: {
      type: String,
      default: "support@royalsmd.com",
      trim: true,
    },

    phone: {
      type: String,
      default: "+91 00000 00000",
      trim: true,
    },

    whatsapp: {
      type: String,
      default: "+91 00000 00000",
      trim: true,
    },

    address: {
      type: String,
      default: "Royal Component, India",
      trim: true,
    },

    businessHours: {
      type: String,
      default: "Monday - Saturday, 10:00 AM - 7:00 PM",
      trim: true,
    },

    mapEmbedUrl: {
      type: String,
      default: "",
      trim: true,
    },

    cards: {
      type: [contactCardSchema],
      default: [
        {
          title: "Call Support",
          value: "+91 00000 00000",
          subText: "For order, dispatch and product support",
          icon: "phone",
          link: "tel:+910000000000",
          order: 1,
        },
        {
          title: "Email Support",
          value: "support@royalsmd.com",
          subText: "Send SKU, MPN, quantity or payment proof",
          icon: "mail",
          link: "mailto:support@royalsmd.com",
          order: 2,
        },
        {
          title: "WhatsApp",
          value: "+91 00000 00000",
          subText: "Quick help for quotation and tracking",
          icon: "whatsapp",
          link: "https://wa.me/910000000000",
          order: 3,
        },
      ],
    },

    seo: {
      metaTitle: {
        type: String,
        default: "Contact Royal Component | Industrial Components Support",
      },
      metaDescription: {
        type: String,
        default:
          "Contact Royal Component for bulk electronic components, industrial hardware, GST invoice, datasheet, payment proof and order support.",
      },
      metaKeywords: {
        type: [String],
        default: [
          "Royal Component contact",
          "industrial components support",
          "bulk electronic components",
          "GST invoice support",
        ],
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.ContactPage ||
  mongoose.model("ContactPage", ContactPageSchema);