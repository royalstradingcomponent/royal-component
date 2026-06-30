const Order = require("../models/Order");
const Cart = require("../models/cart");
const User = require("../models/User");
const Product = require("../models/Product");
const ReturnReason = require("../models/ReturnReason");
const razorpay = require("../config/razorpay");
const path = require("path");

const logAdminActivity = require("../utils/logAdminActivity");

const auditService = require("../services/auditService");

const securityAlertService = require("../services/securityAlertService");
const {
  sendOrderPlacedNotification,
  sendOrderStatusNotification,
} = require("../services/notificationService");

const PDFDocument = require("pdfkit");
const SHIPPING_CHARGE = 0;
const PLATFORM_FEE = 0;

const getUploadUrl = (file) => {
  if (!file) return "";

  const folder = path.basename(path.dirname(file.path));

  return `/uploads/${folder}/${file.filename}`;
};

const generateOrderNumber = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(100000 + Math.random() * 900000);
  return `RC-${date}-${random}`;
};

const mapPaymentMethod = (method) => {
  if (String(method).toLowerCase() === "cod") {
    return "COD";
  }

  return "RAZORPAY";
};

const serializeOrder = (orderDoc) => {
  const order =
    typeof orderDoc?.toObject === "function" ? orderDoc.toObject() : orderDoc;

  return {
    ...order,
    finalAmount: order?.pricing?.totalAmount || 0,
    status: order?.orderStatus || "Order Placed",
    trackingEvents: order?.products?.[0]?.itemStatusHistory || [
      {
        status: "Order Placed",
        message: "Order created",
        date: order?.createdAt,
      },
    ],
  };
};

/* =====================================================
  CREATE ORDER FROM CART
  POST /api/orders
===================================================== */
exports.createOrder = async (req, res) => {
  try {
    const {
      buyer = {},
      shippingAddress = {},
      paymentMethod = "razorpay",
      note = "",
    } = req.body;

    if (!buyer.fullName || !buyer.phone) {
      return res.status(400).json({
        success: false,
        message: "Buyer name and phone are required",
      });
    }

    if (
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete delivery address is required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name slug brand sku mpn thumbnail images stock stockStatus isOutOfStock allowBackorder price mrp hsnCode isActive status",
    );

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const products = [];

    for (const item of cart.items) {
      const product = item.product;
      if (!product) continue;

      const isOutOfStock = Number(product?.stock || 0) <= 0;

      if (isOutOfStock) {
        return res.status(400).json({
          success: false,
          message: `${product?.name || "Product"} is currently out of stock`,
        });
      }

      const quantity = Math.max(1, Number(item.qty || 1));
      if (!product.allowBackorder && Number(product.stock || 0) < quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} has only ${product.stock} stock left`,
        });
      }

      const price = Number(item.priceSnapshot || product.price || 0);
      const mrp = Number(item.mrpSnapshot || product.mrp || price);
      const gstPercent = Number(item.gstPercent || 18);

      const lineSubtotal = price * quantity;
      const gstAmount = (lineSubtotal * gstPercent) / 100;
      const lineTotal = lineSubtotal + gstAmount;

      products.push({
        productId: product._id,
        name: product.name || item.nameSnapshot || "",
        brand: product.brand || item.brandSnapshot || "Generic",
        sku: product.sku || item.skuSnapshot || "",
        mpn: product.mpn || item.mpnSnapshot || "",
        hsnCode: product.hsnCode || item.hsnCode || "",
        img:
          product.thumbnail ||
          product.images?.find((img) => img?.isPrimary)?.url ||
          product.images?.[0]?.url ||
          item.imageSnapshot ||
          "",
        slug: product.slug || item.slugSnapshot || "",
        category: product.category || "Other",

        quantity,
        price,
        mrp,
        gstPercent,
        lineSubtotal,
        gstAmount,
        lineTotal,

        itemStatus: "Order Placed",
        itemStatusHistory: [
          {
            status: "Order Placed",
            message: "Order created successfully",
            date: new Date(),
          },
        ],
      });
    }

    if (products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid products in cart",
      });
    }

    const subtotal = products.reduce(
      (sum, item) => sum + item.lineSubtotal,
      0
    );

    const tax = products.reduce(
      (sum, item) => sum + item.gstAmount,
      0
    );

    const shippingCharge =
      subtotal < 5000 ? 150 : 0;

    const totalAmount =
      subtotal +
      tax +
      shippingCharge;
    const itemCount = products.reduce((sum, item) => sum + item.quantity, 0);

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      userId: req.user._id,
      timeline: [
        {
          status: "Order Placed",
          message: "Order created successfully",
          time: new Date(),
        },
      ],

      userInfo: {
        name: buyer.fullName,
        phone: buyer.phone,
        alternatePhone: buyer.alternatePhone || "",
        email: buyer.email || user.email || "",
        companyName: buyer.companyName || "",
        gstNumber: buyer.gstNumber || "",

        addressLine1: shippingAddress.address,
        addressLine2: shippingAddress.addressLine2 || "",
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        country: shippingAddress.country || "India",
      },

      products,

      pricing: {
        subtotal,
        productDiscount: 0,
        couponDiscount: 0,
        shippingCharge,
        platformFee: 0,
        tax,
        totalAmount,
        itemCount,
      },

      payment: {
        method: mapPaymentMethod(paymentMethod),
        status: "Pending",
        paymentId: "",
      },

      shipment: {
        trackingId: "",
        courier: "",
        trackingUrl: "",
      },

      orderStatus: "Order Placed",
      note,
    });

    if (mapPaymentMethod(paymentMethod) === "COD") {

      for (const item of order.products) {

        const product = await Product.findById(item.productId);

        if (!product) continue;

        product.stock = Math.max(
          0,
          Number(product.stock || 0) -
          Number(item.quantity || 0)
        );

        await product.save({
          validateBeforeSave: false,
        });
      }

      cart.items = [];
      await cart.save();

      await sendOrderPlacedNotification(order);

      return res.status(201).json({
        success: true,
        message: "COD Order Placed Successfully",
        order: serializeOrder(order),
        orderId: order._id,
        orderNumber: order.orderNumber,
        totalAmount,
      });
    }

    // Razorpay Order Create
    if (mapPaymentMethod(paymentMethod) === "RAZORPAY") {
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: order.orderNumber,
      });

      order.payment.razorpayOrderId = razorpayOrder.id;

      await order.save();

      return res.status(201).json({
        success: true,
        order: serializeOrder(order),
        razorpayOrder,
      });
    }

    for (const item of order.products) {

      const product = await Product.findById(item.productId);

      if (!product) continue;

      product.stock = Math.max(
        0,
        Number(product.stock || 0) - Number(item.quantity || 0),
      );

      if (product.stock <= 0) {
        product.stockStatus = "out_of_stock";
        product.isOutOfStock = true;
      } else if (product.stock <= 5) {
        product.stockStatus = "low_stock";
        product.isOutOfStock = false;
      } else {
        product.stockStatus = "in_stock";
        product.isOutOfStock = false;
      }

      product.soldStock =
        Number(product.soldStock || 0) + Number(item.quantity || 0);

      await product.save({
        validateBeforeSave: false,
      });
    }

    cart.items = [];
    await cart.save();

    user.lastActivity = new Date();
    await user.save();

    setImmediate(async () => {
      try {
        await sendOrderPlacedNotification(order);
      } catch (err) {
        console.error("Notification failed:", err.message);
      }
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: serializeOrder(order),
      orderId: order._id,
      orderNumber: order.orderNumber,
      totalAmount,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Order create failed",
    });
  }
};

/* =====================================================
  MY ORDERS
  GET /api/orders/my-orders
===================================================== */
exports.getMyOrders = async (req, res) => {
  try {
    const { search, status } = req.query;

    const filter = {
      userId: req.user._id,
    };

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "products.name": { $regex: search, $options: "i" } },
        { "products.sku": { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      filter.orderStatus = status;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders: orders.map(serializeOrder),
    });
  } catch (error) {
    console.error("GET MY ORDERS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Orders fetch failed",
    });
  }
};

/* =====================================================
  TRACK ORDER
  GET /api/orders/track/:id
===================================================== */
exports.trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    return res.status(200).json({
      success: true,
      order: serializeOrder(order),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Invalid Order ID",
    });
  }
};

/* =====================================================
  GET SINGLE ORDER
  GET /api/orders/:id
===================================================== */
exports.getOrderById = async (req, res) => {
  try {
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

    return res.status(200).json({
      success: true,
      order: serializeOrder(order),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Invalid Order ID",
    });
  }
};

/* =====================================================
  ADMIN GET ALL ORDERS
  GET /api/orders/admin/all
===================================================== */
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 15, search = "", status = "" } = req.query;

    const query = {};

    if (status && status !== "All Status") {
      query.orderStatus = status;
    }

    const orders = await Order.find(query).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      orders: orders.map(serializeOrder),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Orders fetch failed",
    });
  }
};

/* =====================================================
  ADMIN UPDATE ORDER STATUS
  PUT /api/orders/admin/update-status
===================================================== */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, itemId, status, trackingId, courier, trackingUrl } =
      req.body;

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
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(orderId);

    const oldData =
      JSON.parse(
        JSON.stringify(order)
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (itemId) {
      const item = order.products.id(itemId);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Order item not found",
        });
      }

      item.itemStatus = status;

      item.itemStatusHistory.push({
        status,
        message: `Item status updated to ${status}`,
        date: new Date(),
      });

      const activeItems = order.products.filter(
        (p) => p.itemStatus !== "Cancelled",
      );

      if (
        activeItems.length > 0 &&
        activeItems.every((p) => p.itemStatus === "Delivered")
      ) {
        order.orderStatus = "Delivered";
      } else if (
        activeItems.length > 0 &&
        activeItems.every((p) => p.itemStatus === "Cancelled")
      ) {
        order.orderStatus = "Cancelled";
      } else {
        order.orderStatus = "Processing";
      }

      order.timeline.push({
        status,
        message: `${item.name} status changed to ${status}`,
        time: new Date(),
      });
    } else {
      order.orderStatus = status;

      order.timeline.push({
        status,
        message: `Order moved to ${status}`,
        time: new Date(),
      });
    }
    if (trackingId) order.shipment.trackingId = trackingId;
    if (courier) order.shipment.courier = courier;
    if (trackingUrl) order.shipment.trackingUrl = trackingUrl;

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

    await order.save();

    try {
      await sendOrderStatusNotification(
        order,
        status
      );
    } catch (err) {
      console.log(
        "Status Email Error:",
        err.message
      );
    }

    if (req.user?.role === "admin") {

      await logAdminActivity({
        req,
        admin: req.user,
        action: "UPDATE",
        module: "ORDER",
        targetId: order._id,
        details: {
          description:
            `Order status changed to ${status}`,
        },
      });

      await auditService({
        req,
        admin: req.user,
        module: "ORDER",
        action: "UPDATE_STATUS",
        targetId: order._id,
        oldData,
        newData: order.toObject(),
      });

      await securityAlertService({
        adminId: req.user._id,

        type: "SUSPICIOUS_LOGIN",

        title: "Order Status Changed",

        message:
          `${req.user.name} changed order ${order.orderNumber} status to ${status}`,

        ipAddress:
          req.headers["x-forwarded-for"] ||
          req.socket.remoteAddress,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      order: serializeOrder(order),
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
  CANCEL ORDER
  PUT /api/orders/cancel/:id
===================================================== */
exports.cancelOrder = async (req, res) => {
  try {
    const { reason = "", comment = "" } = req.body;

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

    if (
      ["Shipped", "Out for Delivery", "Delivered", "Cancelled"].includes(
        order.orderStatus,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled now",
      });
    }

    order.orderStatus = "Cancelled";
    order.timeline.push({
      status: "Cancelled",

      message: reason || "Order cancelled by user",

      time: new Date(),
    });
    order.cancellation.cancelReason = reason;
    order.cancellation.cancelComment = comment;
    order.cancellation.cancelledAt = new Date();

    if (
      order.payment.method === "RAZORPAY" &&
      order.payment.status === "Paid"
    ) {
      order.payment.status = "Refund Pending";
    }

    order.products.forEach((item) => {
      item.itemStatus = "Cancelled";
      item.itemStatusHistory.push({
        status: "Cancelled",
        message: reason || "Order cancelled by user",
        date: new Date(),
      });
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order: serializeOrder(order),
    });
  } catch (error) {
    console.error("CANCEL ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
  CANCEL SINGLE ORDER ITEM
  PUT /api/orders/cancel-item/:orderId/:itemId
===================================================== */
exports.cancelOrderItem = async (req, res) => {
  try {
    const { reason = "", comment = "" } = req.body;
    const { orderId, itemId } = req.params;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Cancellation reason is required",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      userId: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      ["Shipped", "Out for Delivery", "Delivered", "Cancelled"].includes(
        order.orderStatus,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "This order cannot be cancelled now",
      });
    }

    const item = order.products.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Order item not found",
      });
    }

    if (
      ["Shipped", "Out for Delivery", "Delivered", "Cancelled"].includes(
        item.itemStatus,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "This item cannot be cancelled now",
      });
    }

    item.itemStatus = "Cancelled";

    order.timeline.push({
      status: "Item Cancelled",

      message: `${item.name} cancelled`,

      time: new Date(),
    });

    item.itemStatusHistory.push({
      status: "Cancelled",
      message: reason,
      date: new Date(),
    });

    item.cancellation = {
      cancelReason: reason,
      cancelComment: comment,
      cancelledAt: new Date(),
    };

    const activeItems = order.products.filter(
      (product) => product.itemStatus !== "Cancelled",
    );

    if (activeItems.length === 0) {
      order.orderStatus = "Cancelled";
      order.cancellation.cancelReason = "All items cancelled";
      order.cancellation.cancelComment = comment;
      order.cancellation.cancelledAt = new Date();
    } else {
      order.orderStatus = "Processing";
    }

    order.pricing.subtotal = activeItems.reduce(
      (sum, item) => sum + Number(item.lineSubtotal || 0),
      0,
    );

    order.pricing.tax = activeItems.reduce(
      (sum, item) => sum + Number(item.gstAmount || 0),
      0,
    );

    order.pricing.totalAmount =
      order.pricing.subtotal +
      order.pricing.tax +
      Number(order.pricing.shippingCharge || 0) +
      Number(order.pricing.platformFee || 0);

    order.pricing.itemCount = activeItems.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0,
    );

    const product = await Product.findById(item.productId);

    if (product) {
      product.stock = Number(product.stock || 0) + Number(item.quantity || 0);

      if (product.stock <= 0) {
        product.stockStatus = "out_of_stock";
        product.isOutOfStock = true;
      } else if (product.stock <= 5) {
        product.stockStatus = "low_stock";
        product.isOutOfStock = false;
      } else {
        product.stockStatus = "in_stock";
        product.isOutOfStock = false;
      }

      await product.save({
        validateBeforeSave: false,
      });
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Item cancelled successfully",
      order: serializeOrder(order),
    });
  } catch (error) {
    console.error("CANCEL ORDER ITEM ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Item cancellation failed",
    });
  }
};

/* =====================================================
  UPDATE ORDER ADDRESS
  PUT /api/orders/update-address/:id
===================================================== */
exports.updateOrderAddress = async (req, res) => {
  try {
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

    if (
      !order.canEditAddress ||
      ["Shipped", "Out for Delivery", "Delivered", "Cancelled"].includes(
        order.orderStatus,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Address cannot be changed now",
      });
    }

    const {
      name,
      phone,
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

    if (name) order.userInfo.name = name;
    if (phone) order.userInfo.phone = phone;
    if (email) order.userInfo.email = email;
    if (companyName) order.userInfo.companyName = companyName;
    if (gstNumber) order.userInfo.gstNumber = gstNumber;
    if (addressLine1) order.userInfo.addressLine1 = addressLine1;
    if (addressLine2) order.userInfo.addressLine2 = addressLine2;
    if (city) order.userInfo.city = city;
    if (state) order.userInfo.state = state;
    if (pincode) order.userInfo.pincode = pincode;
    if (country) order.userInfo.country = country;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Address updated",
      order: serializeOrder(order),
    });
  } catch (error) {
    console.error("UPDATE ADDRESS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
  UPDATE ORDER PHONE
  PUT /api/orders/update-phone/:id
===================================================== */
exports.updateOrderPhone = async (req, res) => {
  try {
    const { name, phone, alternatePhone } = req.body;

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

    if (
      !order.canEditPhone ||
      ["Shipped", "Out for Delivery", "Delivered", "Cancelled"].includes(
        order.orderStatus,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Phone cannot be changed now",
      });
    }

    if (name) order.userInfo.name = name;
    if (phone) order.userInfo.phone = phone;
    if (alternatePhone) order.userInfo.alternatePhone = alternatePhone;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Phone updated successfully",
      order: serializeOrder(order),
    });
  } catch (error) {
    console.error("UPDATE PHONE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
  UPDATE PAYMENT
  PUT /api/orders/update-payment/:id
===================================================== */
exports.updatePayment = async (req, res) => {
  try {
    const { paymentMethod, paymentStatus, paymentId } = req.body;

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

    if (["Delivered", "Cancelled"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Payment cannot be changed for this order",
      });
    }

    if (paymentMethod) order.payment.method = mapPaymentMethod(paymentMethod);
    if (paymentStatus) order.payment.status = paymentStatus;

    if (paymentStatus === "Paid") {
      order.payment.amountPaid = order.pricing?.totalAmount || 0;
    }
    if (paymentId) order.payment.paymentId = paymentId;

    order.payment.paymentChanged = true;
    order.payment.paymentChangedAt = new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      order: serializeOrder(order),
    });
  } catch (error) {
    console.error("UPDATE PAYMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
CUSTOMER REQUEST REFUND
POST /api/orders/refund/:id
===================================================== */
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

    if (
      order.orderStatus !== "Cancelled" &&
      order?.returnRequest?.status !== "Refund Eligible"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Refund can be requested only after delivered or cancelled order",
      });
    }

    if (
      order.refund?.status &&
      ["Requested", "Approved", "Processing", "Refunded"].includes(
        order.refund.status,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Refund request already exists for this order",
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

    order.refund.status = "Requested";
    order.refund.amount = refundAmount;
    order.refund.reason = reason;
    order.refund.comment = comment;
    order.refund.method = method;

    order.refund.upi = {
      upiId: upi.upiId || "",
      phone: upi.phone || "",
    };

    order.refund.bank = {
      accountHolderName: bank.accountHolderName || "",
      accountNumber: bank.accountNumber || "",
      ifsc: bank.ifsc || "",
      bankName: bank.bankName || "",
    };

    order.refund.card = {
      last4: card.last4 || "",
      transactionId: card.transactionId || "",
    };

    order.refund.requestedAt = new Date();

    order.refund.history.push({
      status: "Requested",
      message: "Refund request submitted by customer",
      date: new Date(),
    });

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

/* =====================================================
  ADMIN UPDATE REFUND
  PUT /api/orders/admin/refund/:id
===================================================== */


exports.adminUpdateRefund = async (req, res) => {
  try {
    const { status, adminNote = "", refundReferenceId = "", amount } = req.body;

    const allowedStatuses = ["Approved", "Rejected", "Processing", "Refunded"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid refund status",
      });
    }

    const order = await Order.findById(req.params.id);

    const oldData =
      JSON.parse(
        JSON.stringify(order)
      );

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

    order.refund.admin.note = adminNote;
    order.refund.admin.processedBy = req.user?._id || null;
    order.refund.admin.refundReferenceId = refundReferenceId;

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

    try {
      await sendOrderStatusNotification(
        order,
        `Refund ${status}`
      );
    } catch (err) {
      console.log(
        "Refund Email Error:",
        err.message
      );
    }

    await logAdminActivity({
      req,
      admin: req.user,
      action: "UPDATE",
      module: "REFUND",
      targetId: order._id,
      details: {
        description:
          `Refund changed to ${status}`,
      },
    });

    await auditService({
      req,
      admin: req.user,
      module: "REFUND",
      action: "UPDATE",
      targetId: order._id,
      oldData,
      newData: order.toObject(),
    });

    await securityAlertService({
      adminId: req.user._id,

      type: "SUSPICIOUS_LOGIN",

      title: "Refund Updated",

      message:
        `${req.user.name} changed refund status to ${status}`,

      ipAddress:
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress,
    });

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

/* =====================================================
  CUSTOMER SUBMIT PAYMENT PROOF
  POST /api/orders/payment-proof/:id
===================================================== */
exports.downloadOrderPdf = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    const { itemId } = req.query;

    let pdfProducts = order.products;

    if (itemId) {
      const selectedItem = order.products.id(itemId);

      if (selectedItem) {
        pdfProducts = [selectedItem];
      }
    }

    const pdfSubtotal = pdfProducts.reduce(
      (sum, item) => sum + Number(item.lineSubtotal || 0),
      0,
    );

    const pdfTax = pdfProducts.reduce(
      (sum, item) => sum + Number(item.gstAmount || 0),
      0,
    );

    const pdfTotal =
      pdfSubtotal + pdfTax + Number(order.pricing?.shippingCharge || 0);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
    });

    const filename = `Order-${order.orderNumber}.pdf`;

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    doc.pipe(res);

    // ======================================================
    // COLORS
    // ======================================================

    const primary = "#2454b5";
    const green = "#16a34a";
    const dark = "#0f172a";
    const gray = "#64748b";
    const border = "#dbe7f3";

    const pageWidth = doc.page.width;

    // ======================================================
    // BACKGROUND
    // ======================================================

    doc.rect(0, 0, pageWidth, doc.page.height).fill("#f4f8fc");

    // ======================================================
    // HEADER
    // ======================================================

    doc.roundedRect(35, 30, 525, 110, 18).fill(primary);

    doc
      .fillColor("white")
      .font("Helvetica-Bold")
      .fontSize(28)
      .text("Royal Trading Component", 55, 60);

    doc
      .fillColor("#dbeafe")
      .font("Helvetica")
      .fontSize(12)
      .text("Professional Order Invoice", 55, 98);

    doc
      .fillColor("white")
      .font("Helvetica-Bold")
      .fontSize(13)
      .text(`Invoice #${order.orderNumber}`, 390, 70);

    let y = 170;

    // ======================================================
    // SECTION TITLE
    // ======================================================

    const sectionTitle = (title) => {
      doc
        .fillColor(dark)
        .font("Helvetica-Bold")
        .fontSize(20)
        .text(title, 40, y);

      y += 35;
    };

    // ======================================================
    // CARD
    // ======================================================

    const card = (x, yy, w, h) => {
      doc.roundedRect(x, yy, w, h, 14).fillAndStroke("white", border);
    };

    // ======================================================
    // ORDER DETAILS
    // ======================================================

    sectionTitle("Order Details");

    card(40, y, 520, 120);

    doc
      .fillColor(gray)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("ORDER NUMBER", 60, y + 18);

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(16)
      .text(order.orderNumber, 60, y + 35);

    doc
      .fillColor(gray)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("ORDER DATE", 320, y + 18);

    doc
      .fillColor(dark)
      .font("Helvetica")
      .fontSize(13)
      .text(new Date(order.createdAt).toLocaleString("en-IN"), 320, y + 35);

    doc
      .fillColor(gray)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("PAYMENT STATUS", 60, y + 72);

    doc
      .fillColor(green)
      .font("Helvetica-Bold")
      .fontSize(14)
      .text(order.payment?.status || "-", 60, y + 88);

    doc
      .fillColor(gray)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("ORDER STATUS", 320, y + 72);

    doc
      .fillColor(primary)
      .font("Helvetica-Bold")
      .fontSize(14)
      .text(order.orderStatus || "-", 320, y + 88);

    y += 145;

    // ======================================================
    // CUSTOMER DETAILS
    // ======================================================

    sectionTitle("Customer Details");

    card(40, y, 520, 160);

    doc
      .fillColor(gray)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("CUSTOMER NAME", 60, y + 18);

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(18)
      .text(order.userInfo?.name || "-", 60, y + 35);

    doc
      .fillColor(gray)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("PHONE NUMBER", 60, y + 75);

    doc
      .fillColor(dark)
      .font("Helvetica")
      .fontSize(13)
      .text(order.userInfo?.phone || "-", 60, y + 92);

    doc
      .fillColor(gray)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("EMAIL ADDRESS", 310, y + 75);

    doc
      .fillColor(dark)
      .font("Helvetica")
      .fontSize(13)
      .text(order.userInfo?.email || "-", 310, y + 92);

    doc
      .fillColor(gray)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("SHIPPING ADDRESS", 60, y + 125);

    doc
      .fillColor(dark)
      .font("Helvetica")
      .fontSize(12)
      .text(
        `${order.userInfo?.addressLine1 || ""}, ${order.userInfo?.city || ""
        }, ${order.userInfo?.state || ""} - ${order.userInfo?.pincode || ""}`,
        60,
        y + 140,
        {
          width: 450,
        },
      );

    y += 195;

    // ======================================================
    // PRODUCTS
    // ======================================================

    sectionTitle("Products");

    // TABLE HEADER

    doc.roundedRect(40, y, 520, 35, 10).fill(primary);

    doc.fillColor("white").font("Helvetica-Bold").fontSize(11);

    doc.text("PRODUCT", 55, y + 11);
    doc.text("QTY", 305, y + 11);
    doc.text("PRICE", 360, y + 11);
    doc.text("GST", 430, y + 11);
    doc.text("TOTAL", 485, y + 11);

    y += 45;

    pdfProducts.forEach((item) => {
      card(40, y, 520, 75);

      doc
        .fillColor(dark)
        .font("Helvetica-Bold")
        .fontSize(13)
        .text(item.name || "-", 55, y + 16);

      doc
        .fillColor(gray)
        .font("Helvetica")
        .fontSize(10)
        .text(`SKU: ${item.sku || "-"}`, 55, y + 38);

      doc
        .fillColor(dark)
        .font("Helvetica-Bold")
        .fontSize(12)
        .text(String(item.quantity), 310, y + 28);

      doc.text(`Rs.  ${item.price}`, 355, y + 28);

      doc.text(`Rs.  ${item.gstAmount}`, 425, y + 28);

      doc.fillColor(primary).text(`Rs.  ${item.lineTotal}`, 485, y + 28);

      y += 88;
    });

    // ======================================================
    // PAYMENT SUMMARY
    // ======================================================

    // PAGE BREAK FIX
    if (y > 560) {
      doc.addPage({
        size: "A4",
        margin: 0,
      });

      doc.rect(0, 0, pageWidth, doc.page.height).fill("#f4f8fc");

      y = 60;
    }

    sectionTitle("Payment Summary");

    // SUMMARY CARD
    doc.roundedRect(40, y, 520, 165, 18).fillAndStroke("white", border);

    // ROW 1
    doc
      .fillColor(gray)
      .font("Helvetica")
      .fontSize(13)
      .text("Subtotal", 65, y + 28);

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(16)
      .text(`Rs.  ${pdfSubtotal || 0}`, 460, y + 28);

    // LINE
    doc
      .moveTo(60, y + 58)
      .lineTo(540, y + 58)
      .strokeColor("#e2e8f0")
      .lineWidth(1)
      .stroke();

    // ROW 2
    doc
      .fillColor(gray)
      .font("Helvetica")
      .fontSize(13)
      .text("GST / Tax", 65, y + 75);

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(16)
      .text(`Rs.  ${pdfTax || 0}`, 460, y + 75);

    // LINE
    doc
      .moveTo(60, y + 105)
      .lineTo(540, y + 105)
      .strokeColor("#e2e8f0")
      .lineWidth(1)
      .stroke();

    // ROW 3
    doc
      .fillColor(gray)
      .font("Helvetica")
      .fontSize(13)
      .text("Shipping", 65, y + 122);

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(16)
      .text(`Rs.  ${order.pricing?.shippingCharge || 0}`, 460, y + 122);

    // GRAND TOTAL BOX
    doc.roundedRect(55, y + 185, 490, 48, 12).fill(green);

    doc
      .fillColor("white")
      .font("Helvetica-Bold")
      .fontSize(18)
      .text("Grand Total", 80, y + 201);

    doc.text(`Rs.  ${pdfTotal || 0}`, 430, y + 201);

    y += 260;

    // ======================================================
    // FOOTER
    // ======================================================

    doc
      .fillColor("#94a3b8")
      .font("Helvetica")
      .fontSize(10)
      .text("Thank you for choosing Royal Trading Component", 0, 800, {
        align: "center",
      });

    doc.end();
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "PDF generation failed",
    });
  }
};

exports.getOrdersCalendar = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const deliveredOrders = await Order.countDocuments({
      orderStatus: "Delivered",
    });

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const todayOrders = await Order.countDocuments({
      createdAt: {
        $gte: today,
      },
    });

    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$pricing.totalAmount",
          },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    res.json({
      success: true,

      stats: {
        totalOrders,

        deliveredOrders,

        todayOrders,

        totalRevenue,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Orders calendar failed",
    });
  }
};

exports.getRevenueAnalytics = async (req, res) => {
  try {
    // TOTAL REVENUE
    const totalRevenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$pricing.totalAmount",
          },
        },
      },
    ]);

    // MONTHLY REVENUE
    const monthlyRevenue = await Order.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },
          revenue: {
            $sum: "$pricing.totalAmount",
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    // ORDER STATUS ANALYTICS
    const orderAnalytics = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          total: {
            $sum: 1,
          },
        },
      },
    ]);

    // PAYMENT ANALYTICS
    const paymentAnalytics = await Order.aggregate([
      {
        $group: {
          _id: "$payment.status",
          total: {
            $sum: 1,
          },
        },
      },
    ]);

    // CATEGORY REVENUE
    const categoryRevenue = await Order.aggregate([
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: "$products.category",
          revenue: {
            $sum: {
              $multiply: ["$products.price", "$products.quantity"],
            },
          },
        },
      },
    ]);

    // TOP PRODUCTS
    const topProducts = await Order.aggregate([
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: "$products.name",
          qty: {
            $sum: "$products.quantity",
          },
        },
      },
      {
        $sort: {
          qty: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    // GST SUMMARY
    const gstSummary = await Order.aggregate([
      {
        $group: {
          _id: null,
          gst: {
            $sum: "$pricing.tax",
          },
        },
      },
    ]);

    // REFUND ANALYTICS
    const refundAnalytics = await Order.aggregate([
      {
        $match: {
          orderStatus: "Cancelled",
        },
      },
      {
        $group: {
          _id: null,
          refund: {
            $sum: "$pricing.totalAmount",
          },
        },
      },
    ]);

    // YEARLY REVENUE
    const currentYear = new Date().getFullYear();

    const yearlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$pricing.totalAmount",
          },
        },
      },
    ]);

    return res.json({
      success: true,

      analytics: {
        deliveredRevenue: await Order.aggregate([
          {
            $match: {
              orderStatus: "Delivered",
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$pricing.totalAmount",
              },
            },
          },
        ]).then((r) => r[0]?.total || 0),

        processingRevenue: await Order.aggregate([
          {
            $match: {
              orderStatus: "Processing",
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$pricing.totalAmount",
              },
            },
          },
        ]).then((r) => r[0]?.total || 0),

        cancelledRevenue: await Order.aggregate([
          {
            $match: {
              orderStatus: "Cancelled",
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$pricing.totalAmount",
              },
            },
          },
        ]).then((r) => r[0]?.total || 0),

        currentMonthRevenue: await Order.aggregate([
          {
            $match: {
              createdAt: {
                $gte: new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  1,
                ),
              },
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$pricing.totalAmount",
              },
            },
          },
        ]).then((r) => r[0]?.total || 0),

        totalRevenue: totalRevenueResult[0]?.total || 0,

        monthlyRevenue,

        orderAnalytics,

        paymentAnalytics,

        categoryRevenue,

        topProducts,

        gstSummary: gstSummary[0]?.gst || 0,

        refundAnalytics: refundAnalytics[0]?.refund || 0,

        yearlyRevenue: yearlyRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: "Revenue analytics failed",
    });
  }
};

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Razorpay order creation failed",
    });
  }
};

exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    console.log("VERIFY BODY =>", req.body);
    console.log("USER =>", req.user?._id);
    console.log("ORDER ID RECEIVED =>", orderId);


    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        razorpay_order_id +
        "|" +
        razorpay_payment_id
      )
      .digest("hex");

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      userId: req.user._id,
    });

    console.log("FOUND ORDER =>", order);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.payment.status === "Paid") {
      return res.json({
        success: true,
        message: "Payment already verified",
      });
    }


    order.payment.status = "Paid";
    order.payment.razorpayOrderId =
      razorpay_order_id;

    order.payment.razorpayPaymentId =
      razorpay_payment_id;

    order.payment.razorpaySignature =
      razorpay_signature;

    order.payment.method = "RAZORPAY";

    order.payment.paymentId =
      razorpay_payment_id;

    order.payment.transactionId =
      razorpay_payment_id;

    order.payment.amountPaid =
      order.pricing.totalAmount;

    order.payment.paidAt =
      new Date();

    // STOCK UPDATE
    for (const item of order.products) {
      const product = await Product.findById(item.productId);

      if (!product) continue;

      product.stock = Math.max(
        0,
        Number(product.stock || 0) -
        Number(item.quantity || 0)
      );

      product.soldStock =
        Number(product.soldStock || 0) +
        Number(item.quantity || 0);

      if (product.stock <= 0) {
        product.stockStatus = "out_of_stock";
        product.isOutOfStock = true;
      } else if (product.stock <= 5) {
        product.stockStatus = "low_stock";
        product.isOutOfStock = false;
      } else {
        product.stockStatus = "in_stock";
        product.isOutOfStock = false;
      }

      await product.save({
        validateBeforeSave: false,
      });
    }

    // CLEAR CART
    const cart = await Cart.findOne({
      user: order.userId,
    });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    await order.save();

    return res.json({
      success: true,
      message: "Payment successful",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};

const numberToWords = (num) => {
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (num < 20) return a[num];

  if (num < 100)
    return b[Math.floor(num / 10)] + " " + a[num % 10];

  if (num < 1000)
    return (
      a[Math.floor(num / 100)] +
      " Hundred " +
      numberToWords(num % 100)
    );

  if (num < 100000)
    return (
      numberToWords(Math.floor(num / 1000)) +
      " Thousand " +
      numberToWords(num % 1000)
    );

  if (num < 10000000)
    return (
      numberToWords(Math.floor(num / 100000)) +
      " Lakh " +
      numberToWords(num % 100000)
    );

  return "";
};

exports.downloadTaxInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const COMPANY = {
      name: "Royal Trading Co",
      address: "6/280 Dakshinpuri Ambedkar Nagar Sector-5",
      gst: "07BFNPR5556M1ZK",
      state: "Delhi",
      stateCode: "07",
      bankName: "ICICI Bank",
      accountNo: "629205501369",
      ifsc: "ICIC0003358",
    };

    const doc = new PDFDocument({
      size: "A4",
      margin: 20,
    });

    const filename = `Tax-Invoice-${order.orderNumber}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    doc.pipe(res);

    const total = Number(order.pricing?.totalAmount || 0);
    const taxable = Number(order.pricing?.subtotal || 0);
    const gst = Number(order.pricing?.tax || 0);

    const PRIMARY = "#2454b5";

    // =====================================
    // HEADER
    // =====================================

    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .fillColor(PRIMARY)
      .text("TAX INVOICE", 0, 25, {
        align: "center",
      });



    // =====================================
    // SELLER BOX
    // =====================================

    doc.rect(30, 80, 260, 150).stroke();

    doc
      .fillColor("black")
      .font("Helvetica-Bold")
      .fontSize(15)
      .text(COMPANY.name, 40, 95);

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(COMPANY.address, 40, 120, {
        width: 220,
      });

    doc.text(`GSTIN : ${COMPANY.gst}`, 40, 160);
    doc.text(`State : ${COMPANY.state}`, 40, 180);
    doc.text(`State Code : ${COMPANY.stateCode}`, 40, 200);

    // =====================================
    // INVOICE BOX
    // =====================================

    doc.rect(290, 80, 275, 150).stroke();

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(
        `Invoice No : ${order.invoiceNumber || order.orderNumber
        }`,
        305,
        100
      );

    doc.text(
      `Date : ${new Date(
        order.createdAt
      ).toLocaleDateString("en-IN")}`,
      305,
      125
    );

    doc.text(
      `Payment Status : ${order.payment?.status || "-"
      }`,
      305,
      150
    );

    doc.text(
      `Order Status : ${order.orderStatus || "-"
      }`,
      305,
      175
    );

    // =====================================
    // BUYER BOX
    // =====================================

    doc.rect(30, 250, 535, 110).stroke();

    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .text("BUYER DETAILS", 40, 265);

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(order.userInfo?.name || "", 40, 290);

    doc.text(
      order.userInfo?.companyName || "",
      40,
      308
    );

    doc.text(
      order.userInfo?.addressLine1 || "",
      40,
      326
    );

    doc.text(
      `${order.userInfo?.city || ""}, ${order.userInfo?.state || ""
      } - ${order.userInfo?.pincode || ""}`,
      40,
      344
    );

    doc.text(
      `GST : ${order.userInfo?.gstNumber || "-"
      }`,
      320,
      290
    );

    // =====================================
    // TABLE HEADER
    // =====================================

    let tableY = 390;

    doc.rect(30, tableY, 535, 30).stroke();

    doc.moveTo(70, tableY).lineTo(70, tableY + 30).stroke();
    doc.moveTo(300, tableY).lineTo(300, tableY + 30).stroke();
    doc.moveTo(360, tableY).lineTo(360, tableY + 30).stroke();
    doc.moveTo(420, tableY).lineTo(420, tableY + 30).stroke();
    doc.moveTo(490, tableY).lineTo(490, tableY + 30).stroke();

    doc.font("Helvetica-Bold");

    doc.text("No", 40, tableY + 8);
    doc.text("Description", 90, tableY + 8);
    doc.text("HSN", 315, tableY + 8);
    doc.text("Qty", 375, tableY + 8);
    doc.text("Rate", 435, tableY + 8);
    doc.text("Amount", 500, tableY + 8);

    // =====================================
    // PRODUCTS
    // =====================================

    let rowY = tableY + 30;

    order.products.forEach((item, index) => {
      doc.rect(30, rowY, 535, 35).stroke();

      doc.moveTo(70, rowY).lineTo(70, rowY + 35).stroke();
      doc.moveTo(300, rowY).lineTo(300, rowY + 35).stroke();
      doc.moveTo(360, rowY).lineTo(360, rowY + 35).stroke();
      doc.moveTo(420, rowY).lineTo(420, rowY + 35).stroke();
      doc.moveTo(490, rowY).lineTo(490, rowY + 35).stroke();

      doc.font("Helvetica");

      doc.text(String(index + 1), 40, rowY + 10);

      doc.text(
        item.name || "",
        80,
        rowY + 10,
        {
          width: 210,
        }
      );

      doc.text(
        item.hsnCode || "8504",
        315,
        rowY + 10
      );

      doc.text(
        String(item.quantity || 0),
        375,
        rowY + 10
      );

      doc.text(
        Number(item.price || 0).toFixed(2),
        430,
        rowY + 10
      );

      doc.text(
        Number(item.lineSubtotal || 0).toFixed(2),
        495,
        rowY + 10
      );

      rowY += 35;
    });

    // =====================================
    // GST SUMMARY
    // =====================================

    doc.rect(330, rowY + 20, 235, 90).stroke();

    doc.font("Helvetica");

    doc.text(
      `Taxable Value : ${taxable.toFixed(2)}`,
      340,
      rowY + 35
    );

    doc.text(
      `IGST (18%) : ${gst.toFixed(2)}`,
      340,
      rowY + 58
    );

    doc
      .font("Helvetica-Bold")
      .text(
        `Grand Total : ${total.toFixed(2)}`,
        340,
        rowY + 81
      );

    // =====================================
    // AMOUNT IN WORDS
    // =====================================

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(
        `Amount In Words : INR ${numberToWords(
          Math.floor(total)
        )} Only`,
        30,
        rowY + 140
      );

    // =====================================
    // BANK DETAILS BOX
    // =====================================

    doc.rect(30, rowY + 175, 260, 90).stroke();

    doc
      .font("Helvetica-Bold")
      .text(
        "Bank Details",
        40,
        rowY + 190
      );

    doc
      .font("Helvetica")
      .text(
        `Bank : ${COMPANY.bankName}`,
        40,
        rowY + 212
      );

    doc.text(
      `Account No : ${COMPANY.accountNo}`,
      40,
      rowY + 230
    );

    doc.text(
      `IFSC : ${COMPANY.ifsc}`,
      40,
      rowY + 248
    );

    // =====================================
    // SIGNATURE BOX
    // =====================================

    doc.rect(305, rowY + 175, 260, 90).stroke();

    doc
      .font("Helvetica-Bold")
      .text(
        "Authorised Signatory",
        380,
        rowY + 245
      );

    // =====================================
    // FOOTER
    // =====================================

    doc
      .fontSize(9)
      .font("Helvetica")
      .text(
        "This is a computer generated invoice",
        0,
        790,
        {
          align: "center",
        }
      );

    doc.end();
  } catch (error) {
    console.log("Tax Invoice Error:", error);

    return res.status(500).json({
      success: false,
      message: "Invoice generation failed",
    });
  }
};

const EXCHANGE_ACTIVE_STATUSES = [
  "Requested",
  "Approved",
  "Pickup Scheduled",
  "Picked Up",
  "Quality Checking",
  "Replacement Packed",
  "Replacement Shipped",
  "Out for Delivery",
];

const EXCHANGE_ADMIN_STATUSES = [
  "Approved",
  "Rejected",
  "Pickup Scheduled",
  "Picked Up",
  "Quality Checking",
  "Replacement Packed",
  "Replacement Shipped",
  "Out for Delivery",
  "Completed",
];


const stampExchangeDate = (exchange, status) => {
  const fieldMap = {
    Approved: "approvedAt",
    Rejected: "rejectedAt",
    "Pickup Scheduled": "pickupScheduledAt",
    "Picked Up": "pickedUpAt",
    "Quality Checking": "qualityCheckedAt",
    "Replacement Packed": "replacementPackedAt",
    "Replacement Shipped": "replacementShippedAt",
    "Out for Delivery": "outForDeliveryAt",
    Completed: "completedAt",
  };

  if (fieldMap[status]) {
    exchange[fieldMap[status]] = new Date();
  }
};

const makePickupAddress = (order, payload = {}) => ({
  name: payload.name || order.userInfo?.name || "",
  phone: payload.phone || order.userInfo?.phone || "",
  addressLine1: payload.addressLine1 || order.userInfo?.addressLine1 || "",
  addressLine2: payload.addressLine2 || order.userInfo?.addressLine2 || "",
  city: payload.city || order.userInfo?.city || "",
  state: payload.state || order.userInfo?.state || "",
  pincode: payload.pincode || order.userInfo?.pincode || "",
  country: payload.country || order.userInfo?.country || "India",
});


exports.requestExchange = async (req, res) => {
  try {
    const {
      itemId,
      reasonId,
      reasonTitle,
      reason,
      subReason,
      description = "",
      comment = "",
      pickupAddress = {},
    } = req.body;

    const finalReasonTitle = reasonTitle || reason || "";

    if (!finalReasonTitle) {
      return res.status(400).json({
        success: false,
        message: "Exchange reason is required",
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

    if (order.orderStatus !== "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Exchange allowed only for delivered orders",
      });
    }

    if (itemId && !order.products.id(itemId)) {
      return res.status(404).json({
        success: false,
        message: "Order item not found",
      });
    }

    if (EXCHANGE_ACTIVE_STATUSES.includes(order.exchange?.status)) {
      return res.status(400).json({
        success: false,
        message: "Exchange request already exists",
      });
    }

    const photos =
      req.files?.photos?.map(getUploadUrl) || [];

    const videos =
      req.files?.videos?.map(getUploadUrl) || [];

    const parsedPickupAddress =
      typeof pickupAddress === "string"
        ? JSON.parse(pickupAddress || "{}")
        : pickupAddress;

    order.exchange = {
      ...(order.exchange || {}),
      status: "Requested",
      itemId: itemId || null,
      reasonId: reasonId || null,
      reasonTitle: finalReasonTitle,
      subReason: subReason || "",
      description: description || comment || "",
      comment: comment || description || "",
      pickupAddress: makePickupAddress(order, parsedPickupAddress),
      evidence: {
        photos,
        videos,
      },
      requestedAt: new Date(),
      history: [
        ...(order.exchange?.history || []),
        {
          status: "Requested",
          message: `Customer requested exchange: ${finalReasonTitle}`,
          by: "Customer",
          date: new Date(),
        },
      ],
    };

    order.timeline.push({
      status: "Exchange Requested",
      message: finalReasonTitle,
      time: new Date(),
    });
    await order.save();

    return res.json({
      success: true,
      message: "Exchange request submitted successfully",
      order: serializeOrder(order),
    });
  } catch (err) {
    console.log("EXCHANGE REQUEST ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


exports.getAllExchangeRequests = async (req, res) => {
  try {
    const { search = "", status = "" } = req.query;

    const filter = {
      "exchange.status": {
        $ne: "Not Requested",
      },
    };

    if (status && status !== "ALL") {
      filter["exchange.status"] = status;
    }

    if (search) {
      filter.$or = [
        {
          orderNumber: {
            $regex: search,
            $options: "i",
          },
        },
        {
          "userInfo.name": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "userInfo.phone": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "exchange.reasonTitle": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "products.name": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const orders = await Order.find(filter).sort({
      "exchange.requestedAt": -1,
    });

    return res.json({
      success: true,
      total: orders.length,
      requests: orders.map(serializeOrder),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getExchangeRequestDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      order: serializeOrder(order),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getExchangeRequestDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      order: serializeOrder(order),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.adminUpdateExchange = async (req, res) => {
  try {
    const {
      status,
      adminNote = "",
      replacementSku = "",
      replacementProductName = "",
      pickupShipment = {},
      replacementShipment = {},
    } = req.body;

    if (!EXCHANGE_ADMIN_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exchange status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const oldData = JSON.parse(JSON.stringify(order));

    order.exchange.status = status;

    order.exchange.adminReview = {
      reviewNote: adminNote,
      reviewedBy: req.user?._id || null,
      reviewedAt: new Date(),
    };

    if (replacementSku) {
      order.exchange.replacementSku = replacementSku;
    }

    if (replacementProductName) {
      order.exchange.replacementProductName = replacementProductName;
    }

    order.exchange.pickupShipment = {
      ...(order.exchange.pickupShipment || {}),
      ...pickupShipment,
    };

    order.exchange.replacementShipment = {
      ...(order.exchange.replacementShipment || {}),
      ...replacementShipment,
    };

    stampExchangeDate(order.exchange, status);

    order.exchange.history.push({
      status,
      message: adminNote || `Exchange moved to ${status}`,
      by: "Admin",
      date: new Date(),
    });

    order.timeline.push({
      status: `Exchange ${status}`,
      message: adminNote || `Exchange status changed to ${status}`,
      time: new Date(),
    });

    await order.save();

    try {
      await logAdminActivity({
        req,
        admin: req.user,
        action: "UPDATE",
        module: "EXCHANGE",
        targetId: order._id,
        details: {
          description: `Exchange changed to ${status}`,
        },
      });
    } catch (err) {
      console.log("Activity Log Error:", err.message);
    }

    try {
      await auditService({
        req,
        admin: req.user,
        module: "EXCHANGE",
        action: "UPDATE",
        targetId: order._id,
        oldData,
        newData: order.toObject(),
      });
    } catch (err) {
      console.log("Audit Error:", err.message);
    }

    return res.json({
      success: true,
      message: "Exchange updated successfully",
      order: serializeOrder(order),
    });
  } catch (err) {
    console.log("ADMIN EXCHANGE UPDATE ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



exports.requestReturn = async (req, res) => {
  try {
    const {
      itemId,
      reasonId,
      reasonTitle,
      reason,
      subReason,
      description = "",
      comment = "",
    } = req.body;

    const finalReasonTitle = reasonTitle || reason || "";
    const finalDescription = String(description || comment || "").trim();
    const refundData = parseJsonBodyField(req.body.refundData, {});
    const refundMethod = String(refundData.refundMethod || "").toUpperCase();

    if (!finalReasonTitle) {
      return res.status(400).json({
        success: false,
        message: "Return reason is required",
      });
    }

    if (!subReason) {
      return res.status(400).json({
        success: false,
        message: "Return issue is required",
      });
    }

    if (finalDescription.length < 15) {
      return res.status(400).json({
        success: false,
        message: "Please describe the issue in at least 15 characters",
      });
    }

    if (!["BANK", "WALLET"].includes(refundMethod)) {
      return res.status(400).json({
        success: false,
        message: "Refund method is required",
      });
    }

    if (refundMethod === "BANK") {
      const bankError = validateBankRefund(refundData);

      if (bankError) {
        return res.status(400).json({
          success: false,
          message: bankError,
        });
      }
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

    if (order.orderStatus !== "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Return allowed only for delivered orders",
      });
    }

    const item = itemId ? order.products.id(itemId) : order.products[0];

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Order item not found",
      });
    }

    if (RETURN_ACTIVE_STATUSES.includes(order.returnRequest?.status)) {
      return res.status(400).json({
        success: false,
        message: "Return request already exists",
      });
    }

    const photos =
      req.files?.photos?.map(getUploadUrl) || [];

    const videos =
      req.files?.videos?.map(getUploadUrl) || [];

    if (!photos.length) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one product image",
      });
    }

    const now = new Date();

    order.returnRequest = {
      ...(order.returnRequest || {}),
      status: "Requested",
      itemId: item._id,
      reasonId: reasonId || null,
      reasonTitle: finalReasonTitle,
      subReason: subReason || "",
      description: finalDescription,
      comment: finalDescription,
      evidence: {
        photos,
        videos,
      },
      refundPreference: {
        method: refundMethod,
        accountHolder: refundData.accountHolder || "",
        bankName: refundData.bankName || "",
        accountNumber: refundData.accountNumber || "",
        ifsc: String(refundData.ifsc || "").toUpperCase(),
        upi: refundData.upi || "",
        walletStatus: refundMethod === "WALLET" ? "Selected" : "",
        walletValidityMonths: refundMethod === "WALLET" ? 12 : 0,
      },
      requestedAt: now,
      updatedAt: now,
      adminRemark: "",
      customerMessage: "",
      invalidFields: [],
      history: [
        ...(order.returnRequest?.history || []),
        {
          status: "Requested",
          message: `Customer requested return: ${finalReasonTitle}`,
          by: "Customer",
          date: now,
        },
      ],
    };

    order.timeline.push({
      status: "Return Requested",
      message: `Return requested for ${item.name}: ${finalReasonTitle}`,
      time: now,
    });

    await order.save();

    try {
      await sendOrderStatusNotification(order, "Return Requested");
    } catch (err) {
      console.log("Return Email Error:", err.message);
    }

    return res.json({
      success: true,
      message: "Return request submitted successfully",
      order: serializeOrder(order),
    });
  } catch (err) {
    console.log("RETURN REQUEST ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const RETURN_ACTIVE_STATUSES = [
  "Requested",
  "Approved",
  "Pickup Scheduled",
  "Picked Up",
  "Quality Checking",
  "Refund Approved",
];

const RETURN_ADMIN_STATUSES = [
  "Requested",
  "Approved",
  "Rejected",
  "Pickup Scheduled",
  "Picked Up",
  "Quality Checking",
  "Refund Approved",
  "Completed",
];

const stampReturnDate = (returnRequest, status) => {
  const fieldMap = {
    Approved: "approvedAt",
    Rejected: "rejectedAt",
    "Pickup Scheduled": "pickupScheduledAt",
    "Picked Up": "pickedUpAt",
    "Quality Checking": "qualityCheckedAt",
    "Refund Approved": "refundApprovedAt",
    Completed: "completedAt",
  };

  if (fieldMap[status]) {
    returnRequest[fieldMap[status]] = new Date();
  }
};

const parseJsonBodyField = (value, fallback = {}) => {
  if (!value) return fallback;
  if (typeof value === "object") return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const validateBankRefund = (refundData) => {
  const accountNumber = String(refundData.accountNumber || "").trim();
  const confirmAccountNumber = String(refundData.confirmAccountNumber || "").trim();
  const ifsc = String(refundData.ifsc || "").trim().toUpperCase();

  if (!refundData.accountHolder?.trim()) return "Account holder name is required";
  if (!refundData.bankName?.trim()) return "Bank name is required";
  if (!accountNumber || accountNumber.length < 9) return "Valid account number is required";
  if (accountNumber !== confirmAccountNumber) return "Account number does not match";
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) return "Valid IFSC code is required";

  return "";
};

// exports.requestReturn = async (req, res) => {
//   try {
//     const {
//       itemId,
//       reasonId,
//       reasonTitle,
//       reason,
//       subReason,
//       description = "",
//       comment = "",
//     } = req.body;

//     const finalReasonTitle = reasonTitle || reason || "";

//     if (!finalReasonTitle) {
//       return res.status(400).json({
//         success: false,
//         message: "Return reason is required",
//       });
//     }

//     const order = await Order.findOne({
//       _id: req.params.id,
//       userId: req.user._id,
//     });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     if (order.orderStatus !== "Delivered") {
//       return res.status(400).json({
//         success: false,
//         message: "Return allowed only for delivered orders",
//       });
//     }

//     if (itemId && !order.products.id(itemId)) {
//       return res.status(404).json({
//         success: false,
//         message: "Order item not found",
//       });
//     }

//     if (RETURN_ACTIVE_STATUSES.includes(order.returnRequest?.status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Return request already exists",
//       });
//     }

//     const photos =
//       req.files?.photos?.map((file) => `/uploads/${file.filename}`) || [];

//     const videos =
//       req.files?.videos?.map((file) => `/uploads/${file.filename}`) || [];

//     const refundData = parseJsonBodyField(req.body.refundData, {});

//     order.returnRequest = {
//       ...(order.returnRequest || {}),
//       status: "Requested",
//       itemId: itemId || null,
//       reasonId: reasonId || null,
//       reasonTitle: finalReasonTitle,
//       subReason: subReason || "",
//       description: description || comment || "",
//       comment: comment || description || "",
//       evidence: {
//         photos,
//         videos,
//       },
//       refundPreference: {
//         method: refundData.refundMethod || "",
//         accountHolder: refundData.accountHolder || "",
//         bankName: refundData.bankName || "",
//         accountNumber: refundData.accountNumber || "",
//         ifsc: refundData.ifsc || "",
//         upi: refundData.upi || "",
//       },
//       requestedAt: new Date(),
//       updatedAt: new Date(),
//       history: [
//         ...(order.returnRequest?.history || []),
//         {
//           status: "Requested",
//           message: `Customer requested return: ${finalReasonTitle}`,
//           by: "Customer",
//           date: new Date(),
//         },
//       ],
//     };

//     order.timeline.push({
//       status: "Return Requested",
//       message: finalReasonTitle,
//       time: new Date(),
//     });

//     await order.save();

//     try {
//       await sendOrderStatusNotification(order, "Return Requested");
//     } catch (err) {
//       console.log("Return Email Error:", err.message);
//     }

//     return res.json({
//       success: true,
//       message: "Return request submitted successfully",
//       order: serializeOrder(order),
//     });
//   } catch (err) {
//     console.log("RETURN REQUEST ERROR:", err);

//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };



exports.getAllReturnRequests = async (req, res) => {
  try {
    const { search = "", status = "" } = req.query;

    const filter = {
      "returnRequest.status": {
        $ne: "Not Requested",
      },
    };

    if (status && status !== "ALL") {
      filter["returnRequest.status"] = status;
    }

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "userInfo.name": { $regex: search, $options: "i" } },
        { "userInfo.phone": { $regex: search, $options: "i" } },
        { "returnRequest.reasonTitle": { $regex: search, $options: "i" } },
        { "products.name": { $regex: search, $options: "i" } },
      ];
    }

    const orders = await Order.find(filter).sort({
      "returnRequest.requestedAt": -1,
    });

    return res.json({
      success: true,
      total: orders.length,
      requests: orders.map(serializeOrder),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getReturnRequestDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      order: serializeOrder(order),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.adminUpdateReturnStatus = async (req, res) => {
  try {
    const {
      status,
      adminRemark = "",
      customerMessage = "",
      invalidFields = [],
    } = req.body;

    if (!RETURN_ADMIN_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid return status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.returnRequest) {
      order.returnRequest = {};
    }

    if (!order.returnRequest.history) {
      order.returnRequest.history = [];
    }

    const message =
      customerMessage ||
      adminRemark ||
      `Return status changed to ${status}`;

    order.returnRequest.status = status;
    order.returnRequest.adminRemark = adminRemark;
    order.returnRequest.customerMessage = customerMessage;
    order.returnRequest.invalidFields = invalidFields;
    order.returnRequest.updatedAt = new Date();

    order.returnRequest.adminReview = {
      reviewNote: adminRemark || customerMessage,
      reviewedBy: req.user?._id || null,
      reviewedAt: new Date(),
    };

    stampReturnDate(order.returnRequest, status);

    order.returnRequest.history.push({
      status,
      message,
      date: new Date(),
      by: "Admin",
    });

    order.timeline.push({
      status: `Return ${status}`,
      message,
      time: new Date(),
    });

    await order.save();

    try {
      await logAdminActivity({
        req,
        admin: req.user,
        action: "UPDATE",
        module: "RETURN",
        targetId: order._id,
        details: {
          description: `Return changed to ${status}`,
        },
      });
    } catch (err) {
      console.log("Activity Log Error:", err.message);
    }

    return res.json({
      success: true,
      message: "Return status updated successfully",
      order: serializeOrder(order),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.adminUpdateReturn = async (req, res) => {
  try {
    const { status, adminNote = "" } = req.body;

    ```
const order = await Order.findById(req.params.id);

if (!order) {
  return res.status(404).json({
    success: false,
    message: "Order not found",
  });
}

// SAFE OBJECT CREATION
if (!order.returnRequest) {
  order.returnRequest = {};
}

if (!order.returnRequest.adminReview) {
  order.returnRequest.adminReview = {
    reviewNote: "",
    reviewedBy: null,
    reviewedAt: null,
  };
}

order.returnRequest.status = status;

if (status === "Approved") {
  order.returnRequest.approvedAt = new Date();

  order.returnRequest.adminReview.reviewNote =
    adminNote;

  order.returnRequest.adminReview.reviewedBy =
    req.user?._id || null;

  order.returnRequest.adminReview.reviewedAt =
    new Date();

  order.timeline.push({
    status: "Return Approved",
    message:
      adminNote ||
      "Return request approved by admin",
    time: new Date(),
  });
}

if (status === "Rejected") {
  order.timeline.push({
    status: "Return Rejected",
    message:
      adminNote ||
      "Return request rejected by admin",
    time: new Date(),
  });
}

if (status === "Pickup Scheduled") {
  order.returnRequest.pickupAt =
    new Date();

  order.timeline.push({
    status: "Return Pickup Scheduled",
    message:
      adminNote ||
      "Pickup scheduled for return",
    time: new Date(),
  });
}

if (status === "Picked Up") {
  order.returnRequest.pickupAt =
    new Date();

  order.timeline.push({
    status: "Return Picked Up",
    message:
      adminNote ||
      "Returned item picked up",
    time: new Date(),
  });

  if (
    order.payment.method === "RAZORPAY" &&
    order.payment.status === "Paid"
  ) {
    order.refund.status =
      "Not Requested";
  }
}

if (status === "Refund Eligible") {
  order.timeline.push({
    status: "Refund Eligible",
    message:
      adminNote ||
      "Customer can now request refund",
    time: new Date(),
  });
}

if (status === "Completed") {
  order.returnRequest.completedAt =
    new Date();

  order.timeline.push({
    status: "Return Completed",
    message:
      adminNote ||
      "Return process completed",
    time: new Date(),
  });
}

await order.save();

res.json({
  success: true,
  message: "Return updated successfully",
  order,
});
```

  } catch (error) {
    console.log(
      "ADMIN RETURN UPDATE ERROR:",
      error
    );

    ```
return res.status(500).json({
  success: false,
  message: error.message,
});
```

  }
};

/* =====================================================
   ADMIN RETURN REQUESTS LIST
===================================================== */

exports.getAllReturnRequests = async (req, res) => {
  try {
    const { search = "", status = "" } = req.query;

    const filter = {
      "returnRequest.status": {
        $ne: "Not Requested",
      },
    };

    if (status && status !== "ALL") {
      filter["returnRequest.status"] = status;
    }

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "userInfo.name": { $regex: search, $options: "i" } },
        { "userInfo.phone": { $regex: search, $options: "i" } },
        { "returnRequest.reasonTitle": { $regex: search, $options: "i" } },
        { "products.name": { $regex: search, $options: "i" } },
      ];
    }

    const orders = await Order.find(filter).sort({
      "returnRequest.requestedAt": -1,
    });

    return res.json({
      success: true,
      total: orders.length,
      requests: orders.map(serializeOrder),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   ADMIN RETURN REQUEST DETAILS
===================================================== */

exports.getReturnRequestDetails = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* =====================================================
   ADMIN UPDATE RETURN STATUS
===================================================== */

exports.adminUpdateReturnStatus = async (req, res) => {
  try {
    const { status, adminRemark = "" } = req.body;

    const allowedStatuses = [
      "Requested",
      "Approved",
      "Rejected",
      "Pickup Scheduled",
      "Picked Up",
      "Quality Checking",
      "Refund Approved",
      "Completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid return status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.returnRequest) {
      order.returnRequest = {};
    }

    if (!order.returnRequest.history) {
      order.returnRequest.history = [];
    }

    if (!order.returnRequest.adminReview) {
      order.returnRequest.adminReview = {
        reviewNote: "",
        reviewedBy: null,
        reviewedAt: null,
      };
    }

    order.returnRequest.status = status;
    order.returnRequest.adminRemark = adminRemark;
    order.returnRequest.updatedAt = new Date();

    order.returnRequest.adminReview.reviewNote = adminRemark;
    order.returnRequest.adminReview.reviewedBy = req.user?._id || null;
    order.returnRequest.adminReview.reviewedAt = new Date();

    if (status === "Approved") order.returnRequest.approvedAt = new Date();
    if (status === "Rejected") order.returnRequest.rejectedAt = new Date();
    if (status === "Pickup Scheduled") order.returnRequest.pickupScheduledAt = new Date();
    if (status === "Picked Up") order.returnRequest.pickedUpAt = new Date();
    if (status === "Quality Checking") order.returnRequest.qualityCheckedAt = new Date();
    if (status === "Completed") order.returnRequest.completedAt = new Date();

    order.returnRequest.history.push({
      status,
      message: adminRemark || `Return status changed to ${status}`,
      date: new Date(),
      by: "Admin",
    });

    order.timeline.push({
      status: `Return ${status}`,
      message: adminRemark || `Return status changed to ${status}`,
      time: new Date(),
    });

    await order.save();

    return res.json({
      success: true,
      message: "Return status updated successfully",
      order: serializeOrder(order),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};