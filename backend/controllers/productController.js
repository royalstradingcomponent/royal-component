const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");

const parseCsv = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9- ]/g, "") // 🔥 dash allow kiya
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

    const normalizeSubCategoryFilter = (value = "") => {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, ""); // 🔥 dash hata diya
};

const normalizeCategorySlug = (value = "") => {
  const raw = String(value || "").toLowerCase().trim();

  const map = {
    semiconductors: "semiconductors",
    semiconductor: "semiconductors",

    "cables & wires": "cableswires",
    "cables and wires": "cableswires",
    "cables-wires": "cableswires",
    cableswires: "cableswires",
    "cables-wires-components": "cableswires",
    cables: "cableswires",

    connectors: "connectors",
    connector: "connectors",

    "mechanical & hardware": "mechanicalhardware",
    "mechanical and hardware": "mechanicalhardware",
    "mechanical-hardware": "mechanicalhardware",
    mechanicalhardware: "mechanicalhardware",

    "passive components": "passivecomponents",
    "passive-components": "passivecomponents",
    passivecomponents: "passivecomponents",
    passives: "passivecomponents",

    "power supplies & regulators": "powersuppliesregulators",
    "power supplies and regulators": "powersuppliesregulators",
    "power-supplies-regulators": "powersuppliesregulators",
    powersuppliesregulators: "powersuppliesregulators",
    power: "powersuppliesregulators",

    "rf & wireless": "rfwireless",
    "rf and wireless": "rfwireless",
    "rf-wireless": "rfwireless",
    rfwireless: "rfwireless",

    automation: "automation",

    "sensors & transducers": "sensorstransducers",
    "sensors and transducers": "sensorstransducers",
    "sensors-transducers": "sensorstransducers",
    sensorstransducers: "sensorstransducers",
    sensors: "sensorstransducers",

    "tools & accessories": "toolsaccessories",
    "tools and accessories": "toolsaccessories",
    "tools-accessories": "toolsaccessories",
    toolsaccessories: "toolsaccessories",
    tools: "toolsaccessories",

    "displays & interface modules": "displaysinterfacemodules",
    "displays and interface modules": "displaysinterfacemodules",
    "displays-interface-modules": "displaysinterfacemodules",
    displaysinterfacemodules: "displaysinterfacemodules",

    "switches, buzzers & indicators": "switchesbuzzersindicators",
    "switches buzzers indicators": "switchesbuzzersindicators",
    "switches-buzzers-indicators": "switchesbuzzersindicators",
    switchesbuzzersindicators: "switchesbuzzersindicators",
  };

  if (map[raw]) return map[raw];
  return raw.replace(/[^a-z0-9]/g, "");
};

const getCategoryAliases = (value = "") => {
  const normalized = normalizeCategorySlug(value);

  const aliases = {
    semiconductors: ["semiconductors", "semiconductor", "components", "component"],

    cableswires: [
      "cableswires",
      "cables & wires",
      "cables and wires",
      "cables-wires",
      "cables",
    ],

    connectors: ["connectors", "connector"],

    mechanicalhardware: [
      "mechanicalhardware",
      "mechanical & hardware",
      "mechanical and hardware",
      "mechanical-hardware",
    ],

    passivecomponents: [
      "passivecomponents",
      "passive components",
      "passive-components",
      "passives",
    ],

    powersuppliesregulators: [
      "powersuppliesregulators",
      "power supplies & regulators",
      "power supplies and regulators",
      "power-supplies-regulators",
      "power",
    ],

    rfwireless: [
      "rfwireless",
      "rf & wireless",
      "rf and wireless",
      "rf-wireless",
    ],

    automation: ["automation"],

    sensorstransducers: [
      "sensorstransducers",
      "sensors & transducers",
      "sensors and transducers",
      "sensors-transducers",
      "sensors",
    ],

    toolsaccessories: [
      "toolsaccessories",
      "tools & accessories",
      "tools and accessories",
      "tools-accessories",
      "tools",
    ],

    displaysinterfacemodules: [
      "displaysinterfacemodules",
      "displays & interface modules",
      "displays and interface modules",
      "displays-interface-modules",
    ],

    switchesbuzzersindicators: [
      "switchesbuzzersindicators",
      "switches, buzzers & indicators",
      "switches buzzers indicators",
      "switches-buzzers-indicators",
    ],
  };

  return aliases[normalized] || [normalized];
};

const buildProductFilter = (query = {}) => {
  const filter = {
    isActive: true,
    status: "published",
  };

  if (query.category) {
    const aliases = getCategoryAliases(query.category);
    filter.category = { $in: aliases.map((item) => item.toLowerCase()) };
  }

  if (query.subCategory) {
    const subCategories = parseCsv(query.subCategory.toLowerCase());
    if (subCategories.length) {
      filter.subCategory = {
  $in: subCategories.map((item) => normalizeSubCategoryFilter(item)),
};
    }
  }

  if (query.brand) {
    const brands = parseCsv(query.brand);
    if (brands.length) {
      filter.brand = { $in: brands };
    }
  }

  const searchValue = query.keyword || query.search;

if (searchValue) {
  const regex = new RegExp(searchValue, "i");
  filter.$or = [
    { name: regex },
    { brand: regex },
    { sku: regex },
    { mpn: regex },
    { shortDescription: regex },
    { description: regex },
    { subCategory: regex },
  ];
}

  if (query.minPrice || query.maxPrice) {
    filter.price = {};

    if (query.minPrice !== undefined && query.minPrice !== "") {
      filter.price.$gte = Number(query.minPrice);
    }

    if (query.maxPrice !== undefined && query.maxPrice !== "") {
      filter.price.$lte = Number(query.maxPrice);
    }

    if (!Object.keys(filter.price).length) {
      delete filter.price;
    }
  }

  if (query.inStock === "true") {
    filter.stock = { $gt: 0 };
  }

  if (query.featured === "true") {
    filter.isFeatured = true;
  }

  if (query.bestSeller === "true") {
    filter.isBestSeller = true;
  }

  return filter;
};

const makeImagePath = (fileName = "") => {
  const name = String(fileName).trim();

  // Agar already full path diya hai (DB se)
  if (name.startsWith("/uploads/")) {
    return name;
  }

  // Auto detect folder
  const newProductsPath = `/uploads/new-products/${name}`;
  const oldProductsPath = `/uploads/products/${name}`;

  // Default: new-products use karo
  return newProductsPath;
};

const buildSeedProduct = (item) => {
  const files = Array.isArray(item.files) ? item.files.filter(Boolean) : [];
  const primaryFile = files[0] || "";

  return {
    name: item.name,
    slug: item.slug ? slugify(item.slug) : slugify(item.name),
    sku: item.sku ? String(item.sku).toUpperCase() : undefined,
    mpn: item.mpn || "",
    brand: item.brand || "Generic",
    category: normalizeCategorySlug(item.category),
    subCategory: item.subCategory ? normalizeSubCategoryFilter(item.subCategory) : "",
    shortDescription: item.shortDescription || "",
    description: item.description || item.shortDescription || "",
    thumbnail: primaryFile ? makeImagePath(primaryFile) : "",
    images: files.map((file, index) => ({
      url: makeImagePath(file),
      altText: `${item.name} image ${index + 1}`,
      isPrimary: index === 0,
      order: index,
    })),
    specifications: Array.isArray(item.specifications) ? item.specifications : [],
    documents: Array.isArray(item.documents) ? item.documents : [],
    price: Number(item.price || 0),
    mrp: Number(item.mrp || 0),
    stock: Number(item.stock || 0),
    moq: Number(item.moq || 1),
    unit: item.unit || "piece",
    leadTimeDays: Number(item.leadTimeDays || 0),
    countryOfOrigin: item.countryOfOrigin || "",
    warranty: item.warranty || "",
    tags: Array.isArray(item.tags) ? item.tags : [],
    isFeatured: Boolean(item.isFeatured),
    isBestSeller: Boolean(item.isBestSeller),
    isActive: item.isActive !== false,
    status: item.status || "published",
    seo: item.seo || {
      metaTitle: item.name || "",
      metaDescription: item.shortDescription || "",
      metaKeywords: [],
    },
  };
};

const dedupeAndInsert = async (products) => {
  const cleanedProducts = products.map((item) => ({
    ...item,
    slug: item.slug ? slugify(item.slug) : slugify(item.name),
    sku: item.sku ? String(item.sku).toUpperCase() : undefined,
    category: normalizeCategorySlug(item.category),
    subCategory: item.subCategory ? normalizeSubCategoryFilter(item.subCategory) : "",
    status: item.status || "published",
    isActive: item.isActive !== false,
    isFeatured: item.isFeatured || false,
    isBestSeller: item.isBestSeller || false,
    images: Array.isArray(item.images) ? item.images : [],
    specifications: Array.isArray(item.specifications) ? item.specifications : [],
    documents: Array.isArray(item.documents) ? item.documents : [],
    tags: Array.isArray(item.tags) ? item.tags : [],
    seo: item.seo || {
      metaTitle: "",
      metaDescription: "",
      metaKeywords: [],
    },
  }));

  const slugs = cleanedProducts.map((item) => item.slug).filter(Boolean);
  const skus = cleanedProducts.map((item) => item.sku).filter(Boolean);

  const existingProducts = await Product.find({
    $or: [
      { slug: { $in: slugs } },
      ...(skus.length ? [{ sku: { $in: skus } }] : []),
    ],
  }).select("slug sku name");

  const existingSlugSet = new Set(
    existingProducts.map((item) => String(item.slug).toLowerCase())
  );

  const existingSkuSet = new Set(
    existingProducts
      .filter((item) => item.sku)
      .map((item) => String(item.sku).toUpperCase())
  );

  const requestSlugSet = new Set();
  const requestSkuSet = new Set();

  const uniqueProducts = [];
  const skippedProducts = [];

  for (const item of cleanedProducts) {
    const slug = String(item.slug || "").toLowerCase();
    const sku = item.sku ? String(item.sku).toUpperCase() : "";

    const slugExistsInDb = existingSlugSet.has(slug);
    const skuExistsInDb = sku ? existingSkuSet.has(sku) : false;
    const slugDuplicateInRequest = requestSlugSet.has(slug);
    const skuDuplicateInRequest = sku ? requestSkuSet.has(sku) : false;

    if (slugExistsInDb || skuExistsInDb || slugDuplicateInRequest || skuDuplicateInRequest) {
      skippedProducts.push({
        name: item.name,
        slug: item.slug,
        sku: item.sku || "",
        reason: slugExistsInDb
          ? "slug already exists in database"
          : skuExistsInDb
          ? "sku already exists in database"
          : slugDuplicateInRequest
          ? "duplicate slug in same request"
          : "duplicate sku in same request",
      });
      continue;
    }

    requestSlugSet.add(slug);
    if (sku) requestSkuSet.add(sku);
    uniqueProducts.push(item);
  }

  let insertedProducts = [];

  if (uniqueProducts.length > 0) {
    insertedProducts = await Product.insertMany(uniqueProducts, {
      ordered: false,
    });
  }

  return {
    insertedProducts,
    skippedProducts,
  };
};

exports.getProducts = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 500);
    const filter = buildProductFilter(req.query);

    console.log("PRODUCT QUERY:", req.query);
console.log("PRODUCT FILTER:", JSON.stringify(filter, null, 2));

    let sortOption = { createdAt: -1 };

    switch (req.query.sort) {
      case "price_asc":
        sortOption = { price: 1 };
        break;
      case "price_desc":
        sortOption = { price: -1 };
        break;
      case "name_asc":
        sortOption = { name: 1 };
        break;
      case "name_desc":
        sortOption = { name: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    let total = await Product.countDocuments(filter);

/*
  Fallback logic:
  Agar exact child category me product nahi mila,
  to us child ke parent + siblings bucket ke products dikhao.
*/
if (total === 0 && req.query.subCategory) {
  const requestedSubCategory = normalizeSubCategoryFilter(req.query.subCategory);

  const currentCategory = await Category.findOne({
    slug: requestedSubCategory,
    isActive: true,
  }).lean();

  if (currentCategory) {
    const children = await Category.find({
      parentSlug: currentCategory.slug,
      isActive: true,
    })
      .select("slug")
      .lean();

    const siblings = currentCategory.parentSlug
      ? await Category.find({
          parentSlug: currentCategory.parentSlug,
          isActive: true,
        })
          .select("slug")
          .lean()
      : [];

    const fallbackSubCategories = [
      requestedSubCategory,
      normalizeSubCategoryFilter(currentCategory.slug),
      normalizeSubCategoryFilter(currentCategory.parentSlug || ""),
      ...children.map((item) => normalizeSubCategoryFilter(item.slug)),
      ...siblings.map((item) => normalizeSubCategoryFilter(item.slug)),
    ].filter(Boolean);

    filter.subCategory = {
      $in: [...new Set(fallbackSubCategories)],
    };

    total = await Product.countDocuments(filter);
  }
}

const products = await Product.find(filter)
      .select(
        "name slug sku brand category subCategory thumbnail images price mrp discount stock moq unit shortDescription description isFeatured isBestSeller createdAt"
      )
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      isActive: true,
      status: "published",
    })
      .select(
        "name slug sku brand thumbnail images price mrp discount stock shortDescription"
      )
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProductFilterMeta = async (req, res) => {
  try {
    const filter = buildProductFilter(req.query);

    const [brands, subcategories, priceRange] = await Promise.all([
      Product.aggregate([
        { $match: filter },
        { $match: { brand: { $exists: true, $ne: "" } } },
        { $group: { _id: "$brand", count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
      ]),
      Product.aggregate([
        { $match: filter },
        { $match: { subCategory: { $exists: true, $ne: "" } } },
        { $group: { _id: "$subCategory", count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
      ]),
      Product.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            min: { $min: "$price" },
            max: { $max: "$price" },
          },
        },
      ]),
    ]);

    res.status(200).json({
      success: true,
      brands: brands.map((item) => ({
        name: item._id,
        count: item.count,
      })),
      subcategories: subcategories.map((item) => ({
        name: item._id,
        count: item.count,
      })),
      priceRange: {
        min: priceRange[0]?.min ?? 0,
        max: priceRange[0]?.max ?? 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product || !product.isActive || product.status !== "published") {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const rawValue = String(req.params.slug || "").trim();
    const decodedValue = decodeURIComponent(rawValue);
    const normalizedSlug = slugify(decodedValue);

    let product = await Product.findOne({
      slug: normalizedSlug,
      isActive: true,
      status: "published",
    }).lean();

    if (!product && mongoose.Types.ObjectId.isValid(decodedValue)) {
      product = await Product.findOne({
        _id: decodedValue,
        isActive: true,
        status: "published",
      }).lean();
    }

    if (!product) {
      product = await Product.findOne({
        name: { $regex: new RegExp(`^${decodedValue}$`, "i") },
        isActive: true,
        status: "published",
      }).lean();
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.category || data.price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, category and price are required",
      });
    }

    const slug = data.slug ? slugify(data.slug) : slugify(data.name);

    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: "Product with same slug already exists",
      });
    }

    if (data.sku) {
      const existingSku = await Product.findOne({
        sku: data.sku.toUpperCase(),
      });
      if (existingSku) {
        return res.status(400).json({
          success: false,
          message: "SKU already exists",
        });
      }
    }

    const product = await Product.create({
      ...data,
      slug,
      sku: data.sku ? data.sku.toUpperCase() : undefined,
      category: normalizeCategorySlug(data.category),
      subCategory: data.subCategory ? slugify(data.subCategory) : "",
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.bulkCreateProducts = async (req, res) => {
  try {
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a non-empty array of products",
      });
    }

    const { insertedProducts, skippedProducts } = await dedupeAndInsert(products);

    res.status(201).json({
      success: true,
      message: "Bulk product upload processed successfully",
      insertedCount: insertedProducts.length,
      skippedCount: skippedProducts.length,
      insertedProducts,
      skippedProducts,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.seedBulkProducts = async (req, res) => {
  try {
    const items = Array.isArray(req.body?.items) ? req.body.items : [];

    if (!items.length) {
      return res.status(400).json({
        success: false,
        message: "Request body must contain items array",
      });
    }

    const preparedProducts = items.map(buildSeedProduct);

    const { insertedProducts, skippedProducts } = await dedupeAndInsert(preparedProducts);

    res.status(201).json({
      success: true,
      message: "Seed bulk product upload processed successfully",
      insertedCount: insertedProducts.length,
      skippedCount: skippedProducts.length,
      insertedProducts,
      skippedProducts,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (req.body.sku && req.body.sku !== product.sku) {
      const existingSku = await Product.findOne({
        sku: req.body.sku.toUpperCase(),
        _id: { $ne: product._id },
      });

      if (existingSku) {
        return res.status(400).json({
          success: false,
          message: "SKU already exists",
        });
      }
    }

    Object.keys(req.body).forEach((key) => {
      if (key === "sku" && req.body[key]) {
        product[key] = req.body[key].toUpperCase();
      } else if (key === "category" && req.body[key]) {
        product[key] = normalizeCategorySlug(req.body[key]);
      } else if (key === "subCategory" && req.body[key]) {
        product[key] = normalizeSubCategoryFilter(req.body[key]);
      } else {
        product[key] = req.body[key];
      }
    });

    if (req.body.name || req.body.slug) {
      product.slug = slugify(req.body.slug || req.body.name);
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product deactivated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSimilarProducts = async (req, res) => {
  try {
    const current = await Product.findById(req.params.id).lean();

    if (!current) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const aliases = getCategoryAliases(current.category);

    const products = await Product.find({
      _id: { $ne: current._id },
      isActive: true,
      status: "published",
      $or: [
        { category: { $in: aliases.map((item) => item.toLowerCase()) } },
        { brand: current.brand },
        { subCategory: current.subCategory },
      ],
    })
      .select(
        "name slug sku brand thumbnail images price mrp discount stock shortDescription"
      )
      .limit(12)
      .lean();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.searchProductsByImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const fileName = String(req.file.originalname || "")
      .toLowerCase()
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]/g, " ")
      .trim();

    const keywords = fileName.split(" ").filter(Boolean);

    const regex = keywords.length
      ? new RegExp(keywords.join("|"), "i")
      : new RegExp("", "i");

    const products = await Product.find({
      isActive: true,
      status: "published",
      $or: [
        { name: regex },
        { slug: regex },
        { sku: regex },
        { mpn: regex },
        { brand: regex },
        { category: regex },
        { subCategory: regex },
        { shortDescription: regex },
        { description: regex },
        { tags: regex },
      ],
    })
      .select(
        "name slug sku brand category subCategory thumbnail images price mrp discount stock moq unit shortDescription"
      )
      .limit(40)
      .lean();

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Image search error:", error);
    res.status(500).json({
      success: false,
      message: "Image search failed",
    });
  }
};

exports.requestRefund = async (req, res) => {
  try {
    const {
      reason = "",
      comment = "",
      method = "ORIGINAL_PAYMENT",
      upi = {},
      bank = {},
      card = {},
    } = req.body;

    if (!reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Refund reason is required",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!["Delivered", "Cancelled"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Refund can be requested only after delivered or cancelled order",
      });
    }

    if (["Requested", "Approved", "Processing", "Refunded"].includes(order.refund?.status)) {
      return res.status(400).json({
        success: false,
        message: "Refund request already exists for this order",
      });
    }

    const paymentMethod = order.payment?.method;

    if (paymentMethod === "COD" && method !== "BANK_ACCOUNT") {
      return res.status(400).json({
        success: false,
        message: "For COD orders, bank account details are required",
      });
    }

    if (method === "BANK_ACCOUNT") {
      if (!bank.accountHolderName || !bank.accountNumber || !bank.ifsc) {
        return res.status(400).json({
          success: false,
          message: "Account holder name, account number and IFSC are required",
        });
      }
    }

    if (method === "UPI") {
      if (!upi.upiId && !upi.phone) {
        return res.status(400).json({
          success: false,
          message: "UPI ID or UPI phone number is required",
        });
      }
    }

    if (method === "CARD") {
      if (!card.transactionId && !card.last4) {
        return res.status(400).json({
          success: false,
          message: "Card transaction ID or last 4 digits are required",
        });
      }
    }

    const refundAmount = Number(order.pricing?.totalAmount || 0);

    order.refund = {
      ...(order.refund || {}),
      status: "Requested",
      amount: refundAmount,
      reason,
      comment,
      method,
      upi: {
        upiId: upi.upiId || "",
        phone: upi.phone || "",
      },
      bank: {
        accountHolderName: bank.accountHolderName || "",
        accountNumber: bank.accountNumber || "",
        ifsc: bank.ifsc || "",
        bankName: bank.bankName || "",
      },
      card: {
        last4: card.last4 || "",
        transactionId: card.transactionId || "",
      },
      requestedAt: new Date(),
      history: [
        ...(order.refund?.history || []),
        {
          status: "Requested",
          message: "Refund request submitted by customer",
          date: new Date(),
        },
      ],
    };

    order.payment.status = "Refund Pending";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Refund request submitted successfully",
      order: serializeOrder(order),
    });
  } catch (error) {
    console.error("REQUEST REFUND ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Refund request failed",
    });
  }
};

exports.adminUpdateRefund = async (req, res) => {
  try {
    const {
      status,
      adminNote = "",
      refundReferenceId = "",
      amount,
    } = req.body;

    const allowed = ["Approved", "Rejected", "Processing", "Refunded"];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid refund status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.refund || order.refund.status === "Not Requested") {
      return res.status(400).json({
        success: false,
        message: "No refund request found for this order",
      });
    }

    order.refund.status = status;

    if (amount !== undefined) {
      order.refund.amount = Number(amount || 0);
    }

    order.refund.admin = {
      ...(order.refund.admin || {}),
      note: adminNote,
      processedBy: req.user?._id || null,
      refundReferenceId,
    };

    if (status === "Approved") {
      order.refund.approvedAt = new Date();
      order.payment.status = "Refund Processing";
    }

    if (status === "Rejected") {
      order.refund.rejectedAt = new Date();
      order.payment.status = "Paid";
    }

    if (status === "Processing") {
      order.refund.processedAt = new Date();
      order.payment.status = "Refund Processing";
    }

    if (status === "Refunded") {
      order.refund.refundedAt = new Date();
      order.payment.status = "Refunded";
    }

    order.refund.history.push({
      status,
      message: adminNote || `Refund status updated to ${status}`,
      date: new Date(),
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Refund updated successfully",
      order: serializeOrder(order),
    });
  } catch (error) {
    console.error("ADMIN UPDATE REFUND ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Refund update failed",
    });
  }
};