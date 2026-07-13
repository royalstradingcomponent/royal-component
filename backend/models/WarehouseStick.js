const mongoose = require("mongoose");

const warehouseStickSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | Relations
    |--------------------------------------------------------------------------
    */

    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
      index: true,
    },

    boxId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WarehouseBox",
      required: true,
      index: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Basic Information
    |--------------------------------------------------------------------------
    */

    stickCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    stickName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    displayName: {
  type: String,
  default: "",
  trim: true,
},

displayOrder: {
  type: Number,
  default: 0,
},

color: {
  type: String,
  default: "#2563eb",
},

icon: {
  type: String,
  default: "package",
},

    /*
    |--------------------------------------------------------------------------
    | Stick Type
    |--------------------------------------------------------------------------
    */

    stickType: {
      type: String,
      enum: [
        "IC_TUBE",
        "IC_TRAY",
        "ESD_BOX",
        "SMALL_BOX",
        "COMPONENT_BOX",
        "CUSTOM",
      ],
      default: "IC_TUBE",
    },

    material: {
  type: String,
  enum: [
    "PLASTIC",
    "PVC",
    "METAL",
    "ESD",
    "CUSTOM",
  ],
  default: "PLASTIC",
},

orientation: {
  type: String,
  enum: [
    "HORIZONTAL",
    "VERTICAL",
  ],
  default: "HORIZONTAL",
},

    /*
    |--------------------------------------------------------------------------
    | Capacity
    |--------------------------------------------------------------------------
    */

    maxCapacity: {
      type: Number,
      default: 25,
      min: 1,
    },

    occupiedQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    freeQuantity: {
      type: Number,
      default: 25,
      min: 0,
    },

    reservedQuantity: {
  type: Number,
  default: 0,
},

availableQuantity: {
  type: Number,
  default: 25,
},

    /*
    |--------------------------------------------------------------------------
    | Physical Information
    |--------------------------------------------------------------------------
    */

    length: {
      type: Number,
      default: 0,
    },

    width: {
      type: Number,
      default: 0,
    },

    height: {
      type: Number,
      default: 0,
    },

    weight: {
      type: Number,
      default: 0,
    },

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    statistics: {
      totalProducts: {
        type: Number,
        default: 0,
      },

      totalQuantity: {
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

      movementCount: {
        type: Number,
        default: 0,
      },

      stockValue: {
  type: Number,
  default: 0,
},

lowStockItems: {
  type: Number,
  default: 0,
},  
    },

    /*
    |--------------------------------------------------------------------------
    | QR / Barcode
    |--------------------------------------------------------------------------
    */

    qrCode: {
      type: String,
      default: "",
    },

    barcode: {
      type: String,
      default: "",
    },

    barcodeImage: {
  type: String,
  default: "",
},

qrImage: {
  type: String,
  default: "",
},

    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    status: {
      type: String,
      enum: [
        "ACTIVE",
        "EMPTY",
        "FULL",
        "DAMAGED",
        "RESERVED",
        "INACTIVE",
      ],
      default: "EMPTY",
      index: true,
    },

    remarks: {
      type: String,
      default: "",
      maxlength: 1000,
    },

    temperature: {
  type: Number,
  default: null,
},

humidity: {
  type: Number,
  default: null,
},

isLocked: {
  type: Boolean,
  default: false,
},

isArchived: {
  type: Boolean,
  default: false,
},


lastStockEntryAt: {
  type: Date,
  default: null,
},

lastTransferAt: {
  type: Date,
  default: null,
},

lastAuditAt: {
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

warehouseStickSchema.index({
  warehouseId: 1,
});

warehouseStickSchema.index({
  boxId: 1,
});

warehouseStickSchema.index({
  warehouseId: 1,
  boxId: 1,
});

warehouseStickSchema.index({
  warehouseId: 1,
  stickCode: 1,
});

warehouseStickSchema.index({
  status: 1,
});

warehouseStickSchema.index({
  createdAt: -1,
});

warehouseStickSchema.index({
  warehouseId: 1,
  boxId: 1,
  stickType: 1,
});

/*
|--------------------------------------------------------------------------
| VIRTUALS
|--------------------------------------------------------------------------
*/

warehouseStickSchema.virtual("utilizationPercent").get(function () {
  if (!this.maxCapacity) return 0;

  return Number(
    (
      (this.occupiedQuantity / this.maxCapacity) *
      100
    ).toFixed(2)
  );
});

warehouseStickSchema.virtual("isFull").get(function () {
  return this.freeQuantity <= 0;
});

warehouseStickSchema.virtual("isEmpty").get(function () {
  return this.occupiedQuantity === 0;
});

/*
|--------------------------------------------------------------------------
| PRE SAVE
|--------------------------------------------------------------------------
*/

warehouseStickSchema.pre("save", function () {

  if (this.occupiedQuantity < 0) {
    this.occupiedQuantity = 0;
  }

  if (this.occupiedQuantity > this.maxCapacity) {
    this.occupiedQuantity = this.maxCapacity;
  }

  this.freeQuantity =
    this.maxCapacity -
    this.occupiedQuantity;

    this.availableQuantity =
  this.freeQuantity -
  this.reservedQuantity;

if (this.availableQuantity < 0) {
  this.availableQuantity = 0;
}

  this.statistics.totalQuantity =
    this.occupiedQuantity;

  this.statistics.occupiedCapacity =
    this.occupiedQuantity;

  this.statistics.freeCapacity =
    this.freeQuantity;

  if (this.occupiedQuantity === 0) {
    this.status = "EMPTY";
  } else if (
    this.occupiedQuantity >= this.maxCapacity
  ) {
    this.status = "FULL";
  } else if (
    this.status !== "DAMAGED" &&
    this.status !== "RESERVED" &&
    this.status !== "INACTIVE"
  ) {
    this.status = "ACTIVE";
  }

  
});

/*
|--------------------------------------------------------------------------
| METHODS
|--------------------------------------------------------------------------
*/

warehouseStickSchema.methods.addQuantity = function (qty = 1) {

  this.occupiedQuantity += qty;

  if (this.occupiedQuantity > this.maxCapacity) {
    this.occupiedQuantity = this.maxCapacity;
  }

  return this.occupiedQuantity;
};

warehouseStickSchema.methods.removeQuantity = function (qty = 1) {

  this.occupiedQuantity -= qty;

  if (this.occupiedQuantity < 0) {
    this.occupiedQuantity = 0;
  }

  return this.occupiedQuantity;
};

warehouseStickSchema.methods.recalculateCapacity = function () {

  this.freeQuantity =
    this.maxCapacity -
    this.occupiedQuantity;

  this.availableQuantity =
    this.freeQuantity -
    this.reservedQuantity;

  if (this.availableQuantity < 0) {
    this.availableQuantity = 0;
  }

  this.statistics.totalQuantity =
    this.occupiedQuantity;

  this.statistics.occupiedCapacity =
    this.occupiedQuantity;

  this.statistics.freeCapacity =
    this.freeQuantity;

  return this.freeQuantity;
};

warehouseStickSchema.methods.activate = function () {
  this.status = "ACTIVE";
  return this.save();
};

warehouseStickSchema.methods.deactivate = function () {
  this.status = "INACTIVE";
  return this.save();
};

warehouseStickSchema.methods.lockStick = function () {
  this.isLocked = true;
  return this.save();
};

warehouseStickSchema.methods.unlockStick = function () {
  this.isLocked = false;
  return this.save();
};

/*
|--------------------------------------------------------------------------
| STATIC METHODS
|--------------------------------------------------------------------------
*/

warehouseStickSchema.statics.getActiveSticks =
function () {
  return this.find({
    status: "ACTIVE",
  });
};

warehouseStickSchema.statics.getBoxSticks =
function (boxId) {
  return this.find({
    boxId,
  }).sort({
    stickCode: 1,
  });
};

warehouseStickSchema.statics.getWarehouseSticks =
function (warehouseId) {
  return this.find({
    warehouseId,
  }).sort({
    createdAt: -1,
  });
};

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

module.exports = mongoose.model(
  "WarehouseStick",
  warehouseStickSchema
);  