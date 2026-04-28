const express = require("express");
const router = express.Router();

const {
  getCart,
  addItemToCart,
  mergeGuestCart,
  updateQty,
  deleteItemFromCart,
  clearCart,
  applyCouponToCart,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getCart);
router.post("/", protect, addItemToCart);
router.post("/merge", protect, mergeGuestCart);
router.put("/item/:itemId", protect, updateQty);
router.delete("/item/:itemId", protect, deleteItemFromCart);
router.delete("/clear", protect, clearCart);
router.post("/apply-coupon", protect, applyCouponToCart);

module.exports = router;