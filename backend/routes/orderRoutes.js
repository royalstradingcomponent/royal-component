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
  getAllExchangeRequests,
  getExchangeRequestDetails,
  requestReturn,
  adminUpdateReturn,
  getAllReturnRequests,
  getReturnRequestDetails,
  adminUpdateReturnStatus,
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

router.get("/admin/exchanges", protect, admin, getAllExchangeRequests);
router.get("/admin/exchanges/:id", protect, admin, getExchangeRequestDetails);
router.put("/admin/exchange/:id", protect, admin, adminUpdateExchange);

router.put("/cancel/:id", protect, cancelOrder);
router.put("/cancel-item/:orderId/:itemId", protect, cancelOrderItem);
router.post("/refund/:id", protect, requestRefund);

router.get("/admin/download-pdf/:id", downloadOrderPdf);
router.get("/admin/download-tax-invoice/:id", downloadTaxInvoice);

router.put("/update-address/:id", protect, updateOrderAddress);
router.put("/update-phone/:id", protect, updateOrderPhone);
router.put("/update-payment/:id", protect, updatePayment);

router.post(
  "/exchange/:id",
  protect,
  (req, res, next) => {
    req.query.type = "requests";
    next();
  },
  upload.fields([
    { name: "photos", maxCount: 10 },
    { name: "videos", maxCount: 3 },
  ]),
  requestExchange,
);

router.post(
  "/return/:id",
  protect,
  (req, res, next) => {
    req.query.type = "requests";
    next();
  },
  upload.fields([
    { name: "photos", maxCount: 10 },
    { name: "videos", maxCount: 3 },
  ]),
  requestReturn,
);

router.put("/admin/return/:id", protect, admin, adminUpdateReturn);
router.get("/admin/returns", protect, admin, getAllReturnRequests);
router.get("/admin/returns/:id", protect, admin, getReturnRequestDetails);
router.put(
  "/admin/returns/status/:id",
  protect,
  admin,
  adminUpdateReturnStatus,
);

router.get("/:id", protect, getOrderById);

module.exports = router;
