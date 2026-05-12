const express = require("express");
const router = express.Router();

const {
  getFooterPage,
  adminGetFooterPage,
  adminUpdateFooterPage,
} = require("../controllers/footerPageController");

const authMiddleware = require("../middleware/authMiddleware");

const protectAdmin =
  authMiddleware.protectAdmin ||
  authMiddleware.adminProtect ||
  authMiddleware.protect ||
  ((req, res, next) => next());

// Public
router.get("/", getFooterPage);

// Admin
router.get("/admin", protectAdmin, adminGetFooterPage);
router.put("/admin", protectAdmin, adminUpdateFooterPage);

module.exports = router;