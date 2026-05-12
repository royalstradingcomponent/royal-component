const express = require("express");
const router = express.Router();

const {
  getBlogCategories,
  getBlogCategoryBySlug,
  adminGetBlogCategories,
  adminCreateBlogCategory,
  adminUpdateBlogCategory,
  adminDeleteBlogCategory,
} = require("../controllers/blogCategoryController");

const authMiddleware = require("../middleware/authMiddleware");

const protectAdmin =
  authMiddleware.protectAdmin ||
  authMiddleware.adminProtect ||
  authMiddleware.protect;

// Public
router.get("/", getBlogCategories);
router.get("/slug/:slug", getBlogCategoryBySlug);

// Admin
router.get("/admin/all", protectAdmin, adminGetBlogCategories);
router.post("/admin", protectAdmin, adminCreateBlogCategory);
router.put("/admin/:id", protectAdmin, adminUpdateBlogCategory);
router.delete("/admin/:id", protectAdmin, adminDeleteBlogCategory);

module.exports = router;