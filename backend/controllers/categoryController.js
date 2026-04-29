const Category = require("../models/Category");

const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "-");

const normalizeOptionalSlug = (value = "") => {
  if (!value) return "";
  return slugify(value);
};

exports.getCategories = async (req, res) => {
  try {
    const filter = { isActive: true };

    if (req.query.group) {
      filter.group = slugify(req.query.group);
    }

    if (req.query.parentSlug !== undefined) {
      filter.parentSlug = normalizeOptionalSlug(req.query.parentSlug);
    }

    const categories = await Category.find(filter)
      .sort({ order: 1, createdAt: 1 })
      .lean();

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCategoryBySlug = async (req, res) => {
  try {
    const slug = slugify(req.params.slug);

    const category = await Category.findOne({
      slug,
      isActive: true,
    }).lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const children = await Category.find({
      parentSlug: category.slug,
      isActive: true,
    })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    res.status(200).json({
      success: true,
      category,
      children,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const data = req.body;

    if (!data.name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const slug = data.slug ? slugify(data.slug) : slugify(data.name);

    const category = await Category.findOneAndUpdate(
      { slug },
      {
        $set: {
          ...data,
          slug,
          parentSlug: normalizeOptionalSlug(data.parentSlug),
          group: data.group ? slugify(data.group) : "",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.bulkCreateCategories = async (req, res) => {
  try {
    const items = Array.isArray(req.body) ? req.body : req.body.categories;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "categories array is required",
      });
    }

    const operations = items.map((item, index) => {
      const slug = item.slug ? slugify(item.slug) : slugify(item.name);

      return {
        updateOne: {
          filter: { slug },
          update: {
            $set: {
              ...item,
              slug,
              parentSlug: normalizeOptionalSlug(item.parentSlug),
              group: item.group ? slugify(item.group) : "",
              order: item.order ?? index + 1,
            },
          },
          upsert: true,
        },
      };
    });

    const result = await Category.bulkWrite(operations);

    res.status(201).json({
      success: true,
      message: "Categories inserted/updated successfully",
      result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.slug) data.slug = slugify(data.slug);
    if (data.parentSlug !== undefined) {
      data.parentSlug = normalizeOptionalSlug(data.parentSlug);
    }
    if (data.group) data.group = slugify(data.group);

    const category = await Category.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.isActive = false;
    await category.save();

    res.status(200).json({
      success: true,
      message: "Category deactivated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};