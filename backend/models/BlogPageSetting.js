const mongoose = require("mongoose");

const blogPageSettingSchema = new mongoose.Schema(
  {
    heroLabel: {
      type: String,
      default: "Royal Component Magazine",
      trim: true,
    },

    heroTitle: {
      type: String,
      default: "Industrial Electronics, Semiconductors & Automation Blog",
      trim: true,
    },

    heroDescription: {
      type: String,
      default:
        "Expert articles for engineers, buyers and procurement teams on electronic components, ICs, sensors, relays, connectors, power supplies, PCB parts and industrial sourcing.",
      trim: true,
    },

    heroImage: {
      type: String,
      default: "",
    },

    searchPlaceholder: {
      type: String,
      default: "Search the Blog",
      trim: true,
    },

    recentTitle: {
      type: String,
      default: "Recent Posts",
      trim: true,
    },

    popularTitle: {
      type: String,
      default: "Most Popular Posts",
      trim: true,
    },

    semiconductorTitle: {
      type: String,
      default: "Semiconductor Guides",
      trim: true,
    },

    automationTitle: {
      type: String,
      default: "Automation Guides",
      trim: true,
    },

    buyingGuideTitle: {
      type: String,
      default: "Buying Guide",
      trim: true,
    },

    procurementTitle: {
      type: String,
      default: "Procurement Guide",
      trim: true,
    },

    departmentTitle: {
      type: String,
      default: "Explore by Department",
      trim: true,
    },

    ctaTitle: {
      type: String,
      default: "Need Industrial Electronic Components?",
      trim: true,
    },

    ctaDescription: {
      type: String,
      default:
        "Share your BOM, part number, image or datasheet. Royal Trading Component helps businesses source semiconductors, sensors, relays, connectors, power supplies and hard-to-find industrial components.",
      trim: true,
    },

    ctaButtonText: {
      type: String,
      default: "Request Component",
      trim: true,
    },

    ctaButtonLink: {
      type: String,
      default: "/request-component",
      trim: true,
    },

    ctaImage: {
      type: String,
      default: "/banner/procurement-support-banner.png",
    },

    metaTitle: {
      type: String,
      default:
        "Industrial Electronics Blog | Semiconductors, Automation & Components Guide",
      trim: true,
    },

    metaDescription: {
      type: String,
      default:
        "Read expert blogs on industrial electronics, semiconductors, automation components, sensors, relays, power supplies, PCB parts and electronic component sourcing by Royal Trading Component.",
      trim: true,
    },

    metaKeywords: {
      type: [String],
      default: [
        "industrial electronics blog",
        "electronic components guide",
        "semiconductor supplier India",
        "automation components",
        "industrial components supplier",
        "electronics procurement guide",
        "Royal Trading Component",
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogPageSetting", blogPageSettingSchema);