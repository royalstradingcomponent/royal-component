const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const User = require("../models/User");
const Coupon = require("../models/Coupon");
const Chat = require("../models/Chat");
const HeroSlide = require("../models/HeroSlide");
const HomeSection = require("../models/HomeSection");
const PolicyPage = require("../models/PolicyPage");

let notificationService = {};
try {
  notificationService = require("../services/notificationService");
} catch {
  notificationService = {};
}

const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9- ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const normalizeCategory = (value = "") =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");

const parseArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    }
  }
  return [];
};

const parseSpecifications = (value) => {
  const arr = parseArray(value);
  return arr
    .map((item) => ({
      key: item.key || "",
      value: item.value || "",
    }))
    .filter((item) => item.key && item.value);
};

const parseDocuments = (value) => {
  const arr = parseArray(value);
  return arr
    .map((item) => ({
      label: item.label || "",
      url: item.url || "",
      type: item.type || "other",
    }))
    .filter((item) => item.label && item.url);
};

const serializeOrder = (orderDoc) => {
  const order =
    typeof orderDoc?.toObject === "function" ? orderDoc.toObject() : orderDoc;

  const userInfo = order.userInfo || {};
  const pricing = order.pricing || {};
  const payment = order.payment || {};
  const shipment = order.shipment || {};
  const products = order.products || [];

  return {
    ...order,
    id: order._id,
    _id: order._id,

    orderNumber: order.orderNumber,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,

    status: order.orderStatus || order.status || "Order Placed",
    orderStatus: order.orderStatus || order.status || "Order Placed",

    customer: userInfo.name || "Customer",
    phone: userInfo.phone || "",
    email: userInfo.email || "",

    userInfo: {
      name: userInfo.name || "",
      phone: userInfo.phone || "",
      alternatePhone: userInfo.alternatePhone || "",
      email: userInfo.email || "",
      companyName: userInfo.companyName || "",
      gstNumber: userInfo.gstNumber || "",
      addressLine1: userInfo.addressLine1 || userInfo.addressLine || "",
      addressLine2: userInfo.addressLine2 || userInfo.landmark || "",
      city: userInfo.city || "",
      state: userInfo.state || "",
      pincode: userInfo.pincode || "",
      country: userInfo.country || "India",
    },

    products: products.map((item) => ({
      _id: item._id,
      product: item.product,
      name: item.name || item.nameSnapshot || "",
      brand: item.brand || item.brandSnapshot || "Generic",
      sku: item.sku || item.skuSnapshot || "",
      mpn: item.mpn || item.mpnSnapshot || "",
      img: item.img || item.image || item.imageSnapshot || item.thumbnail || "",
      quantity: item.quantity || item.qty || 1,
      price: item.price || item.priceSnapshot || 0,
      mrp: item.mrp || item.mrpSnapshot || 0,
      gstAmount: item.gstAmount || 0,
      lineTotal:
        item.lineTotal ||
        Number(item.price || item.priceSnapshot || 0) *
        Number(item.quantity || item.qty || 1),
      itemStatus: item.itemStatus || order.orderStatus || "Order Placed",
      itemStatusHistory: item.itemStatusHistory || [],
    })),

    pricing: {
      subtotal: pricing.subtotal || 0,
      tax: pricing.tax || pricing.gstTotal || 0,
      shippingCharge: pricing.shippingCharge || pricing.shipping || 0,
      totalAmount: pricing.totalAmount || pricing.grandTotal || 0,
      itemCount:
        pricing.itemCount ||
        products.reduce((sum, item) => sum + Number(item.quantity || item.qty || 1), 0),
    },

    total: pricing.totalAmount || pricing.grandTotal || 0,
    finalAmount: pricing.totalAmount || pricing.grandTotal || 0,

    payment: {
  method: payment.method || "",
  status: payment.status || "Pending",
  transactionId: payment.transactionId || payment.paymentId || "",
  amountPaid: payment.amountPaid || 0,
  paidAt: payment.paidAt || null,
  proof: {
    image: payment.proof?.image || "",
    utr: payment.proof?.utr || "",
    note: payment.proof?.note || "",
    uploadedAt: payment.proof?.uploadedAt || null,
  },
  verifiedAt: payment.verifiedAt || null,
  adminNote: payment.adminNote || "",
},

    paymentMethod: payment.method || "",

    shipment: {
      courier: shipment.courier || "",
      trackingId: shipment.trackingId || "",
      trackingUrl: shipment.trackingUrl || "",
      shippedAt: shipment.shippedAt || null,
      deliveredAt: shipment.deliveredAt || null,
    },

    canEditAddress: order.canEditAddress !== false,
    canEditPhone: order.canEditPhone !== false,
  };
};

/* ================= DASHBOARD ================= */

exports.getCounts = async (req, res) => {
  try {
    const [salesAgg, totalCustomers, totalProducts, totalOrders, recentOrdersRaw, recentProducts, lowStock] =
      await Promise.all([
        Order.aggregate([
          {
            $group: {
              _id: null,
              totalSales: { $sum: "$pricing.totalAmount" },
            },
          },
        ]),
        User.countDocuments({ role: "user", isDeleted: false }),
        Product.countDocuments({ isActive: true }),
        Order.countDocuments(),
        Order.find().sort({ createdAt: -1 }).limit(6).lean(),
        Product.find({ isActive: true, status: "published" })
          .sort({ createdAt: -1 })
          .limit(6)
          .lean(),
        Product.find({ isActive: true, stock: { $lte: 10 } })
          .sort({ stock: 1 })
          .limit(6)
          .lean(),
      ]);

    res.json({
      success: true,
      totalSales: salesAgg?.[0]?.totalSales || 0,
      totalCustomers,
      totalProducts,
      totalOrders,
      recentOrders: recentOrdersRaw.map((o) => ({
        id: o._id,
        orderNumber: o.orderNumber,
        customer: o.userInfo?.name || "Customer",
        amount: o.pricing?.totalAmount || 0,
        status: o.orderStatus,
        createdAt: o.createdAt,
      })),
      recentProducts: recentProducts.map((p) => ({
        id: p._id,
        name: p.name,
        sku: p.sku,
        image: p.thumbnail || p.images?.[0]?.url || "",
        price: p.price,
        stock: p.stock,
        category: p.category,
      })),
      lowStock: lowStock.map((p) => ({
        _id: p._id,
        name: p.name,
        sku: p.sku,
        totalStock: p.stock,
        category: p.category,
      })),
    });
  } catch (error) {
    console.error("ADMIN COUNTS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSalesGraph = async (req, res) => {
  try {
    const { period = "7days" } = req.query;

    let startDate = new Date();
    if (period === "month") {
      startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    } else {
      startDate.setDate(startDate.getDate() - 6);
    }

    const sales = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%d %b",
              date: "$createdAt",
            },
          },
          sales: { $sum: "$pricing.totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: sales.map((item) => ({
        date: item._id,
        sales: Math.round(item.sales || 0),
        orders: item.orders || 0,
      })),
    });
  } catch (error) {
    console.error("SALES GRAPH ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= PRODUCTS ================= */

exports.getProducts = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 200);
    const keyword = req.query.keyword || req.query.search || "";
    const category = req.query.category || "";
    const status = req.query.status || "";

    const filter = {};

    if (keyword) {
      const regex = new RegExp(keyword, "i");
      filter.$or = [
        { name: regex },
        { sku: regex },
        { mpn: regex },
        { brand: regex },
        { category: regex },
        { subCategory: regex },
      ];
    }

    if (category) {
      filter.category = { $in: category.split(",").map((x) => normalizeCategory(x)) };
    }

    if (status) filter.status = status;

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      products,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error("ADMIN GET PRODUCTS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.category) {
      return res.status(400).json({
        success: false,
        message: "Product name and category are required",
      });
    }

    const payload = {
      name: data.name,
      slug: data.slug ? slugify(data.slug) : slugify(data.name),
      sku: data.sku ? String(data.sku).toUpperCase().trim() : undefined,
      mpn: data.mpn || "",
      brand: data.brand || "Generic",
      category: normalizeCategory(data.category),
      subCategory: data.subCategory ? normalizeCategory(data.subCategory) : "",
      shortDescription: data.shortDescription || "",
      description: data.description || "",
      thumbnail: data.thumbnail || "",
      images: parseArray(data.images),
      specifications: parseSpecifications(data.specifications),
      documents: parseDocuments(data.documents),
      highlights: parseArray(data.highlights),
      applications: parseArray(data.applications),
      customSections: parseArray(data.customSections),
      price: Number(data.price || 0),
      mrp: Number(data.mrp || 0),
      stock: Number(data.stock || 0),
      moq: Math.max(1, Number(data.moq || 1)),
      unit: data.unit || "piece",
      leadTimeDays: Number(data.leadTimeDays || 0),
      countryOfOrigin: data.countryOfOrigin || "",
      warranty: data.warranty || "",
      tags: parseArray(data.tags),
      isFeatured: data.isFeatured === true || data.isFeatured === "true",
      isBestSeller: data.isBestSeller === true || data.isBestSeller === "true",
      isActive: data.isActive !== false && data.isActive !== "false",
      status: data.status || "published",
      seo: {
        metaTitle: data.metaTitle || data.seo?.metaTitle || data.name,
        metaDescription:
          data.metaDescription || data.seo?.metaDescription || data.shortDescription || "",
        metaKeywords: parseArray(data.metaKeywords || data.seo?.metaKeywords),
      },
    };

    const product = await Product.create(payload);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("ADMIN CREATE PRODUCT ERROR:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.name && !data.slug) data.slug = slugify(data.name);
    if (data.slug) data.slug = slugify(data.slug);
    if (data.sku) data.sku = String(data.sku).toUpperCase().trim();
    if (data.category) data.category = normalizeCategory(data.category);
    if (data.subCategory) data.subCategory = normalizeCategory(data.subCategory);

    if (data.images !== undefined) data.images = parseArray(data.images);
    if (data.specifications !== undefined) {
      data.specifications = parseSpecifications(data.specifications);
    }
    if (data.documents !== undefined) data.documents = parseDocuments(data.documents);
    if (data.highlights !== undefined) data.highlights = parseArray(data.highlights);
    if (data.applications !== undefined) data.applications = parseArray(data.applications);
    if (data.customSections !== undefined) data.customSections = parseArray(data.customSections);
    if (data.tags !== undefined) data.tags = parseArray(data.tags);

    ["price", "mrp", "stock", "moq", "leadTimeDays"].forEach((field) => {
      if (data[field] !== undefined) data[field] = Number(data[field]);
    });

    if (data.metaTitle || data.metaDescription || data.metaKeywords) {
      data.seo = {
        metaTitle: data.metaTitle || "",
        metaDescription: data.metaDescription || "",
        metaKeywords: parseArray(data.metaKeywords),
      };
      delete data.metaTitle;
      delete data.metaDescription;
      delete data.metaKeywords;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("ADMIN UPDATE PRODUCT ERROR:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false, status: "archived" },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product archived successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteManyProducts = async (req, res) => {
  try {
    const ids = req.body.ids || [];

    await Product.updateMany(
      { _id: { $in: ids } },
      { $set: { isActive: false, status: "archived" } }
    );

    res.json({ success: true, message: "Products archived successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= INVENTORY ================= */

exports.getInventory = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 200);
    const keyword = req.query.keyword || req.query.search || "";
    const category = req.query.category || "";

    const filter = { isActive: true };

    if (keyword) {
      const regex = new RegExp(keyword, "i");
      filter.$or = [{ name: regex }, { sku: regex }, { mpn: regex }, { brand: regex }];
    }

    if (category) {
      filter.category = { $in: category.split(",").map((x) => normalizeCategory(x)) };
    }

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .select("name sku mpn brand category subCategory thumbnail images price mrp stock moq unit leadTimeDays status")
      .sort({ stock: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      inventory: products.map((p) => ({
        _id: p._id,
        productName: p.name,
        sku: p.sku,
        mpn: p.mpn,
        brand: p.brand,
        category: p.category,
        subCategory: p.subCategory,
        image: p.thumbnail || p.images?.[0]?.url || "",
        price: p.price,
        mrp: p.mrp,
        stock: p.stock,
        moq: p.moq,
        unit: p.unit,
        leadTimeDays: p.leadTimeDays,
        status: p.status,
      })),
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error("ADMIN INVENTORY ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const allowed = ["price", "mrp", "stock", "moq", "sku", "mpn", "leadTimeDays", "status"];
    const payload = {};

    allowed.forEach((key) => {
      if (req.body[key] !== undefined) payload[key] = req.body[key];
    });

    ["price", "mrp", "stock", "moq", "leadTimeDays"].forEach((key) => {
      if (payload[key] !== undefined) payload[key] = Number(payload[key]);
    });

    if (payload.sku) payload.sku = String(payload.sku).toUpperCase().trim();

    const product = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Inventory updated", product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ================= CATEGORIES ================= */

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= MAIN CATEGORIES =================
exports.getMainCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      parentSlug: "",
      isActive: true,
    }).sort({ order: 1 });

    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= SUB CATEGORIES =================
exports.getSubCategories = async (req, res) => {
  try {
    const { parent } = req.query;

    if (!parent) {
      return res.json({ success: true, categories: [] });
    }

    const categories = await Category.find({
      parentSlug: parent,
      isActive: true,
    }).sort({ order: 1 });

    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= CHILD CATEGORIES =================
exports.getChildCategories = async (req, res) => {
  try {
    const { sub } = req.query;

    if (!sub) {
      return res.json({ success: true, categories: [] });
    }

    const categories = await Category.find({
      parentSlug: sub,
      isActive: true,
    }).sort({ order: 1 });

    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ success: false, message: "Category name required" });
    }

    const slug = req.body.slug ? slugify(req.body.slug) : slugify(req.body.name);

    const category = await Category.create({
      name: req.body.name,
      slug,
      description: req.body.description || "",
      image: req.body.image || "",
      iconAlt: req.body.iconAlt || "",
      parentSlug: req.body.parentSlug ? slugify(req.body.parentSlug) : "",
      group: req.body.group ? slugify(req.body.group) : "",
      countText: req.body.countText || "",
      order: Number(req.body.order || 0),
      isActive: req.body.isActive !== false && req.body.isActive !== "false",
      seo: {
        metaTitle: req.body.metaTitle || "",
        metaDescription: req.body.metaDescription || "",
        metaKeywords: parseArray(req.body.metaKeywords),
      },
    });

    res.status(201).json({ success: true, message: "Category created", category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.slug) data.slug = slugify(data.slug);
    if (data.parentSlug !== undefined) data.parentSlug = data.parentSlug ? slugify(data.parentSlug) : "";
    if (data.group !== undefined) data.group = data.group ? slugify(data.group) : "";
    if (data.order !== undefined) data.order = Number(data.order);

    if (data.metaTitle || data.metaDescription || data.metaKeywords) {
      data.seo = {
        metaTitle: data.metaTitle || "",
        metaDescription: data.metaDescription || "",
        metaKeywords: parseArray(data.metaKeywords),
      };
    }

    const category = await Category.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, message: "Category updated", category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteManyCategories = async (req, res) => {
  try {
    const ids = req.body.ids || [];
    await Category.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, message: "Categories deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= ORDERS ================= */

exports.getOrders = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const search = req.query.search || "";
    const status = req.query.status || "";
    const startDate = req.query.startDate || "";
    const endDate = req.query.endDate || "";

    const filter = {};

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { orderNumber: regex },
        { "userInfo.name": regex },
        { "userInfo.phone": regex },
        { "userInfo.email": regex },
        { "products.name": regex },
        { "products.sku": regex },
      ];
    }

    if (status && status !== "All") {
      if (status === "Unfulfilled") {
        filter.orderStatus = { $nin: ["Delivered", "Cancelled"] };
      } else {
        filter.orderStatus = { $in: status.split(",") };
      }
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      orders: orders.map(serializeOrder),
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error("ADMIN GET ORDERS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const deliveredOrders = await Order.countDocuments({ orderStatus: "Delivered" });
    const cancelledOrders = await Order.countDocuments({ orderStatus: "Cancelled" });
    const pendingOrders = await Order.countDocuments({
      orderStatus: { $nin: ["Delivered", "Cancelled"] },
    });

    const salesAgg = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$pricing.totalAmount" } } },
    ]);

    res.json({
      success: true,
      totalOrders,
      deliveredOrders,
      cancelledOrders,
      pendingOrders,
      totalSales: salesAgg?.[0]?.totalSales || 0,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrdersDetails = async (req, res) => {
  try {
    const ids = req.body.ids || [];

    const orders = await Order.find({
      _id: { $in: ids.filter((id) => mongoose.Types.ObjectId.isValid(id)) },
    });

    res.json({
      success: true,
      orders: orders.map(serializeOrder),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status, trackingId, courier, trackingUrl, paymentStatus } = req.body;

    const allowedStatuses = [
      "Order Placed",
      "Processing",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.orderStatus = status;

    order.products.forEach((item) => {
      item.itemStatus = status;
      item.itemStatusHistory.push({
        status,
        message: `Order status updated to ${status}`,
        date: new Date(),
      });
    });

    if (trackingId !== undefined) order.shipment.trackingId = trackingId;
    if (courier !== undefined) order.shipment.courier = courier;
    if (trackingUrl !== undefined) order.shipment.trackingUrl = trackingUrl;

    if (paymentStatus) {
      order.payment.status = paymentStatus;
      if (paymentStatus === "Paid") order.payment.paidAt = new Date();
    }

    if (status === "Shipped") {
      order.shipment.shippedAt = new Date();
      order.canEditAddress = false;
      order.canEditPhone = false;
    }

    if (status === "Delivered") {
      order.shipment.deliveredAt = new Date();
      order.canEditAddress = false;
      order.canEditPhone = false;
    }

    if (status === "Cancelled") {
      order.cancellation.cancelledAt = new Date();
    }

    await order.save();

    try {
      if (status === "Delivered" && notificationService.sendOrderDeliveredNotification) {
        await notificationService.sendOrderDeliveredNotification(order);
      }

      if (status === "Cancelled" && notificationService.sendOrderCancelNotification) {
        await notificationService.sendOrderCancelNotification(order);
      }
    } catch (notifyError) {
      console.error("ORDER NOTIFICATION ERROR:", notifyError.message);
    }

    res.json({
      success: true,
      message: "Order status updated",
      order: serializeOrder(order),
    });
  } catch (error) {
    console.error("ADMIN UPDATE ORDER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderAddress = async (req, res) => {
  try {
    const {
      orderId,
      name,
      phone,
      alternatePhone,
      email,
      companyName,
      gstNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country,
    } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "Complete delivery address is required",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      ["Shipped", "Out for Delivery", "Delivered", "Cancelled"].includes(
        order.orderStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: `Address cannot be changed after order is ${order.orderStatus}`,
      });
    }

    order.userInfo.name = name || order.userInfo.name;
    order.userInfo.phone = phone || order.userInfo.phone;
    order.userInfo.alternatePhone = alternatePhone || "";
    order.userInfo.email = email || order.userInfo.email;
    order.userInfo.companyName = companyName || "";
    order.userInfo.gstNumber = gstNumber || "";

    order.userInfo.addressLine1 = addressLine1;
    order.userInfo.addressLine2 = addressLine2 || "";
    order.userInfo.city = city;
    order.userInfo.state = state;
    order.userInfo.pincode = pincode;
    order.userInfo.country = country || "India";

    await order.save();

    return res.json({
      success: true,
      message: "Order delivery address updated successfully",
      order: serializeOrder(order),
    });
  } catch (error) {
    console.error("ADMIN UPDATE ORDER ADDRESS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Address update failed",
    });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const normalizedPath = req.file.path.replace(/\\/g, "/");

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: `/${normalizedPath}`,
        url: `/${normalizedPath}`,
      },
    });
  } catch (error) {
    console.error("ADMIN FILE UPLOAD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "File upload failed",
    });
  }
};

/* ================= CUSTOMERS ================= */

exports.getCustomers = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const search = req.query.search || "";

    const filter = { role: "user", isDeleted: false };

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      users,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").lean();

    if (!user) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    const orders = await Order.find({ userId: req.params.id }).sort({ createdAt: -1 }).lean();

    const totalSpent = orders.reduce(
      (sum, order) => sum + Number(order.pricing?.totalAmount || 0),
      0
    );

    res.json({
      success: true,
      user,
      orders: orders.map(serializeOrder),
      totalOrders: orders.length,
      totalSpent,
      completedOrders: orders.filter((o) => o.orderStatus === "Delivered").length,
      spendingOverTime: [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const allowed = ["name", "email", "phone", "gender", "birthday", "status"];
    const payload = {};

    allowed.forEach((key) => {
      if (req.body[key] !== undefined) payload[key] = req.body[key];
    });

    if (req.body.address) {
      payload.addresses = [req.body.address];
    }

    const user = await User.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    res.json({ success: true, message: "Customer updated", user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true,
        status: "deleted",
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Customer deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["active", "inactive", "suspended"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid user status" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User status updated", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= COUPONS ================= */

exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create({
      code: String(req.body.code || "").toUpperCase().trim(),
      title: req.body.title,
      description: req.body.description || "",
      discountType: req.body.discountType || "percentage",
      discountValue: Number(req.body.discountValue || 0),
      minOrderAmount: Number(req.body.minOrderAmount || 0),
      maxDiscount: Number(req.body.maxDiscount || 0),
      isActive: req.body.isActive !== false,
      expiresAt: req.body.expiresAt || null,
    });

    res.status(201).json({ success: true, message: "Coupon created", coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.code) data.code = String(data.code).toUpperCase().trim();

    ["discountValue", "minOrderAmount", "maxDiscount"].forEach((key) => {
      if (data[key] !== undefined) data[key] = Number(data[key]);
    });

    const coupon = await Coupon.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.json({ success: true, message: "Coupon updated", coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= SUPPORT CHATS ================= */

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ isDeleted: false })
      .populate("user", "name email phone")
      .populate("order")
      .sort({ updatedAt: -1 })
      .lean();

    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("order");

    if (!chat || chat.isDeleted) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    res.json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.replyChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message required" });
    }

    const chat = await Chat.findById(req.params.id);

    if (!chat || chat.isDeleted) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    chat.messages.push({
      sender: "support",
      message: message.trim(),
    });

    chat.status = "waiting";

    await chat.save();

    const updatedChat = await Chat.findById(chat._id)
      .populate("user", "name email phone")
      .populate("order");

    res.json({ success: true, message: "Reply sent", chat: updatedChat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateChatStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["open", "waiting", "resolved"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid chat status" });
    }

    const chat = await Chat.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("user", "name email phone")
      .populate("order");

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    res.json({ success: true, message: "Chat status updated", chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNavbarCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      parentSlug: "semiconductors",
      isActive: true,
    }).sort({
      navbarOrder: 1,
      order: 1,
      createdAt: -1,
    });

    return res.json({
      success: true,
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Navbar categories fetch failed",
    });
  }
};

exports.updateNavbarCategory = async (req, res) => {
  try {
    const { showInNavbar, navbarOrder, isActive } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        ...(typeof showInNavbar === "boolean" ? { showInNavbar } : {}),
        ...(navbarOrder !== undefined ? { navbarOrder: Number(navbarOrder) } : {}),
        ...(typeof isActive === "boolean" ? { isActive } : {}),
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.json({
      success: true,
      message: "Navbar category updated",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Navbar category update failed",
    });
  }
};
exports.getHeroSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, slides });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.create(req.body);
    res.status(201).json({ success: true, message: "Hero slide created", slide });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!slide) {
      return res.status(404).json({ success: false, message: "Hero slide not found" });
    }

    res.json({ success: true, message: "Hero slide updated", slide });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findByIdAndDelete(req.params.id);

    if (!slide) {
      return res.status(404).json({ success: false, message: "Hero slide not found" });
    }

    res.json({ success: true, message: "Hero slide deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHomeSections = async (req, res) => {
  try {
    const sections = await HomeSection.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createHomeSection = async (req, res) => {
  try {
    const section = await HomeSection.create(req.body);
    res.status(201).json({ success: true, section });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateHomeSection = async (req, res) => {
  try {
    const section = await HomeSection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    res.json({ success: true, section });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteHomeSection = async (req, res) => {
  try {
    const section = await HomeSection.findByIdAndDelete(req.params.id);

    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    res.json({ success: true, message: "Section deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= POLICY PAGES ================= */

const normalizePolicySlug = (value = "") =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const parsePolicyArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const makePolicyPayload = (body = {}) => {
  const title = String(body.title || "").trim();
  const slug = normalizePolicySlug(body.slug || title);

  return {
    title,
    slug,
    shortDescription: String(body.shortDescription || "").trim(),
    content: String(body.content || "").trim(),

    sections: parsePolicyArray(body.sections)
      .filter((item) => item.heading || item.content)
      .map((item, index) => ({
        heading: String(item.heading || "").trim(),
        content: String(item.content || "").trim(),
        order: Number(item.order ?? index),
        isActive: item.isActive !== false,
      })),

    faqs: parsePolicyArray(body.faqs)
      .filter((item) => item.question || item.answer)
      .map((item, index) => ({
        question: String(item.question || "").trim(),
        answer: String(item.answer || "").trim(),
        order: Number(item.order ?? index),
        isActive: item.isActive !== false,
      })),

    isActive: body.isActive !== false,

    seo: {
      metaTitle: String(body.seo?.metaTitle || body.metaTitle || title).trim(),
      metaDescription: String(
        body.seo?.metaDescription ||
          body.metaDescription ||
          body.shortDescription ||
          ""
      ).trim(),
      metaKeywords: parsePolicyArray(
        body.seo?.metaKeywords || body.metaKeywords
      ),
    },
  };
};

exports.getPolicyPages = async (req, res) => {
  try {
    const pages = await PolicyPage.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, pages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPolicyPageBySlug = async (req, res) => {
  try {
    const slug = normalizePolicySlug(req.params.slug);

    const page = await PolicyPage.findOne({
      slug,
      isActive: true,
    }).lean();

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Policy page not found",
      });
    }

    page.sections = (page.sections || [])
      .filter((x) => x.isActive !== false)
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

    page.faqs = (page.faqs || [])
      .filter((x) => x.isActive !== false)
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

    res.json({ success: true, page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPolicyPage = async (req, res) => {
  try {
    const payload = makePolicyPayload(req.body);

    if (!payload.title) {
      return res.status(400).json({
        success: false,
        message: "Policy title is required",
      });
    }

    if (!payload.slug) {
      return res.status(400).json({
        success: false,
        message: "Policy slug is required",
      });
    }

    const exists = await PolicyPage.findOne({ slug: payload.slug });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "This policy slug already exists",
      });
    }

    const page = await PolicyPage.create(payload);

    res.status(201).json({
      success: true,
      message: "Policy page created successfully",
      page,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updatePolicyPage = async (req, res) => {
  try {
    const payload = makePolicyPayload(req.body);

    const duplicate = await PolicyPage.findOne({
      slug: payload.slug,
      _id: { $ne: req.params.id },
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "This policy slug already exists",
      });
    }

    const page = await PolicyPage.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Policy page not found",
      });
    }

    res.json({
      success: true,
      message: "Policy page updated successfully",
      page,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deletePolicyPage = async (req, res) => {
  try {
    const page = await PolicyPage.findByIdAndDelete(req.params.id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Policy page not found",
      });
    }

    res.json({
      success: true,
      message: "Policy page deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE BY SLUG
exports.getPolicyPageBySlug = async (req, res) => {
  try {
    const page = await PolicyPage.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!page) {
      return res
        .status(404)
        .json({ success: false, message: "Policy not found" });
    }

    res.json({ success: true, page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE
exports.createPolicyPage = async (req, res) => {
  try {
    const page = await PolicyPage.create(req.body);
    res.status(201).json({ success: true, page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE
exports.updatePolicyPage = async (req, res) => {
  try {
    const page = await PolicyPage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
exports.deletePolicyPage = async (req, res) => {
  try {
    await PolicyPage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};