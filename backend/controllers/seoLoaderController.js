const SeoLoader = require("../models/SeoLoader");

const defaultLoaderPayload = {
  title: "Industrial Electronics & Semiconductor Marketplace",
  subtitle:
    "Global electronic component sourcing and industrial procurement platform",
  description:
    "Royal Component supplies semiconductors, automation products, industrial electronics, relays, sensors, ICs, PLC systems, connectors, cables and OEM procurement solutions.",
  seoHeading: "Online Industrial Component Sourcing Made Easy",
  seoParagraph:
    "Royal Component is an industrial electronics and semiconductor sourcing platform for engineers, OEM buyers, distributors, factories and procurement teams looking for genuine components, fast quotation support, bulk quantity sourcing and reliable industrial supply.",
  bottomContent:
    "Buy semiconductors, connectors, sensors, power modules, relays, switches, cables, automation products, passive components and industrial electronic hardware from Royal Component with technical support and bulk procurement assistance.",
  keywords: [
    { label: "Semiconductors", link: "/products?category=semiconductors" },
    { label: "Industrial Automation", link: "/products?category=automation" },
    { label: "Connectors", link: "/products?category=connectors" },
    { label: "Power Electronics", link: "/products" },
    { label: "Sensors", link: "/products" },
  ],
  cards: [
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
  trustedBrands: [
    { name: "ABB", order: 1, isActive: true },
    { name: "Siemens", order: 2, isActive: true },
    { name: "Schneider Electric", order: 3, isActive: true },
    { name: "Texas Instruments", order: 4, isActive: true },
    { name: "Panasonic", order: 5, isActive: true },
  ],
  heroImage: "",
  isActive: true,
};

const getOrCreateLoader = async () => {
  let loader = await SeoLoader.findOne().sort({ createdAt: -1 });

  if (!loader) {
    loader = await SeoLoader.create(defaultLoaderPayload);
  }

  return loader;
};

exports.getSeoLoader = async (req, res) => {
  try {
    const loader = await getOrCreateLoader();

    return res.status(200).json({
      success: true,
      loader,
    });
  } catch (error) {
    console.error("GET SEO LOADER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "SEO loader fetch failed",
    });
  }
};

exports.adminGetSeoLoader = async (req, res) => {
  try {
    const loader = await getOrCreateLoader();

    return res.status(200).json({
      success: true,
      loader,
    });
  } catch (error) {
    console.error("ADMIN GET SEO LOADER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "SEO loader fetch failed",
    });
  }
};

exports.adminUpdateSeoLoader = async (req, res) => {
  try {
    const payload = {
      title: req.body.title || "",
      subtitle: req.body.subtitle || "",
      description: req.body.description || "",
      seoHeading: req.body.seoHeading || "",
      seoParagraph: req.body.seoParagraph || "",
      bottomContent: req.body.bottomContent || "",
      heroImage: req.body.heroImage || "",
      isActive: req.body.isActive !== false && req.body.isActive !== "false",

      keywords: Array.isArray(req.body.keywords)
        ? req.body.keywords
        : [],

      cards: Array.isArray(req.body.cards)
        ? req.body.cards.map((card, index) => ({
            title: card.title || "",
            description: card.description || "",
            icon: card.icon || "Cpu",
            image: card.image || "",
            link: card.link || "",
            order: Number(card.order ?? index),
            isActive: card.isActive !== false,
          }))
        : [],

      trustedBrands: Array.isArray(req.body.trustedBrands)
        ? req.body.trustedBrands.map((brand, index) => ({
            name: brand.name || "",
            logo: brand.logo || "",
            link: brand.link || "",
            order: Number(brand.order ?? index),
            isActive: brand.isActive !== false,
          }))
        : [],
    };

    let loader = await SeoLoader.findOne().sort({ createdAt: -1 });

    if (!loader) {
      loader = await SeoLoader.create(payload);
    } else {
      Object.assign(loader, payload);
      await loader.save();
    }

    return res.status(200).json({
      success: true,
      message: "SEO loader updated successfully",
      loader,
    });
  } catch (error) {
    console.error("ADMIN UPDATE SEO LOADER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "SEO loader update failed",
    });
  }
};