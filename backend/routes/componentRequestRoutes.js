const express = require("express");
const router = express.Router();

const {
  createComponentRequest,
  getAllComponentRequests,
  updateComponentRequest,
  getMyComponentRequests,
  getComponentRequestsByEmail,
  downloadQuotationPdf,
  getDashboardStats,
  getSingleComponentRequest,
  getCalendarRequests,
  getRevenueRequests,
  downloadFullRequestPdf,
} = require("../controllers/componentRequestController");

const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadRequestFiles");

router.post(
  "/",
  protect,
  upload.fields([
    { name: "datasheets", maxCount: 10 },
    { name: "images", maxCount: 10 },
  ]),
  createComponentRequest,
);

router.get("/lookup", getComponentRequestsByEmail);
router.get("/my", protect, getMyComponentRequests);
router.get("/all-public", protect, getMyComponentRequests);

router.get("/admin", protect, admin, getAllComponentRequests);

router.get("/admin/dashboard-stats", protect, admin, getDashboardStats);

router.get("/admin/request/:id", protect, admin, getSingleComponentRequest);
router.get("/admin/calendar", protect, admin, getCalendarRequests);

router.get("/admin/revenue", protect, admin, getRevenueRequests);

router.put("/admin/:id", protect, admin, updateComponentRequest);
router.get("/download-pdf/:id", downloadQuotationPdf);
router.get(
  "/admin/download-full-pdf/:id",
  protect,
  admin,
  downloadFullRequestPdf,
);

module.exports = router;
