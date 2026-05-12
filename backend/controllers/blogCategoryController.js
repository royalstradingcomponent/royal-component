const BlogCategory = require("../models/BlogCategory");
const Blog = require("../models/Blog");

// ===============================
// Helper: slug generate
// ===============================
const makeSlug = (text = "") => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// ===============================
// Public: Get active blog categories
// GET /api/blog-categories
// ===============================
exports.getBlogCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const blogCount = await Blog.countDocuments({
          category: cat.slug,
          status: "published",
        });

        return {
          ...cat,
          blogCount,
        };
      })
    );

    res.json({
      success: true,
      categories: categoriesWithCount,
    });
  } catch (error) {
    console.error("Get blog categories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog categories",
    });
  }
};

// ===============================
// Public: Get category by slug
// GET /api/blog-categories/slug/:slug
// ===============================
exports.getBlogCategoryBySlug = async (req, res) => {
  try {
    const category = await BlogCategory.findOne({
      slug: req.params.slug,
      isActive: true,
    }).lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Blog category not found",
      });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Get blog category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog category",
    });
  }
};

// ===============================
// Admin: Get all categories
// GET /api/blog-categories/admin/all
// ===============================
exports.adminGetBlogCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Admin get blog categories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin blog categories",
    });
  }
};

// ===============================
// Admin: Create category
// POST /api/blog-categories/admin
// ===============================
exports.adminCreateBlogCategory = async (req, res) => {
  try {
    const body = req.body;

    if (!body.name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const slug = body.slug ? makeSlug(body.slug) : makeSlug(body.name);

    const existing = await BlogCategory.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category slug already exists",
      });
    }

    const category = await BlogCategory.create({
      name: body.name,
      slug,
      description: body.description || "",
      image: body.image || "",
      metaTitle: body.metaTitle || body.name,
      metaDescription: body.metaDescription || body.description || "",
      metaKeywords: body.metaKeywords || [],
      isActive:
        typeof body.isActive === "boolean" ? body.isActive : true,
      order: Number(body.order || 0),
    });

    res.status(201).json({
      success: true,
      message: "Blog category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create blog category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create blog category",
    });
  }
};

// ===============================
// Admin: Update category
// PUT /api/blog-categories/admin/:id
// ===============================
exports.adminUpdateBlogCategory = async (req, res) => {
  try {
    const body = req.body;

    const category = await BlogCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Blog category not found",
      });
    }

    const newSlug = body.slug ? makeSlug(body.slug) : category.slug;

    if (newSlug !== category.slug) {
      const existing = await BlogCategory.findOne({
        slug: newSlug,
        _id: { $ne: category._id },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Category slug already exists",
        });
      }
    }

    category.name = body.name ?? category.name;
    category.slug = newSlug;
    category.description = body.description ?? category.description;
    category.image = body.image ?? category.image;
    category.metaTitle = body.metaTitle ?? category.metaTitle;
    category.metaDescription =
      body.metaDescription ?? category.metaDescription;
    category.metaKeywords = body.metaKeywords ?? category.metaKeywords;

    category.isActive =
      typeof body.isActive === "boolean"
        ? body.isActive
        : category.isActive;

    category.order =
      body.order !== undefined ? Number(body.order) : category.order;

    await category.save();

    res.json({
      success: true,
      message: "Blog category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update blog category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update blog category",
    });
  }
};

// ===============================
// Admin: Delete category
// DELETE /api/blog-categories/admin/:id
// ===============================
exports.adminDeleteBlogCategory = async (req, res) => {
  try {
    const category = await BlogCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Blog category not found",
      });
    }

    const blogCount = await Blog.countDocuments({
      category: category.slug,
    });

    if (blogCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "This category has blogs. Please move or delete blogs first.",
      });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: "Blog category deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete blog category",
    });
  }
};