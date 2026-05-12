const mongoose = require("mongoose");

const footerLinkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    link: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const footerPageSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: "Royal Trading Component",
      trim: true,
    },

    tagline: {
      type: String,
      default: "Industrial Solutions Store",
      trim: true,
    },

    description: {
      type: String,
      default:
        "Royal Trading Component is a trusted B2B industrial sourcing platform for electronic, electrical, automation, mechanical and hardware components.",
      trim: true,
    },

    email: {
      type: String,
      default: "sales@royalcomponent.com",
      trim: true,
    },

    phone: {
      type: String,
      default: "+91 88511 49032",
      trim: true,
    },

    whatsapp: {
      type: String,
      default: "+91 88511 49032",
      trim: true,
    },

    supportHours: {
      type: String,
      default: "Mon - Sat | 9 AM - 7 PM",
      trim: true,
    },

    address: {
      type: String,
      default:
        "4th Floor, Ansari Road, Near Hanuman Mandir, Darya Ganj, New Delhi - 110002",
      trim: true,
    },

    componentLinks: [footerLinkSchema],
    shopLinks: [footerLinkSchema],
    supportLinks: [footerLinkSchema],
    companyLinks: [footerLinkSchema],
    policyLinks: [footerLinkSchema],

    bottomText: {
      type: String,
      default: "© 2026 Royal Trading Component. All rights reserved.",
      trim: true,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FooterPage", footerPageSchema);