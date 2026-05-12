const express = require("express");
const router = express.Router();

const {
  getBlogs,
  getBlogBySlug,
  getRelatedBlogs,
  adminGetBlogs,
  adminGetBlogById,
  adminCreateBlog,
  adminUpdateBlog,
  adminDeleteBlog,
} = require("../controllers/blogController");

const authMiddleware = require("../middleware/authMiddleware");

const protectAdmin =
  authMiddleware.protectAdmin ||
  authMiddleware.adminProtect ||
  authMiddleware.protect;

// ===============================
// PUBLIC ROUTES
// ===============================

// GET /api/blogs
router.get("/", getBlogs);

// GET /api/blogs/slug/:slug
router.get("/slug/:slug", getBlogBySlug);

// GET /api/blogs/related/:slug
router.get("/related/:slug", getRelatedBlogs);

// ===============================
// ADMIN ROUTES
// ===============================

// GET /api/blogs/admin/all
router.get("/admin/all", protectAdmin, adminGetBlogs);

// GET /api/blogs/admin/:id
router.get("/admin/:id", protectAdmin, adminGetBlogById);

// POST /api/blogs/admin
router.post("/admin", protectAdmin, adminCreateBlog);

// PUT /api/blogs/admin/:id
router.put("/admin/:id", protectAdmin, adminUpdateBlog);

// DELETE /api/blogs/admin/:id
router.delete("/admin/:id", protectAdmin, adminDeleteBlog);

module.exports = router;