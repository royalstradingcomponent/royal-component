const mongoose = require("mongoose");

const transferHistorySchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | Product
    |--------------------------------------------------------------------------
    */

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Quantity
    |--------------------------------------------------------------------------
    */

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unit: {
      type: String,
      default: "PCS",
      uppercase: true,
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | From Warehouse
    |--------------------------------------------------------------------------
    */

    fromWarehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
      index: true,
    },

    fromBoxId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WarehouseBox",
      required: true,
      index: true,
    },

    fromStickId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WarehouseStick",
      default: null,
      index: true,
    },

    fromLocationType: {
      type: String,
      enum: [
        "STICK",
        "LOOSE",
      ],
      default: "STICK",
    },

    /*
    |--------------------------------------------------------------------------
    | To Warehouse
    |--------------------------------------------------------------------------
    */

    toWarehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
      index: true,
    },

    toBoxId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WarehouseBox",
      required: true,
      index: true,
    },

    toStickId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WarehouseStick",
      default: null,
      index: true,
    },

    toLocationType: {
      type: String,
      enum: [
        "STICK",
        "LOOSE",
      ],
      default: "STICK",
    },

        /*
    |--------------------------------------------------------------------------
    | Transfer Information
    |--------------------------------------------------------------------------
    */

    transferType: {
      type: String,
      enum: [
        "BOX_TO_BOX",
        "STICK_TO_STICK",
        "LOOSE_TO_STICK",
        "STICK_TO_LOOSE",
        "WAREHOUSE_TO_WAREHOUSE",
      ],
      default: "STICK_TO_STICK",
      index: true,
    },

    reason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    remarks: {
      type: String,
      default: "",
      maxlength: 2000,
    },

    /*
    |--------------------------------------------------------------------------
    | Batch Information
    |--------------------------------------------------------------------------
    */

    batchNumber: {
      type: String,
      default: "",
      trim: true,
    },

    lotNumber: {
      type: String,
      default: "",
      trim: true,
    },

    serialNumber: {
      type: String,
      default: "",
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    status: {
      type: String,
      enum: [
        "PENDING",
        "COMPLETED",
        "CANCELLED",
        "FAILED",
      ],
      default: "COMPLETED",
      index: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Approval
    |--------------------------------------------------------------------------
    */

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    /*
    |--------------------------------------------------------------------------
    | Audit
    |--------------------------------------------------------------------------
    */

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/*
|--------------------------------------------------------------------------
| INDEXES
|--------------------------------------------------------------------------
*/

transferHistorySchema.index({
  productId: 1,
});

transferHistorySchema.index({
  fromWarehouseId: 1,
});

transferHistorySchema.index({
  toWarehouseId: 1,
});

transferHistorySchema.index({
  fromBoxId: 1,
});

transferHistorySchema.index({
  toBoxId: 1,
});

transferHistorySchema.index({
  fromStickId: 1,
});

transferHistorySchema.index({
  toStickId: 1,
});

transferHistorySchema.index({
  transferType: 1,
});

transferHistorySchema.index({
  status: 1,
});

transferHistorySchema.index({
  createdBy: 1,
});

transferHistorySchema.index({
  createdAt: -1,
});

transferHistorySchema.index({
  productId: 1,
  createdAt: -1,
});

transferHistorySchema.index({
  fromWarehouseId: 1,
  toWarehouseId: 1,
});

/*
|--------------------------------------------------------------------------
| VIRTUALS
|--------------------------------------------------------------------------
*/

transferHistorySchema.virtual("isCompleted").get(function () {
  return this.status === "COMPLETED";
});

transferHistorySchema.virtual("isPending").get(function () {
  return this.status === "PENDING";
});

transferHistorySchema.virtual("isCancelled").get(function () {
  return this.status === "CANCELLED";
});

/*
|--------------------------------------------------------------------------
| METHODS
|--------------------------------------------------------------------------
*/

transferHistorySchema.methods.completeTransfer =
function () {

  this.status = "COMPLETED";

  this.approvedAt = new Date();

  return this.save();

};

transferHistorySchema.methods.cancelTransfer =
function () {

  this.status = "CANCELLED";

  return this.save();

};

transferHistorySchema.methods.markFailed =
function () {

  this.status = "FAILED";

  return this.save();

};

/*
|--------------------------------------------------------------------------
| STATIC METHODS
|--------------------------------------------------------------------------
*/

transferHistorySchema.statics.getProductHistory =
function (productId) {

  return this.find({
    productId,
  })
    .populate("createdBy", "name")
    .sort({
      createdAt: -1,
    });

};

transferHistorySchema.statics.getWarehouseHistory =
function (warehouseId) {

  return this.find({
    $or: [
      {
        fromWarehouseId: warehouseId,
      },
      {
        toWarehouseId: warehouseId,
      },
    ],
  }).sort({
    createdAt: -1,
  });

};

transferHistorySchema.statics.getRecentTransfers =
function (limit = 20) {

  return this.find()
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
    .limit(limit);

};

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

module.exports = mongoose.model(
  "TransferHistory",
  transferHistorySchema
);