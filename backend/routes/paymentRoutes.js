const express = require("express");
const router = express.Router();

const {
  getPaymentMethods,
  adminGetPaymentSettings,
  adminUpdatePaymentSettings,
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");

const protectAdmin =
  authMiddleware.protectAdmin ||
  authMiddleware.adminProtect ||
  authMiddleware.protect;

// Public
router.get("/methods", getPaymentMethods);

// Admin
router.get("/settings/admin", protectAdmin, adminGetPaymentSettings);
router.put("/settings/admin", protectAdmin, adminUpdatePaymentSettings);

module.exports = router;