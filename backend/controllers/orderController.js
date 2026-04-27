const Order = require("../models/Order");
const Cart = require("../models/cart");
const User = require("../models/User");

const SHIPPING_CHARGE = 0;
const PLATFORM_FEE = 0;

const generateOrderNumber = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(100000 + Math.random() * 900000);
  return `RC-${date}-${random}`;
};

const mapPaymentMethod = (paymentMethod = "bank-transfer") => {
  if (paymentMethod === "quote-request") return "QUOTE_REQUEST";
  if (paymentMethod === "online-payment") return "ONLINE_PAYMENT";
  if (paymentMethod === "cod") return "COD";
  return "BANK_TRANSFER";
};

const serializeOrder = (orderDoc) => {
  const order =
    typeof orderDoc?.toObject === "function" ? orderDoc.toObject() : orderDoc;

  return {
    ...order,
    finalAmount: order?.pricing?.totalAmount || 0,
    status: order?.orderStatus || "Order Placed",
    trackingEvents:
      order?.products?.[0]?.itemStatusHistory || [
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
      paymentMethod = "bank-transfer",
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
      "name slug brand sku mpn thumbnail images stock price mrp hsnCode isActive status"
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

      const quantity = Math.max(1, Number(item.qty || 1));
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

    const subtotal = products.reduce((sum, item) => sum + item.lineSubtotal, 0);
    const tax = products.reduce((sum, item) => sum + item.gstAmount, 0);
    const totalAmount = subtotal + tax + SHIPPING_CHARGE + PLATFORM_FEE;
    const itemCount = products.reduce((sum, item) => sum + item.quantity, 0);

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      userId: req.user._id,

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
        shippingCharge: SHIPPING_CHARGE,
        platformFee: PLATFORM_FEE,
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

    cart.items = [];
    await cart.save();

    user.lastActivity = new Date();
    await user.save();

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
    const orders = await Order.find().sort({ createdAt: -1 });

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
    const { orderId, status, trackingId, courier, trackingUrl } = req.body;

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

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
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

    if (["Shipped", "Out for Delivery", "Delivered", "Cancelled"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled now",
      });
    }

    order.orderStatus = "Cancelled";
    order.cancellation.cancelReason = reason;
    order.cancellation.cancelComment = comment;
    order.cancellation.cancelledAt = new Date();

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

    if (["Shipped", "Out for Delivery", "Delivered", "Cancelled"].includes(order.orderStatus)) {
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

    if (["Shipped", "Out for Delivery", "Delivered", "Cancelled"].includes(item.itemStatus)) {
      return res.status(400).json({
        success: false,
        message: "This item cannot be cancelled now",
      });
    }

    item.itemStatus = "Cancelled";

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
      (product) => product.itemStatus !== "Cancelled"
    );

    if (activeItems.length === 0) {
      order.orderStatus = "Cancelled";
      order.cancellation.cancelReason = "All items cancelled";
      order.cancellation.cancelComment = comment;
      order.cancellation.cancelledAt = new Date();
    } else {
      order.orderStatus = "Processing";
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

    if (!order.canEditAddress || ["Shipped", "Out for Delivery", "Delivered", "Cancelled"].includes(order.orderStatus)) {
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

    if (!order.canEditPhone || ["Shipped", "Out for Delivery", "Delivered", "Cancelled"].includes(order.orderStatus)) {
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