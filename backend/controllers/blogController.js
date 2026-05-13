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
// Helper: read time
// ===============================
const calculateReadTime = (content = "", sections = []) => {
  const sectionText = sections.map((s) => `${s.heading} ${s.content}`).join(" ");
  const words = `${content} ${sectionText}`.trim().split(/\s+/).filter(Boolean);
  return Math.max(1, Math.ceil(words.length / 200));
};

// ===============================
// Public: Get published blogs
// GET /api/blogs
// ===============================
exports.getBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      tag,
      keyword,
      featured,
      trending,
    } = req.query;

    const query = { status: "published" };

    if (category) query.category = category.toLowerCase();
    if (tag) query.tags = { $in: [tag] };
    if (featured === "true") query.isFeatured = true;
    if (trending === "true") query.isTrending = true;

    if (keyword) {
      query.$text = { $search: keyword };
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      Blog.countDocuments(query),
    ]);

    res.json({
      success: true,
      blogs,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error("Get blogs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
    });
  }
};

// ===============================
// Public: Get single blog by slug
// GET /api/blogs/slug/:slug
// ===============================
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      status: "published",
    }).lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    await Blog.updateOne({ _id: blog._id }, { $inc: { views: 1 } });

    res.json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Get blog by slug error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
    });
  }
};

// ===============================
// Public: Related blogs
// GET /api/blogs/related/:slug
// ===============================
exports.getRelatedBlogs = async (req, res) => {
  try {
    const currentBlog = await Blog.findOne({
      slug: req.params.slug,
      status: "published",
    }).lean();

    if (!currentBlog) {
      return res.json({
        success: true,
        blogs: [],
      });
    }

    const blogs = await Blog.find({
      _id: { $ne: currentBlog._id },
      status: "published",
      $or: [
        { category: currentBlog.category },
        { tags: { $in: currentBlog.tags || [] } },
      ],
    })
      .sort({ publishedAt: -1 })
      .limit(6)
      .lean();

    res.json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error("Related blogs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch related blogs",
    });
  }
};

// ===============================
// Admin: Get all blogs
// GET /api/blogs/admin/all
// ===============================
exports.adminGetBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, keyword } = req.query;

    const query = {};

    if (status) query.status = status;

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { slug: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
      ];
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      Blog.countDocuments(query),
    ]);

    res.json({
      success: true,
      blogs,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error("Admin get blogs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin blogs",
    });
  }
};

// ===============================
// Admin: Get single blog by id
// GET /api/blogs/admin/:id
// ===============================
exports.adminGetBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Admin get blog error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
    });
  }
};

// ===============================
// Admin: Create blog
// POST /api/blogs/admin
// ===============================
exports.adminCreateBlog = async (req, res) => {
  try {
    const body = req.body;

    if (!body.title) {
      return res.status(400).json({
        success: false,
        message: "Blog title is required",
      });
    }

    if (!body.category) {
      return res.status(400).json({
        success: false,
        message: "Blog category is required",
      });
    }

    const slug = body.slug ? makeSlug(body.slug) : makeSlug(body.title);

    const existing = await Blog.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Blog slug already exists",
      });
    }

    const blog = await Blog.create({
      title: body.title,
      slug,
      excerpt: body.excerpt || "",
      content: body.content || "",
      bannerImage: body.bannerImage || "",
      featuredImage: body.featuredImage || "",
      category: body.category.toLowerCase(),
      tags: body.tags || [],
      authorName: body.authorName || "Royal Trading Component",
      authorRole:
        body.authorRole || "Industrial Electronics Procurement Team",
      sections: body.sections || [],
      faqs: body.faqs || [],
      relatedProductSlugs: body.relatedProductSlugs || [],
      relatedCategorySlugs: body.relatedCategorySlugs || [],
      metaTitle: body.metaTitle || body.title,
      metaDescription: body.metaDescription || body.excerpt || "",
      metaKeywords: body.metaKeywords || body.tags || [],

      primaryKeyword:
  body.primaryKeyword || "",

secondaryKeywords:
  body.secondaryKeywords || [],

tableOfContents:
  body.tableOfContents || [],

industries:
  body.industries || [],

applications:
  body.applications || [],

advantages:
  body.advantages || [],

specifications:
  body.specifications || [],

locations:
  body.locations || [],

trustSignals:
  body.trustSignals || [],

ctaTitle:
  body.ctaTitle || "",

ctaDescription:
  body.ctaDescription || "",

ctaButtonText:
  body.ctaButtonText || "",

youtubeUrl:
  body.youtubeUrl || "",

datasheetUrl:
  body.datasheetUrl || "",

schemaType:
  body.schemaType || "Article",

      canonicalUrl: body.canonicalUrl || "",
      status: body.status || "draft",
      isFeatured: !!body.isFeatured,
      isTrending: !!body.isTrending,
      readTime: calculateReadTime(body.content, body.sections),
      publishedAt:
        body.status === "published"
          ? body.publishedAt || new Date()
          : body.publishedAt || null,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create blog",
    });
  }
};

// ===============================
// Admin: Update blog
// PUT /api/blogs/admin/:id
// ===============================
exports.adminUpdateBlog = async (req, res) => {
  try {
    const body = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const newSlug = body.slug ? makeSlug(body.slug) : blog.slug;

    if (newSlug !== blog.slug) {
      const existing = await Blog.findOne({
        slug: newSlug,
        _id: { $ne: blog._id },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Blog slug already exists",
        });
      }
    }

    blog.title = body.title ?? blog.title;
    blog.slug = newSlug;
    blog.excerpt = body.excerpt ?? blog.excerpt;
    blog.content = body.content ?? blog.content;
    blog.bannerImage = body.bannerImage ?? blog.bannerImage;
    blog.featuredImage = body.featuredImage ?? blog.featuredImage;
    blog.category = body.category
      ? body.category.toLowerCase()
      : blog.category;

    blog.tags = body.tags ?? blog.tags;
    blog.authorName = body.authorName ?? blog.authorName;
    blog.authorRole = body.authorRole ?? blog.authorRole;
    blog.sections = body.sections ?? blog.sections;
    blog.faqs = body.faqs ?? blog.faqs;
    blog.relatedProductSlugs =
      body.relatedProductSlugs ?? blog.relatedProductSlugs;
    blog.relatedCategorySlugs =
      body.relatedCategorySlugs ?? blog.relatedCategorySlugs;

    blog.metaTitle = body.metaTitle ?? blog.metaTitle;
    blog.metaDescription = body.metaDescription ?? blog.metaDescription;
    blog.metaKeywords = body.metaKeywords ?? blog.metaKeywords;

    blog.primaryKeyword =
  body.primaryKeyword ??
  blog.primaryKeyword;

blog.secondaryKeywords =
  body.secondaryKeywords ??
  blog.secondaryKeywords;

blog.tableOfContents =
  body.tableOfContents ??
  blog.tableOfContents;

blog.industries =
  body.industries ??
  blog.industries;

blog.applications =
  body.applications ??
  blog.applications;

blog.advantages =
  body.advantages ??
  blog.advantages;

blog.specifications =
  body.specifications ??
  blog.specifications;

blog.locations =
  body.locations ??
  blog.locations;

blog.trustSignals =
  body.trustSignals ??
  blog.trustSignals;

blog.ctaTitle =
  body.ctaTitle ??
  blog.ctaTitle;

blog.ctaDescription =
  body.ctaDescription ??
  blog.ctaDescription;

blog.ctaButtonText =
  body.ctaButtonText ??
  blog.ctaButtonText;

blog.youtubeUrl =
  body.youtubeUrl ??
  blog.youtubeUrl;

blog.datasheetUrl =
  body.datasheetUrl ??
  blog.datasheetUrl;

blog.schemaType =
  body.schemaType ??
  blog.schemaType;
  
    blog.canonicalUrl = body.canonicalUrl ?? blog.canonicalUrl;

    blog.isFeatured =
      typeof body.isFeatured === "boolean"
        ? body.isFeatured
        : blog.isFeatured;

    blog.isTrending =
      typeof body.isTrending === "boolean"
        ? body.isTrending
        : blog.isTrending;

    if (body.status) {
      const wasNotPublished = blog.status !== "published";
      blog.status = body.status;

      if (body.status === "published" && wasNotPublished) {
        blog.publishedAt = body.publishedAt || new Date();
      }

      if (body.status !== "published") {
        blog.publishedAt = body.publishedAt || blog.publishedAt;
      }
    }

    blog.readTime = calculateReadTime(blog.content, blog.sections);

    await blog.save();

    res.json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update blog",
    });
  }
};

// ===============================
// Admin: Delete blog
// DELETE /api/blogs/admin/:id
// ===============================
exports.adminDeleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    await blog.deleteOne();

    res.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
    });
  }
};