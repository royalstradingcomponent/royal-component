const Order = require("../models/Order");
const Cart = require("../models/cart");
const User = require("../models/User");
const Product = require("../models/Product");
const { sendOrderPlacedNotification } = require("../services/notificationService");
const PDFDocument = require("pdfkit");
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
      "name slug brand sku mpn thumbnail images stock stockStatus isOutOfStock allowBackorder price mrp hsnCode isActive status"
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

      const isOutOfStock =
  Number(product?.stock || 0) <= 0;

      if (isOutOfStock) {
        return res.status(400).json({
          success: false,
          message: `${product?.name || "Product"} is currently out of stock`,
        });
      }

      const quantity = Math.max(1, Number(item.qty || 1));
      if (
        !product.allowBackorder &&
        Number(product.stock || 0) < quantity
      ) {
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
        category:
          product.category ||
          "Other",

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

    for (const item of products) {

  const product =
    await Product.findById(item.productId);

  if (!product) continue;

  product.stock =
    Math.max(
      0,
      Number(product.stock || 0) -
      Number(item.quantity || 0)
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
    Number(product.soldStock || 0) +
    Number(item.quantity || 0);

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

    const {
      page = 1,
      limit = 15,
      search = "",
      status = "",
    } = req.query;

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
   const {
  orderId,
  status,
  trackingId,
  courier,
  trackingUrl,
  itemStatuses = [],
} = req.body;

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

    order.timeline.push({

  status,

  message: `Order moved to ${status}`,

  time: new Date(),

});

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
    order.timeline.push({

  status: "Cancelled",

  message:
    reason || "Order cancelled by user",

  time: new Date(),

});
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

    order.timeline.push({

  status: "Item Cancelled",

  message:
    `${item.name} cancelled`,

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

    order.pricing.subtotal = activeItems.reduce(
  (sum, item) => sum + Number(item.lineSubtotal || 0),
  0
);

order.pricing.tax = activeItems.reduce(
  (sum, item) => sum + Number(item.gstAmount || 0),
  0
);

order.pricing.totalAmount =
  order.pricing.subtotal +
  order.pricing.tax +
  Number(order.pricing.shippingCharge || 0) +
  Number(order.pricing.platformFee || 0);

order.pricing.itemCount = activeItems.reduce(
  (sum, item) => sum + Number(item.quantity || 0),
  0
);

    const product =
  await Product.findById(item.productId);

if (product) {

  product.stock =
    Number(product.stock || 0) +
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

    if (paymentStatus === "Paid") {

      order.payment.amountPaid =
        order.pricing?.totalAmount || 0;

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

    if (!["Delivered", "Cancelled"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Refund can be requested only after delivered or cancelled order",
      });
    }

    if (
      order.refund?.status &&
      ["Requested", "Approved", "Processing", "Refunded"].includes(
        order.refund.status
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Refund request already exists for this order",
      });
    }

    if (order.payment?.method === "COD" && method !== "BANK_ACCOUNT") {
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

exports.submitPaymentProof = async (req, res) => {
  try {
    const { utr = "", note = "" } = req.body;

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

    if (["Paid", "Refunded"].includes(order.payment.status)) {
      return res.status(400).json({
        success: false,
        message:
          "Payment proof cannot be updated after payment is completed",
      });
    }

    order.payment.proof = {
      image: req.file
        ? `/${req.file.path.replace(/\\/g, "/")}`
        : order.payment.proof?.image || "",

      utr: String(utr || "").trim(),

      note: String(note || "").trim(),

      uploadedAt: new Date(),
    };

    order.payment.transactionId = String(utr || "").trim();

    order.payment.status = "Awaiting Verification";

    order.payment.paymentChanged = true;

    order.payment.paymentChangedAt = new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment proof submitted successfully",
      order: serializeOrder(order),
    });

  } catch (error) {

    console.error("SUBMIT PAYMENT PROOF ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Payment proof submit failed",
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

    const allowedStatuses = ["Approved", "Rejected", "Processing", "Refunded"];

    if (!allowedStatuses.includes(status)) {
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

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

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

    doc
      .roundedRect(35, 30, 525, 110, 18)
      .fill(primary);

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
      doc
        .roundedRect(x, yy, w, h, 14)
        .fillAndStroke("white", border);
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
      .text(
        new Date(order.createdAt).toLocaleString("en-IN"),
        320,
        y + 35
      );

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
        }, ${order.userInfo?.state || ""} - ${order.userInfo?.pincode || ""
        }`,
        60,
        y + 140,
        {
          width: 450,
        }
      );

    y += 195;

    // ======================================================
    // PRODUCTS
    // ======================================================

    sectionTitle("Products");

    // TABLE HEADER

    doc
      .roundedRect(40, y, 520, 35, 10)
      .fill(primary);

    doc
      .fillColor("white")
      .font("Helvetica-Bold")
      .fontSize(11);

    doc.text("PRODUCT", 55, y + 11);
    doc.text("QTY", 305, y + 11);
    doc.text("PRICE", 360, y + 11);
    doc.text("GST", 430, y + 11);
    doc.text("TOTAL", 485, y + 11);

    y += 45;

    order.products.forEach((item) => {

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

      doc
        .fillColor(primary)
        .text(`Rs.  ${item.lineTotal}`, 485, y + 28);

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
    doc
      .roundedRect(40, y, 520, 165, 18)
      .fillAndStroke("white", border);

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
      .text(`Rs.  ${order.pricing?.subtotal || 0}`, 460, y + 28);

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
      .text(`Rs.  ${order.pricing?.tax || 0}`, 460, y + 75);

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
      .text(
        `Rs.  ${order.pricing?.shippingCharge || 0}`,
        460,
        y + 122
      );

    // GRAND TOTAL BOX
    doc
      .roundedRect(55, y + 185, 490, 48, 12)
      .fill(green);

    doc
      .fillColor("white")
      .font("Helvetica-Bold")
      .fontSize(18)
      .text("Grand Total", 80, y + 201);

    doc
      .text(
        `Rs.  ${order.pricing?.totalAmount || 0}`,
        430,
        y + 201
      );

    y += 260;

    // ======================================================
    // FOOTER
    // ======================================================

    doc
      .fillColor("#94a3b8")
      .font("Helvetica")
      .fontSize(10)
      .text(
        "Thank you for choosing Royal Trading Component",
        0,
        800,
        {
          align: "center",
        }
      );

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

    const totalOrders =
      await Order.countDocuments();

    const deliveredOrders =
      await Order.countDocuments({
        orderStatus: "Delivered",
      });

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const todayOrders =
      await Order.countDocuments({
        createdAt: {
          $gte: today,
        },
      });

    const revenueResult =
      await Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$pricing.totalAmount",
            },
          },
        },
      ]);

    const totalRevenue =
      revenueResult[0]?.totalRevenue || 0;

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

      message:
        "Orders calendar failed",

    });

  }

};

exports.getRevenueAnalytics = async (req, res) => {

  try {

    // TOTAL REVENUE
    const totalRevenueResult =
      await Order.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum:
                "$pricing.totalAmount",
            },
          },
        },
      ]);

    // MONTHLY REVENUE
    const monthlyRevenue =
      await Order.aggregate([
        {
          $group: {
            _id: {
              month: {
                $month: "$createdAt",
              },
            },
            revenue: {
              $sum:
                "$pricing.totalAmount",
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
    const orderAnalytics =
      await Order.aggregate([
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
    const paymentAnalytics =
      await Order.aggregate([
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
    const categoryRevenue =
      await Order.aggregate([
        {
          $unwind: "$products",
        },
        {
          $group: {
            _id:
              "$products.category",
            revenue: {
              $sum: {
                $multiply: [
                  "$products.price",
                  "$products.quantity",
                ],
              },
            },
          },
        },
      ]);

    // TOP PRODUCTS
    const topProducts =
      await Order.aggregate([
        {
          $unwind: "$products",
        },
        {
          $group: {
            _id: "$products.name",
            qty: {
              $sum:
                "$products.quantity",
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
    const gstSummary =
      await Order.aggregate([
        {
          $group: {
            _id: null,
            gst: {
              $sum:
                "$pricing.tax",
            },
          },
        },
      ]);

    // REFUND ANALYTICS
    const refundAnalytics =
      await Order.aggregate([
        {
          $match: {
            orderStatus:
              "Cancelled",
          },
        },
        {
          $group: {
            _id: null,
            refund: {
              $sum:
                "$pricing.totalAmount",
            },
          },
        },
      ]);

    // YEARLY REVENUE
    const currentYear =
      new Date().getFullYear();

    const yearlyRevenue =
      await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                `${currentYear}-01-01`
              ),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum:
                "$pricing.totalAmount",
            },
          },
        },
      ]);

    return res.json({

      success: true,

      analytics: {

        deliveredRevenue:
          await Order.aggregate([
            {
              $match: {
                orderStatus: "Delivered",
              },
            },
            {
              $group: {
                _id: null,
                total: {
                  $sum:
                    "$pricing.totalAmount",
                },
              },
            },
          ]).then(
            (r) => r[0]?.total || 0
          ),

        processingRevenue:
          await Order.aggregate([
            {
              $match: {
                orderStatus: "Processing",
              },
            },
            {
              $group: {
                _id: null,
                total: {
                  $sum:
                    "$pricing.totalAmount",
                },
              },
            },
          ]).then(
            (r) => r[0]?.total || 0
          ),

        cancelledRevenue:
          await Order.aggregate([
            {
              $match: {
                orderStatus: "Cancelled",
              },
            },
            {
              $group: {
                _id: null,
                total: {
                  $sum:
                    "$pricing.totalAmount",
                },
              },
            },
          ]).then(
            (r) => r[0]?.total || 0
          ),

        currentMonthRevenue:
          await Order.aggregate([
            {
              $match: {
                createdAt: {
                  $gte: new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    1
                  ),
                },
              },
            },
            {
              $group: {
                _id: null,
                total: {
                  $sum:
                    "$pricing.totalAmount",
                },
              },
            },
          ]).then(
            (r) => r[0]?.total || 0
          ),

        totalRevenue:
          totalRevenueResult[0]
            ?.total || 0,

        monthlyRevenue,

        orderAnalytics,

        paymentAnalytics,

        categoryRevenue,

        topProducts,

        gstSummary:
          gstSummary[0]?.gst || 0,

        refundAnalytics:
          refundAnalytics[0]
            ?.refund || 0,

        yearlyRevenue:
          yearlyRevenue[0]
            ?.total || 0,

      },

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        "Revenue analytics failed",

    });

  }

};