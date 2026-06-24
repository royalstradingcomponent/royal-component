const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  trackOrder,
  updateOrderStatus,
  getOrderById,
  cancelOrder,
  cancelOrderItem,
  updateOrderAddress,
  updateOrderPhone,
  updatePayment,
  requestRefund,
  adminUpdateRefund,

  downloadOrderPdf,
  downloadTaxInvoice,
  getOrdersCalendar,
  getRevenueAnalytics,
  createRazorpayOrder,
  verifyRazorpayPayment,

  requestExchange,
adminUpdateExchange,
requestReturn,
adminUpdateReturn,

} = require("../controllers/orderController");

const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);

router.post("/razorpay/create-order", protect, createRazorpayOrder);

router.post("/razorpay/verify-payment", protect, verifyRazorpayPayment);
router.get("/my-orders", protect, getMyOrders);
router.get("/track/:id", protect, trackOrder);

router.get("/admin/all", protect, admin, getAllOrders);
router.get("/admin/orders-calendar", protect, admin, getOrdersCalendar);
router.get("/admin/revenue-analytics", protect, admin, getRevenueAnalytics);
router.put("/admin/update-status", protect, admin, updateOrderStatus);
router.put("/admin/refund/:id", protect, admin, adminUpdateRefund);

router.put("/cancel/:id", protect, cancelOrder);
router.put("/cancel-item/:orderId/:itemId", protect, cancelOrderItem);

router.post("/refund/:id", protect, requestRefund);

router.get("/admin/download-pdf/:id", downloadOrderPdf);
router.get(
  "/admin/download-tax-invoice/:id",
  downloadTaxInvoice,
);

router.put("/update-address/:id", protect, updateOrderAddress);
router.put("/update-phone/:id", protect, updateOrderPhone);
router.put("/update-payment/:id", protect, updatePayment);

router.post(
  "/exchange/:id",
  protect,
  requestExchange
);

router.put(
  "/admin/exchange/:id",
  protect,
  admin,
  adminUpdateExchange
);

router.post(
  "/return/:id",
  protect,
  requestReturn
);

router.put(
  "/admin/return/:id",
  protect,
  admin,
  adminUpdateReturn
);

router.get("/:id", protect, getOrderById);

module.exports = router;
