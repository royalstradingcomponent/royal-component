const LandingPage = require("../models/LandingPage");
const slugify = require("slugify");

// ===============================
// GET ALL LANDING PAGES
// ===============================
exports.getLandingPages = async (req, res) => {
  try {
    const pages = await LandingPage.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      total: pages.length,
      pages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET SINGLE PAGE BY SLUG
// ===============================
exports.getLandingPageBySlug = async (req, res) => {
  try {
    const page = await LandingPage.findOne({
      slug: req.params.slug,
      isActive: true,
    }).lean();

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Landing page not found",
      });
    }

    res.status(200).json({
      success: true,
      page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// CREATE LANDING PAGE
// ===============================
exports.createLandingPage = async (req, res) => {
  try {
    const {
      title,
      slug,
      bannerImage,
      productImage,
      mobileBannerImage,
      description,
      linkedProduct,
      whatsappNumber,
      buyNowLink,
      priceTiers,
      features,
      kitIncludes,
      applications,
      seoTitle,
      seoDescription,
      isActive,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const generatedSlug = slug
      ? slugify(slug, {
        lower: true,
        strict: true,
      })
      : slugify(title, {
        lower: true,
        strict: true,
      });

    const existing = await LandingPage.findOne({
      slug: generatedSlug,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    const landingPage = await LandingPage.create({
      title,
      slug: generatedSlug,

      bannerImage: bannerImage || "",

      mobileBannerImage:
  mobileBannerImage || "",

      productImage: productImage || "",

      description: description || "",

      whatsappNumber:
        whatsappNumber || "8851149032",

      buyNowLink: buyNowLink || "",
      linkedProduct: linkedProduct || null,

      priceTiers:
        Array.isArray(priceTiers)
          ? priceTiers
          : [],

      features:
        Array.isArray(features)
          ? features
          : [],

      kitIncludes:
        Array.isArray(kitIncludes)
          ? kitIncludes
          : [],

      applications:
        Array.isArray(applications)
          ? applications
          : [],

      seoTitle:
        seoTitle || title,

      seoDescription:
        seoDescription ||
        description?.slice(0, 160),

      isActive:
        isActive !== undefined
          ? isActive
          : true,
    });

    res.status(201).json({
      success: true,
      message:
        "Landing page created successfully",
      page: landingPage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// UPDATE LANDING PAGE
// ===============================
exports.updateLandingPage = async (req, res) => {
  try {
    const page =
      await LandingPage.findById(
        req.params.id
      );

    if (!page) {
      return res.status(404).json({
        success: false,
        message:
          "Landing page not found",
      });
    }

    const {
      title,
      slug,
      bannerImage,
      productImage,
      mobileBannerImage,
      description,
      whatsappNumber,
      buyNowLink,
      linkedProduct,
      priceTiers,
      features,
      kitIncludes,
      applications,
      seoTitle,
      seoDescription,
      isActive,
    } = req.body;

    if (title)
      page.title = title;

    if (slug || title) {
      const newSlug = slugify(
        slug || title,
        {
          lower: true,
          strict: true,
        }
      );

      const existing =
        await LandingPage.findOne({
          slug: newSlug,
          _id: {
            $ne: page._id,
          },
        });

      if (existing) {
        return res.status(400).json({
          success: false,
          message:
            "Slug already exists",
        });
      }

      page.slug = newSlug;
    }

    if (bannerImage !== undefined)
      page.bannerImage =
        bannerImage;

        if (mobileBannerImage !== undefined)
  page.mobileBannerImage =
    mobileBannerImage;

    if (productImage !== undefined)
      page.productImage =
        productImage;

    if (description !== undefined)
      page.description =
        description;

    if (
      whatsappNumber !== undefined
    )
      page.whatsappNumber =
        whatsappNumber;

    if (buyNowLink !== undefined)
      page.buyNowLink =
        buyNowLink;

    if (linkedProduct !== undefined)
      page.linkedProduct =
        linkedProduct;

    if (
      Array.isArray(priceTiers)
    ) {
      page.priceTiers =
        priceTiers;
    }

    if (
      Array.isArray(features)
    ) {
      page.features =
        features;
    }

    if (
      Array.isArray(
        kitIncludes
      )
    ) {
      page.kitIncludes =
        kitIncludes;
    }

    if (
      Array.isArray(
        applications
      )
    ) {
      page.applications =
        applications;
    }

    if (seoTitle !== undefined)
      page.seoTitle =
        seoTitle;

    if (
      seoDescription !==
      undefined
    )
      page.seoDescription =
        seoDescription;

    if (
      isActive !== undefined
    )
      page.isActive =
        isActive;

    await page.save();

    res.status(200).json({
      success: true,
      message:
        "Landing page updated successfully",
      page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// DELETE LANDING PAGE
// ===============================
exports.deleteLandingPage = async (
  req,
  res
) => {
  try {
    const page =
      await LandingPage.findById(
        req.params.id
      );

    if (!page) {
      return res.status(404).json({
        success: false,
        message:
          "Landing page not found",
      });
    }

    await page.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Landing page deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET SINGLE PAGE BY ID
// (ADMIN EDIT PAGE)
// ===============================
exports.getLandingPageById =
  async (req, res) => {
    try {
      const page =
        await LandingPage.findById(
          req.params.id
        );

      if (!page) {
        return res.status(404).json({
          success: false,
          message:
            "Landing page not found",
        });
      }

      res.status(200).json({
        success: true,
        page,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };