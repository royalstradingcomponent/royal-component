const Coupon = require("../models/Coupon");

exports.getMyCoupons = async (req, res) => {
  try {
    const now = new Date();

    const coupons = await Coupon.find({
      isActive: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gte: now } }],
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      coupons,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Coupons fetch failed",
    });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Coupon created",
      coupon,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Coupon create failed",
    });
  }
};