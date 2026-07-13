const TransferHistory = require("../models/TransferHistory");
const StockLocation = require("../models/StockLocation");
const Warehouse = require("../models/Warehouse");
const WarehouseBox = require("../models/WarehouseBox");
const WarehouseStick = require("../models/WarehouseStick");

const {
  updateWarehouseStatistics,
  updateBoxStatistics,
  updateStickStatistics,
} = require("../services/warehouseInventoryService");

/*
|--------------------------------------------------------------------------
| Transfer Stock
|--------------------------------------------------------------------------
*/

exports.transferStock = async (req, res) => {
  try {
    const {
      productId,

      fromWarehouseId,
      fromBoxId,
      fromStickId = null,

      toWarehouseId,
      toBoxId,
      toStickId = null,

      quantity,

      transferType = "STICK_TO_STICK",

      reason = "",
      remarks = "",
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product is required.",
      });
    }

    if (!fromWarehouseId || !toWarehouseId) {
      return res.status(400).json({
        success: false,
        message: "Warehouse is required.",
      });
    }

    if (!fromBoxId || !toBoxId) {
      return res.status(400).json({
        success: false,
        message: "Box is required.",
      });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Source Stock
    |--------------------------------------------------------------------------
    */

    const sourceLocation =
      await StockLocation.findOne({
        productId,
        warehouseId: fromWarehouseId,
        boxId: fromBoxId,
        stickId: fromStickId,
      });

    if (!sourceLocation) {
      return res.status(404).json({
        success: false,
        message: "Source stock not found.",
      });
    }

    if (
      sourceLocation.availableQuantity <
      quantity
    ) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Destination
    |--------------------------------------------------------------------------
    */

    let destinationLocation =
      await StockLocation.findOne({
        productId,
        warehouseId: toWarehouseId,
        boxId: toBoxId,
        stickId: toStickId,
      });

    /*
    |--------------------------------------------------------------------------
    | Check Destination Stick Capacity
    |--------------------------------------------------------------------------
    */

    if (toStickId) {
      const stick =
        await WarehouseStick.findById(
          toStickId
        );

      if (!stick) {
        return res.status(404).json({
          success: false,
          message: "Destination stick not found.",
        });
      }

      if (
        stick.occupiedQuantity + quantity >
        stick.maxCapacity
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Destination stick capacity exceeded.",
        });
      }
    }

        /*
    |--------------------------------------------------------------------------
    | Deduct Source Stock
    |--------------------------------------------------------------------------
    */

    sourceLocation.quantity -= Number(quantity);

    sourceLocation.updatedBy = req.user._id;

    await sourceLocation.save();

    /*
    |--------------------------------------------------------------------------
    | Add Destination Stock
    |--------------------------------------------------------------------------
    */

    if (destinationLocation) {

      destinationLocation.quantity += Number(quantity);

      destinationLocation.updatedBy = req.user._id;

      await destinationLocation.save();

    } else {

      destinationLocation =
        await StockLocation.create({

          productId,

          warehouseId: toWarehouseId,

          boxId: toBoxId,

          stickId: toStickId,

          quantity,

          locationType: toStickId
            ? "STICK"
            : "LOOSE",

          createdBy: req.user._id,

          updatedBy: req.user._id,

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Update Stick Quantity
    |--------------------------------------------------------------------------
    */

    if (fromStickId) {

      await WarehouseStick.findByIdAndUpdate(
        fromStickId,
        {
          $inc: {
            occupiedQuantity: -Number(quantity),
          },
        }
      );

      await updateStickStatistics(
        fromStickId
      );

    }

    if (toStickId) {

      await WarehouseStick.findByIdAndUpdate(
        toStickId,
        {
          $inc: {
            occupiedQuantity: Number(quantity),
          },
        }
      );

      await updateStickStatistics(
        toStickId
      );

    }

    /*
    |--------------------------------------------------------------------------
    | Update Box Statistics
    |--------------------------------------------------------------------------
    */

    await updateBoxStatistics(
      fromBoxId
    );

    await updateBoxStatistics(
      toBoxId
    );

    /*
    |--------------------------------------------------------------------------
    | Update Warehouse Statistics
    |--------------------------------------------------------------------------
    */

    await updateWarehouseStatistics(
      fromWarehouseId
    );

    await updateWarehouseStatistics(
      toWarehouseId
    );

    /*
    |--------------------------------------------------------------------------
    | Save Transfer History
    |--------------------------------------------------------------------------
    */

    const transfer =
      await TransferHistory.create({

        productId,

        quantity,

        fromWarehouseId,
        fromBoxId,
        fromStickId,

        toWarehouseId,
        toBoxId,
        toStickId,

        transferType,

        reason,

        remarks,

        status: "COMPLETED",

        approvedBy: req.user._id,

        approvedAt: new Date(),

        createdBy: req.user._id,

        updatedBy: req.user._id,

      });

    return res.status(201).json({

      success: true,

      message:
        "Stock transferred successfully.",

      data: transfer,

    });

  } catch (error) {

    console.error(
      "Transfer Stock Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to transfer stock.",

      error: error.message,

    });

  }

};

/*
|--------------------------------------------------------------------------
| Get All Transfer History
|--------------------------------------------------------------------------
*/

exports.getTransferHistory = async (req, res) => {
  try {

    const {
      page = 1,
      limit = 20,
      warehouseId,
      productId,
      transferType,
      status,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    if (warehouseId) {
      query.$or = [
        { fromWarehouseId: warehouseId },
        { toWarehouseId: warehouseId },
      ];
    }

    if (productId) {
      query.productId = productId;
    }

    if (transferType) {
      query.transferType = transferType;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        {
          batchNumber: {
            $regex: search,
            $options: "i",
          },
        },
        {
          lotNumber: {
            $regex: search,
            $options: "i",
          },
        },
        {
          remarks: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const skip =
      (Number(page) - 1) *
      Number(limit);

    const total =
      await TransferHistory.countDocuments(query);

    const transfers =
      await TransferHistory.find(query)
        .populate(
          "productId",
          "name sku mpn brand"
        )
        .populate(
          "fromWarehouseId",
          "warehouseName warehouseCode"
        )
        .populate(
          "toWarehouseId",
          "warehouseName warehouseCode"
        )
        .populate(
          "fromBoxId",
          "boxName boxCode"
        )
        .populate(
          "toBoxId",
          "boxName boxCode"
        )
        .populate(
          "fromStickId",
          "stickName stickCode"
        )
        .populate(
          "toStickId",
          "stickName stickCode"
        )
        .populate(
          "createdBy",
          "name email"
        )
        .sort({
          [sortBy]:
            sortOrder === "asc"
              ? 1
              : -1,
        })
        .skip(skip)
        .limit(Number(limit));

    return res.status(200).json({
      success: true,

      data: transfers,

      pagination: {
        total,

        page: Number(page),

        pages: Math.ceil(
          total / Number(limit)
        ),

        limit: Number(limit),
      },
    });

  } catch (error) {

    console.error(
      "Get Transfer History Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch transfer history.",
      error: error.message,
    });

  }
};

/*
|--------------------------------------------------------------------------
| Get Transfer By Id
|--------------------------------------------------------------------------
*/

exports.getTransferById =
async (req, res) => {

  try {

    const transfer =
      await TransferHistory.findById(
        req.params.id
      )
        .populate("productId")
        .populate("fromWarehouseId")
        .populate("toWarehouseId")
        .populate("fromBoxId")
        .populate("toBoxId")
        .populate("fromStickId")
        .populate("toStickId")
        .populate(
          "createdBy",
          "name email"
        )
        .populate(
          "approvedBy",
          "name email"
        );

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message:
          "Transfer not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: transfer,
    });

  } catch (error) {

    console.error(
      "Get Transfer Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch transfer.",
      error: error.message,
    });

  }

};

/*
|--------------------------------------------------------------------------
| Recent Transfers
|--------------------------------------------------------------------------
*/

exports.getRecentTransfers =
async (req, res) => {

  try {

    const transfers =
      await TransferHistory.find()
        .populate(
          "productId",
          "name sku"
        )
        .populate(
          "fromWarehouseId",
          "warehouseName"
        )
        .populate(
          "toWarehouseId",
          "warehouseName"
        )
        .populate(
          "createdBy",
          "name"
        )
        .sort({
          createdAt: -1,
        })
        .limit(20);

    return res.status(200).json({
      success: true,
      data: transfers,
    });

  } catch (error) {

    console.error(
      "Recent Transfer Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch recent transfers.",
      error: error.message,
    });

  }

};

/*
|--------------------------------------------------------------------------
| Cancel Transfer
|--------------------------------------------------------------------------
*/

exports.cancelTransfer = async (req, res) => {
  try {

    const transfer =
      await TransferHistory.findById(
        req.params.id
      );

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: "Transfer not found.",
      });
    }

    if (transfer.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Transfer already cancelled.",
      });
    }

    transfer.status = "CANCELLED";
    transfer.updatedBy = req.user._id;

    await transfer.save();

    return res.status(200).json({
      success: true,
      message: "Transfer cancelled successfully.",
      data: transfer,
    });

  } catch (error) {

    console.error(
      "Cancel Transfer Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to cancel transfer.",
      error: error.message,
    });

  }
};

/*
|--------------------------------------------------------------------------
| Delete Transfer
|--------------------------------------------------------------------------
*/

exports.deleteTransfer = async (req, res) => {

  try {

    const transfer =
      await TransferHistory.findById(
        req.params.id
      );

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: "Transfer not found.",
      });
    }

    await transfer.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Transfer deleted successfully.",
    });

  } catch (error) {

    console.error(
      "Delete Transfer Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete transfer.",
      error: error.message,
    });

  }

};

/*
|--------------------------------------------------------------------------
| Dashboard Statistics
|--------------------------------------------------------------------------
*/

exports.getTransferDashboardStats =
async (req, res) => {

  try {

    const [
      totalTransfers,
      completed,
      pending,
      cancelled,
      failed,
    ] = await Promise.all([

      TransferHistory.countDocuments(),

      TransferHistory.countDocuments({
        status: "COMPLETED",
      }),

      TransferHistory.countDocuments({
        status: "PENDING",
      }),

      TransferHistory.countDocuments({
        status: "CANCELLED",
      }),

      TransferHistory.countDocuments({
        status: "FAILED",
      }),

    ]);

    return res.status(200).json({

      success: true,

      data: {

        totalTransfers,

        completed,

        pending,

        cancelled,

        failed,

      },

    });

  } catch (error) {

    console.error(
      "Transfer Dashboard Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to load dashboard.",

      error: error.message,

    });

  }

};