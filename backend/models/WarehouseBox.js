const mongoose = require("mongoose");

const warehouseBoxSchema = new mongoose.Schema(
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

    /*
    |--------------------------------------------------------------------------
    | Basic Information
    |--------------------------------------------------------------------------
    */

    boxCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      unique: true,
      index: true,
    },

    boxName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    boxNumber: {
  type: Number,
  default: 0,
},

    /*
|--------------------------------------------------------------------------
| Display
|--------------------------------------------------------------------------
*/

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

image: {
  type: String,
  default: "",
},  
 thumbnail: {
  type: String,
  default: "",
},

gallery: [
  {
    type: String,
  },
],


    /*
    |--------------------------------------------------------------------------
    | Warehouse Location
    |--------------------------------------------------------------------------
    */

    rack: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    shelf: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    row: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },

    column: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },

    floor: {
      type: String,
      default: "GROUND",
      uppercase: true,
    },

    zone: {
  type: String,
  default: "",
  uppercase: true,
},

section: {
  type: String,
  default: "",
  uppercase: true,
},

    /*
    |--------------------------------------------------------------------------
    | Capacity
    |--------------------------------------------------------------------------
    */

    maxStickCapacity: {
      type: Number,
      default: 100,
      min: 0,
    },

    occupiedSticks: {
      type: Number,
      default: 0,
      min: 0,
    },

    freeSticks: {
      type: Number,
      default: 100,
      min: 0,
    },

    availableStickCapacity: {
  type: Number,
  default: 100,
},

reservedSticks: {
  type: Number,
  default: 0,
},  

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    statistics: {
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

      lowStockItems: {
        type: Number,
        default: 0,
      },

      emptySticks: {
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

       totalReservedQuantity: {
  type: Number,
  default: 0,
},

damagedQuantity: {
  type: Number,
  default: 0,
},

stockValue: {
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
    "INACTIVE",
    "FULL",
    "EMPTY",
    "MAINTENANCE",
    "RESERVED",
    "DAMAGED",
  ],
  default: "ACTIVE",
  index: true,
},
    remarks: {
      type: String,
      default: "",
      maxlength: 1500,
    },

/*
|--------------------------------------------------------------------------
| Storage Information
|--------------------------------------------------------------------------
*/

temperature: {
  type: Number,
  default: null,
},

humidity: {
  type: Number,
  default: null,
},

storageType: {
  type: String,
  enum: [
    "IC",
    "RESISTOR",
    "CAPACITOR",
    "TRANSISTOR",
    "MIXED",
    "CUSTOM",
  ],
  default: "IC",
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

warehouseBoxSchema.index({
  warehouseId: 1,
});

warehouseBoxSchema.index({
  warehouseId: 1,
  rack: 1,
  shelf: 1,
});

warehouseBoxSchema.index({
  warehouseId: 1,
  boxCode: 1,
});

warehouseBoxSchema.index({
  status: 1,
});

warehouseBoxSchema.index({
  createdAt: -1,
});

warehouseBoxSchema.index({
  warehouseId: 1,
  rack: 1,
  shelf: 1,
  row: 1,
  column: 1,
});

/*
|--------------------------------------------------------------------------
| VIRTUALS
|--------------------------------------------------------------------------
*/

warehouseBoxSchema.virtual("utilizationPercent").get(function () {
  if (!this.maxStickCapacity) return 0;

  return Number(
    (
      (this.occupiedSticks / this.maxStickCapacity) *
      100
    ).toFixed(2)
  );
});

warehouseBoxSchema.virtual("isFull").get(function () {
  return this.freeSticks <= 0;
});

warehouseBoxSchema.virtual("isEmpty").get(function () {
  return this.occupiedSticks === 0;
});


/*
|--------------------------------------------------------------------------
| PRE SAVE
|--------------------------------------------------------------------------
*/

warehouseBoxSchema.pre("save", function () {

  if (this.occupiedSticks < 0) {
    this.occupiedSticks = 0;
  }

  if (this.occupiedSticks > this.maxStickCapacity) {
    this.occupiedSticks = this.maxStickCapacity;
  }

  this.freeSticks =
    this.maxStickCapacity -
    this.occupiedSticks;

    this.availableStickCapacity =
  this.freeSticks - this.reservedSticks;

if (this.availableStickCapacity < 0) {
  this.availableStickCapacity = 0;
}   

  this.statistics.freeCapacity =
    this.maxStickCapacity -
    this.statistics.occupiedCapacity;

  if (this.occupiedSticks === 0) {
    this.status = "EMPTY";
  } else if (
    this.occupiedSticks >= this.maxStickCapacity
  ) {
    this.status = "FULL";
  } else if (
    this.status !== "MAINTENANCE"
  ) {
    this.status = "ACTIVE";
  }

  
});

/*
|--------------------------------------------------------------------------
| METHODS
|--------------------------------------------------------------------------
*/

warehouseBoxSchema.methods.addStick = function () {

  if (
    this.occupiedSticks >=
    this.maxStickCapacity
  ) {
    return false;
  }

  this.occupiedSticks += 1;

  this.statistics.totalSticks += 1;

  return true;
};

warehouseBoxSchema.methods.removeStick = function () {

  if (this.occupiedSticks <= 0) {
    return false;
  }

  this.occupiedSticks -= 1;

  if (this.statistics.totalSticks > 0) {
    this.statistics.totalSticks -= 1;
  }

  return true;
};

warehouseBoxSchema.methods.recalculateCapacity = function () {

  this.freeSticks =
    this.maxStickCapacity -
    this.occupiedSticks;

  this.availableStickCapacity =
    this.freeSticks -
    this.reservedSticks;

  if (this.availableStickCapacity < 0) {
    this.availableStickCapacity = 0;
  }

  this.statistics.freeCapacity =
    this.maxStickCapacity -
    this.statistics.occupiedCapacity;

  return this.freeSticks;
};
warehouseBoxSchema.methods.activate = function () {
  this.status = "ACTIVE";
  return this.save();
};

warehouseBoxSchema.methods.deactivate = function () {
  this.status = "INACTIVE";
  return this.save();
};

 warehouseBoxSchema.methods.lockBox = function () {
  this.isLocked = true;
  return this.save();
};

warehouseBoxSchema.methods.unlockBox = function () {
  this.isLocked = false;
  return this.save();
};

/*
|--------------------------------------------------------------------------
| STATIC METHODS
|--------------------------------------------------------------------------
*/

warehouseBoxSchema.statics.getActiveBoxes =
  function () {
    return this.find({
      status: "ACTIVE",
    });
  };

warehouseBoxSchema.statics.getWarehouseBoxes =
  function (warehouseId) {
    return this.find({
      warehouseId,
    }).sort({
      rack: 1,
      shelf: 1,
      boxCode: 1,
    });
  };

  warehouseBoxSchema.statics.getBoxesByRack =
function (warehouseId, rack) {

  return this.find({
    warehouseId,
    rack,
  }).sort({
    shelf: 1,
    row: 1,
    column: 1,
  });

};

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

module.exports = mongoose.model(
  "WarehouseBox",
  warehouseBoxSchema
);