const express = require("express");

const router = express.Router();

const {
  createStockLocation,
  getStockLocations,
  getStockLocationById,
  updateStockLocation,
  deleteStockLocation,

  increaseStock,
  decreaseStock,

  reserveStock,
  releaseReservedStock,

  markDamagedStock,
  restoreDamagedStock,

  searchProductLocation,
  getStockDashboardStats,

} = require("../controllers/stockLocationController");

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");

/*
|--------------------------------------------------------------------------
| CRUD
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  protect,
  admin,
  createStockLocation
);

router.get(
  "/",
  protect,
  admin,
  getStockLocations
);

router.get(
  "/:id",
  protect,
  admin,
  getStockLocationById
);

router.put(
  "/:id",
  protect,
  admin,
  updateStockLocation
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteStockLocation
);

/*
|--------------------------------------------------------------------------
| Stock Operations
|--------------------------------------------------------------------------
*/

/*
| Increase Stock
*/

router.patch(
  "/:id/increase",
  protect,
  admin,
  increaseStock
);

/*
| Decrease Stock
*/

router.patch(
  "/:id/decrease",
  protect,
  admin,
  decreaseStock
);

/*
| Reserve Stock
*/

router.patch(
  "/:id/reserve",
  protect,
  admin,
  reserveStock
);

/*
| Release Reserved Stock
*/

router.patch(
  "/:id/release-reserved",
  protect,
  admin,
  releaseReservedStock
);

/*
| Mark Damaged Stock
*/

router.patch(
  "/:id/damaged",
  protect,
  admin,
  markDamagedStock
);

/*
| Restore Damaged Stock
*/

router.patch(
  "/:id/restore-damaged",
  protect,
  admin,
  restoreDamagedStock
);

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

module.exports = router;