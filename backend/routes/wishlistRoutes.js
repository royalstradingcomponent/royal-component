const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

/* =====================================================
   ❤️ TOGGLE WISHLIST ADD / REMOVE
   POST /api/wishlist/toggle
===================================================== */
router.post("/toggle", protect, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyAdded = user.wishlist.some(
      (id) => id.toString() === productId.toString()
    );

    if (alreadyAdded) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId.toString()
      );

      user.lastActivity = new Date();
      await user.save();

      return res.status(200).json({
        success: true,
        action: "removed",
        message: "Product removed from wishlist",
      });
    }

    user.wishlist.push(productId);
    user.lastActivity = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      action: "added",
      message: "Product added to wishlist",
    });
  } catch (error) {
    console.error("❌ WISHLIST TOGGLE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =====================================================
   📋 GET USER WISHLIST
   GET /api/wishlist
===================================================== */
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "wishlist",
      select:
        "name slug brand sku mpn thumbnail images price mrp stock description shortDescription category subCategory isActive status",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const wishlist = (user.wishlist || []).filter(
      (product) => product && product.isActive !== false
    );

    return res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error("❌ GET WISHLIST ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =====================================================
   ❌ REMOVE FROM WISHLIST
   DELETE /api/wishlist/remove/:productId
===================================================== */
router.delete("/remove/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId.toString()
    );

    user.lastActivity = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    console.error("❌ REMOVE WISHLIST ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =====================================================
   🧹 CLEAR WISHLIST
   DELETE /api/wishlist/clear
===================================================== */
router.delete("/clear", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.wishlist = [];
    user.lastActivity = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
    });
  } catch (error) {
    console.error("❌ CLEAR WISHLIST ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;