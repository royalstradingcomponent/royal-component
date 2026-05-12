const mongoose = require("mongoose");

const keywordSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, default: "" },
    link: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const loaderCardSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    icon: { type: String, trim: true, default: "Cpu" },
    image: { type: String, trim: true, default: "" },
    link: { type: String, trim: true, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    logo: { type: String, trim: true, default: "" },
    link: { type: String, trim: true, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const seoLoaderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "Industrial Electronics & Semiconductor Marketplace",
    },

    subtitle: {
      type: String,
      trim: true,
      default:
        "Global electronic component sourcing and industrial procurement platform",
    },

    description: {
      type: String,
      trim: true,
      default:
        "Royal Component supplies semiconductors, automation products, industrial electronics, relays, sensors, ICs, PLC systems, connectors, cables and OEM procurement solutions.",
    },

    seoHeading: {
      type: String,
      trim: true,
      default: "Online Industrial Component Sourcing Made Easy",
    },

    seoParagraph: {
      type: String,
      trim: true,
      default:
        "Royal Component is an industrial electronics and semiconductor sourcing platform for engineers, OEM buyers, distributors, factories and procurement teams looking for genuine components, fast quotation support, bulk quantity sourcing and reliable industrial supply.",
    },

    bottomContent: {
      type: String,
      trim: true,
      default:
        "Buy semiconductors, connectors, sensors, power modules, relays, switches, cables, automation products, passive components and industrial electronic hardware from Royal Component with technical support and bulk procurement assistance.",
    },

    keywords: {
      type: [keywordSchema],
      default: [
        { label: "Semiconductors", link: "/products?category=semiconductors" },
        { label: "Industrial Automation", link: "/products?category=automation" },
        { label: "Connectors", link: "/products?category=connectors" },
        { label: "Power Electronics", link: "/products" },
        { label: "Sensors", link: "/products" },
      ],
    },

    cards: {
      type: [loaderCardSchema],
      default: [
        {
          title: "Semiconductors",
          description:
            "ICs, microcontrollers, MOSFETs, diodes, transistors and industrial-grade electronic chips.",
          icon: "Cpu",
          link: "/products?category=semiconductors",
          order: 1,
          isActive: true,
        },
        {
          title: "Industrial Procurement",
          description:
            "Bulk sourcing support for factories, OEM projects, repair teams and distributors.",
          icon: "PackageSearch",
          link: "/request-component",
          order: 2,
          isActive: true,
        },
        {
          title: "Automation Components",
          description:
            "Relays, sensors, PLC accessories, switches, control modules and panel components.",
          icon: "Factory",
          link: "/products",
          order: 3,
          isActive: true,
        },
      ],
    },

    trustedBrands: {
      type: [brandSchema],
      default: [
        { name: "ABB", order: 1, isActive: true },
        { name: "Siemens", order: 2, isActive: true },
        { name: "Schneider Electric", order: 3, isActive: true },
        { name: "Texas Instruments", order: 4, isActive: true },
        { name: "Panasonic", order: 5, isActive: true },
      ],
    },

    heroImage: { type: String, trim: true, default: "" },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SeoLoader", seoLoaderSchema);