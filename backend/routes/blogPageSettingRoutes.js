const express = require("express");
const router = express.Router();

const {
  getBlogPageSetting,
  adminGetBlogPageSetting,
  adminUpdateBlogPageSetting,
} = require("../controllers/blogPageSettingController");

const { protect, admin } = require("../middleware/authMiddleware");

// ================= PUBLIC =================
router.get("/", getBlogPageSetting);

// ================= ADMIN =================
router.get("/admin", protect, admin, adminGetBlogPageSetting);

router.put(
  "/admin",
  protect,
  admin,
  adminUpdateBlogPageSetting
);

module.exports = router;