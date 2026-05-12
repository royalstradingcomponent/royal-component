const express = require("express");
const router = express.Router();

const {
  getSeoLoader,
  adminGetSeoLoader,
  adminUpdateSeoLoader,
} = require("../controllers/seoLoaderController");

const { protect, admin } = require("../middleware/authMiddleware");

// Public
router.get("/", getSeoLoader);

// Admin
router.get("/admin", protect, admin, adminGetSeoLoader);
router.put("/admin", protect, admin, adminUpdateSeoLoader);

module.exports = router;