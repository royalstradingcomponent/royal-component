const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema(
  {
    warehouseCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    managerName: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    address: {
      line1: {
        type: String,
        default: "",
      },

      line2: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        default: "",
      },

      state: {
        type: String,
        default: "",
      },

      country: {
        type: String,
        default: "India",
      },

      pincode: {
        type: String,
        default: "",
      },
    },

    settings: {
      allowNegativeStock: {
        type: Boolean,
        default: false,
      },

      enableQRCode: {
        type: Boolean,
        default: true,
      },

      enableBarcode: {
        type: Boolean,
        default: true,
      },
    },

    statistics: {
      totalBoxes: {
        type: Number,
        default: 0,
      },

      totalSticks: {
        type: Number,
        default: 0,
      },

      totalComponents: {
        type: Number,
        default: 0,
      },

      totalQuantity: {
        type: Number,
        default: 0,
      },

      totalCapacity: {
        type: Number,
        default: 0,
      },

      occupiedCapacity: {
        type: Number,
        default: 0,
      },

      freeCapacity: {
        type: Number,
        default: 0,
      },

      lowStockItems: {
        type: Number,
        default: 0,
      },
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
      index: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
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

warehouseSchema.index({
  warehouseCode: 1,
});

warehouseSchema.index({
  name: 1,
});

warehouseSchema.index({
  status: 1,
});

warehouseSchema.index({
  createdAt: -1,
});

/*
|--------------------------------------------------------------------------
| VIRTUALS
|--------------------------------------------------------------------------
*/

warehouseSchema.virtual("utilizationPercent").get(function () {
  if (!this.statistics.totalCapacity) return 0;

  return Number(
    (
      (this.statistics.occupiedCapacity /
        this.statistics.totalCapacity) *
      100
    ).toFixed(2)
  );
});

/*
|--------------------------------------------------------------------------
| PRE SAVE
|--------------------------------------------------------------------------
*/

warehouseSchema.pre("save", function () {

  this.warehouseCode = this.warehouseCode.toUpperCase();

  if (
    this.statistics.totalCapacity <
    this.statistics.occupiedCapacity
  ) {
    this.statistics.occupiedCapacity =
      this.statistics.totalCapacity;
  }

  this.statistics.freeCapacity =
    this.statistics.totalCapacity -
    this.statistics.occupiedCapacity;

});

/*
|--------------------------------------------------------------------------
| METHODS
|--------------------------------------------------------------------------
*/

warehouseSchema.methods.recalculateCapacity =
  function () {
    this.statistics.freeCapacity =
      this.statistics.totalCapacity -
      this.statistics.occupiedCapacity;

    return this.statistics.freeCapacity;
  };

warehouseSchema.methods.activate =
  function () {
    this.status = "ACTIVE";
  };

warehouseSchema.methods.deactivate =
  function () {
    this.status = "INACTIVE";
  };

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

module.exports = mongoose.model(
  "Warehouse",
  warehouseSchema
);