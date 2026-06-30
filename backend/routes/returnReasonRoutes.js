const express = require("express");
const router = express.Router();

const {
  createReturnReason,
  getReturnReasons,
  adminGetReturnReasons,
  getReturnReasonById,
  updateReturnReason,
  deleteReturnReason,
  toggleReturnReason,

  getReturnUISettings,
  updateReturnUISettings,

} = require("../controllers/returnReasonController");

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");

/* =========================
   CUSTOMER
========================= */

router.get(
  "/",
  getReturnReasons
);

/* =========================
   RETURN UI SETTINGS
========================= */

router.get(
  "/ui/settings",
  getReturnUISettings
);

router.put(
  "/admin/ui/settings",
  protect,
  admin,
  updateReturnUISettings
);

/* =========================
   ADMIN
========================= */

router.get(
  "/admin/all",
  protect,
  admin,
  adminGetReturnReasons
);

router.post(
  "/admin/create",
  protect,
  admin,
  createReturnReason
);

router.get(
  "/admin/:id",
  protect,
  admin,
  getReturnReasonById
);

router.put(
  "/admin/update/:id",
  protect,
  admin,
  updateReturnReason
);

router.put(
  "/admin/toggle/:id",
  protect,
  admin,
  toggleReturnReason
);

router.delete(
  "/admin/delete/:id",
  protect,
  admin,
  deleteReturnReason
);

module.exports = router;