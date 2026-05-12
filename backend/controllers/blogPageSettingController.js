const BlogPageSetting = require("../models/BlogPageSetting");

const defaultSetting = {
  heroLabel: "Royal Component Magazine",
  heroTitle: "Industrial Electronics, Semiconductors & Automation Blog",
  heroDescription:
    "Expert articles for engineers, buyers and procurement teams on electronic components, ICs, sensors, relays, connectors, power supplies, PCB parts and industrial sourcing.",
  heroImage: "",
  searchPlaceholder: "Search the Blog",
  recentTitle: "Recent Posts",
  popularTitle: "Most Popular Posts",
  semiconductorTitle: "Semiconductor Guides",
  automationTitle: "Automation Guides",
  buyingGuideTitle: "Buying Guide",
  procurementTitle: "Procurement Guide",
  departmentTitle: "Explore by Department",
  ctaTitle: "Need Industrial Electronic Components?",
  ctaDescription:
    "Share your BOM, part number, image or datasheet. Royal Trading Component helps businesses source semiconductors, sensors, relays, connectors, power supplies and hard-to-find industrial components.",
  ctaButtonText: "Request Component",
  ctaButtonLink: "/request-component",
  ctaImage: "/banner/procurement-support-banner.png",
  metaTitle:
    "Industrial Electronics Blog | Semiconductors, Automation & Components Guide",
  metaDescription:
    "Read expert blogs on industrial electronics, semiconductors, automation components, sensors, relays, power supplies, PCB parts and electronic component sourcing by Royal Trading Component.",
  metaKeywords: [
    "industrial electronics blog",
    "electronic components guide",
    "semiconductor supplier India",
    "automation components",
    "industrial components supplier",
    "electronics procurement guide",
    "Royal Trading Component",
  ],
};

async function getOrCreateSetting() {
  let setting = await BlogPageSetting.findOne();

  if (!setting) {
    setting = await BlogPageSetting.create(defaultSetting);
  }

  return setting;
}

// Public
exports.getBlogPageSetting = async (req, res) => {
  try {
    const setting = await getOrCreateSetting();

    res.json({
      success: true,
      setting,
    });
  } catch (error) {
    console.error("Get blog page setting error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog page setting",
    });
  }
};

// Admin
exports.adminGetBlogPageSetting = async (req, res) => {
  try {
    const setting = await getOrCreateSetting();

    res.json({
      success: true,
      setting,
    });
  } catch (error) {
    console.error("Admin get blog page setting error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog page setting",
    });
  }
};

// Admin update
exports.adminUpdateBlogPageSetting = async (req, res) => {
  try {
    const body = req.body || {};

    const setting = await getOrCreateSetting();

    Object.keys(defaultSetting).forEach((key) => {
      if (body[key] !== undefined) {
        setting[key] = body[key];
      }
    });

    await setting.save();

    res.json({
      success: true,
      message: "Blog page setting updated successfully",
      setting,
    });
  } catch (error) {
    console.error("Update blog page setting error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update blog page setting",
    });
  }
};