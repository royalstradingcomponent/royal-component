const express = require("express");
const router = express.Router();

const {
  getMyCoupons,
  createCoupon,
} = require("../controllers/couponController");

const { protect, admin } = require("../middleware/authMiddleware");

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Coupon route working",
  });
});

router.get("/my", protect, getMyCoupons);
router.post("/", protect, admin, createCoupon);

module.exports = router;