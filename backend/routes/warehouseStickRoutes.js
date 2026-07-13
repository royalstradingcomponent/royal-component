const express = require("express");

const router = express.Router();

const {
  createWarehouseStick,
  getWarehouseSticks,
  getWarehouseStickById,
  updateWarehouseStick,
  deleteWarehouseStick,
  changeWarehouseStickStatus,
  getWarehouseStickDashboardStats,
} = require("../controllers/warehouseStickController");

const { verifyAdmin } = require("../middleware/authMiddleware");

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",
  verifyAdmin,
  getWarehouseStickDashboardStats
);

/*
|--------------------------------------------------------------------------
| CRUD
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  verifyAdmin,
  createWarehouseStick
);

router.get(
  "/",
  verifyAdmin,
  getWarehouseSticks
);

router.get(
  "/:id",
  verifyAdmin,
  getWarehouseStickById
);

router.put(
  "/:id",
  verifyAdmin,
  updateWarehouseStick
);

router.delete(
  "/:id",
  verifyAdmin,
  deleteWarehouseStick
);

/*
|--------------------------------------------------------------------------
| Status
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/status",
  verifyAdmin,
  changeWarehouseStickStatus
);

module.exports = router;