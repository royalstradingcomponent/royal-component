const express = require("express");

const router = express.Router();

const {
  createWarehouse,
  getWarehouses,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse,
  changeWarehouseStatus,
  getWarehouseDashboardStats,
} = require("../controllers/warehouseController");

const { protect, admin } = require("../middleware/authMiddleware");

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",
  protect,
  admin,
  getWarehouseDashboardStats
);

/*
|--------------------------------------------------------------------------
| Warehouse CRUD
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  protect,
  admin,
  createWarehouse
);

router.get(
  "/",
  protect,
  admin,
  getWarehouses
);

router.get(
  "/:id",
  protect,
  admin,
  getWarehouseById
);

router.put(
  "/:id",
  protect,
  admin,
  updateWarehouse
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteWarehouse
);
/*
|--------------------------------------------------------------------------
| Status
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/status",
  protect,
  admin,
  changeWarehouseStatus
);
module.exports = router;