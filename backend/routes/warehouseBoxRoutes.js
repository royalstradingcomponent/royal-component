const express = require("express");

const router = express.Router();

const {
  createWarehouseBox,
  getWarehouseBoxes,
  getWarehouseBoxById,
  updateWarehouseBox,
  deleteWarehouseBox,
  changeWarehouseBoxStatus,
  getWarehouseBoxDashboardStats,
} = require("../controllers/warehouseBoxController");

const { verifyAdmin } = require("../middleware/authMiddleware");

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",
  verifyAdmin,
  getWarehouseBoxDashboardStats
);

/*
|--------------------------------------------------------------------------
| CRUD
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  verifyAdmin,
  createWarehouseBox
);

router.get(
  "/",
  verifyAdmin,
  getWarehouseBoxes
);

router.get(
  "/:id",
  verifyAdmin,
  getWarehouseBoxById
);

router.put(
  "/:id",
  verifyAdmin,
  updateWarehouseBox
);

router.delete(
  "/:id",
  verifyAdmin,
  deleteWarehouseBox
);

/*
|--------------------------------------------------------------------------
| Status
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/status",
  verifyAdmin,
  changeWarehouseBoxStatus
);

module.exports = router;