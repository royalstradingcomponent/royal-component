const express = require("express");

const router = express.Router();

const {
  transferStock,
  getTransferHistory,
  getTransferById,
  getRecentTransfers,
  cancelTransfer,
  deleteTransfer,
  getTransferDashboardStats,
} = require("../controllers/transferHistoryController");

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",
  protect,
  admin,
  getTransferDashboardStats
);

/*
|--------------------------------------------------------------------------
| Recent Transfers
|--------------------------------------------------------------------------
*/

router.get(
  "/recent",
  protect,
  admin,
  getRecentTransfers
);

/*
|--------------------------------------------------------------------------
| Transfer History
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  protect,
  admin,
  getTransferHistory
);

router.get(
  "/:id",
  protect,
  admin,
  getTransferById
);

/*
|--------------------------------------------------------------------------
| Transfer Stock
|--------------------------------------------------------------------------
*/

router.post(
  "/transfer",
  protect,
  admin,
  transferStock
);

/*
|--------------------------------------------------------------------------
| Cancel Transfer
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/cancel",
  protect,
  admin,
  cancelTransfer
);

/*
|--------------------------------------------------------------------------
| Delete Transfer
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  protect,
  admin,
  deleteTransfer
);

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

module.exports = router;