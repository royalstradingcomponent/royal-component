const PromoBanner = require("../models/PromoBanner");

exports.getAllPromoBanners = async (req, res) => {
  try {
    const banners = await PromoBanner.find()
      .sort({
        position: 1,
        sortOrder: 1,
      });

    res.status(200).json({
      success: true,
      banners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPromoBannersByPosition = async (
  req,
  res
) => {
  try {
    const banners = await PromoBanner.find({
      position: req.params.position,
      active: true,
    }).sort({
      sortOrder: 1,
    });

    res.status(200).json({
      success: true,
      banners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createPromoBanner = async (
  req,
  res
) => {
  try {
    const banner =
      await PromoBanner.create(req.body);

    res.status(201).json({
      success: true,
      banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePromoBanner = async (
  req,
  res
) => {
  try {
    const banner =
      await PromoBanner.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deletePromoBanner = async (
  req,
  res
) => {
  try {
    const banner =
      await PromoBanner.findByIdAndDelete(
        req.params.id
      );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Banner deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSinglePromoBanner = async (
  req,
  res
) => {
  try {
    const banner =
      await PromoBanner.findById(
        req.params.id
      );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};