const express = require("express");
const router = express.Router();

const {
  getAboutPage,
  adminGetAboutPage,
  adminUpdateAboutPage,
} = require("../controllers/aboutPageController");

const { protect, admin } = require("../middleware/authMiddleware");

// ================= PUBLIC =================
router.get("/", getAboutPage);

// ================= ADMIN =================
router.get("/admin", protect, admin, adminGetAboutPage);

router.put(
  "/admin",
  protect,
  admin,
  adminUpdateAboutPage
);

module.exports = router;