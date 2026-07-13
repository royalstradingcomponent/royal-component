const mongoose = require("mongoose");

const stockLocationSchema = new mongoose.Schema(
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
    | Warehouse Location
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

    stickId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WarehouseStick",
      default: null,
      index: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Stock Information
    |--------------------------------------------------------------------------
    */

    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    reservedQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    availableQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    damagedQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    /*
    |--------------------------------------------------------------------------
    | Batch
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
    | Supplier
    |--------------------------------------------------------------------------
    */

    supplierSourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SupplierSource",
      default: null,
    },

    supplierName: {
  type: String,
  default: "",
},

supplierInvoiceNo: {
  type: String,
  default: "",
},

purchaseOrderNo: {
  type: String,
  default: "",
},

    purchasePrice: {
      type: Number,
      default: 0,
    },

    sellingPrice: {
      type: Number,
      default: 0,
    },

    mrp: {
  type: Number,
  default: 0,
},

gstPercent: {
  type: Number,
  default: 18,
},

currency: {
  type: String,
  default: "INR",
},

    /*
    |--------------------------------------------------------------------------
    | Manufacturing
    |--------------------------------------------------------------------------
    */

    manufacturingDate: {
      type: Date,
      default: null,
    },

    expiryDate: {
      type: Date,
      default: null,
    },

    receivedDate: {
  type: Date,
  default: Date.now,
},

lastMovementDate: {
  type: Date,
  default: null,
},

    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    status: {
      type: String,
      enum: [
        "IN_STOCK",
        "LOW_STOCK",
        "OUT_OF_STOCK",
        "RESERVED",
        "DAMAGED",
      ],
      default: "IN_STOCK",
      index: true,
    },

    remarks: {
      type: String,
      default: "",
      maxlength: 1000,
    },

    locationType: {
  type: String,
  enum: [
    "STICK",
    "LOOSE",
  ],
  default: "STICK",
},

isLocked: {
  type: Boolean,
  default: false,
},

isArchived: {
  type: Boolean,
  default: false,
},

qrCode: {
  type: String,
  default: "",
},

barcode: {
  type: String,
  default: "",
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

stockLocationSchema.index({
  warehouseId: 1,
});

stockLocationSchema.index({
  boxId: 1,
});

stockLocationSchema.index({
  stickId: 1,
});

stockLocationSchema.index({
  productId: 1,
});

stockLocationSchema.index({
  warehouseId: 1,
  boxId: 1,
  stickId: 1,
  productId: 1,
});

stockLocationSchema.index({
  status: 1,
});

stockLocationSchema.index({
  batchNumber: 1,
});

stockLocationSchema.index({
  lotNumber: 1,
});

stockLocationSchema.index({
  createdAt: -1,
});

stockLocationSchema.index({
  warehouseId: 1,
  productId: 1,
  status: 1,
});

stockLocationSchema.index({
  productId: 1,
  batchNumber: 1,
});

/*
|--------------------------------------------------------------------------
| VIRTUALS
|--------------------------------------------------------------------------
*/

stockLocationSchema.virtual("stockValue").get(function () {
  return Number(
    (this.quantity * this.purchasePrice).toFixed(2)
  );
});

stockLocationSchema.virtual("availableStock").get(function () {
  return (
    this.quantity -
    this.reservedQuantity -
    this.damagedQuantity
  );
});

/*
|--------------------------------------------------------------------------
| PRE SAVE
|--------------------------------------------------------------------------
*/

stockLocationSchema.pre("save", function () {

  if (this.quantity < 0) {
    this.quantity = 0;
  }

  if (this.reservedQuantity > this.quantity) {
    this.reservedQuantity = this.quantity;
  }

  if (this.damagedQuantity > this.quantity) {
    this.damagedQuantity = this.quantity;
  }

  this.availableQuantity =
    this.quantity -
    this.reservedQuantity -
    this.damagedQuantity;
    
    if (this.availableQuantity < 0) {
  this.availableQuantity = 0;
}

this.lastMovementDate = new Date();

  

  if (this.quantity === 0) {
    this.status = "OUT_OF_STOCK";
  } else if (this.availableQuantity <= 5) {
    this.status = "LOW_STOCK";
  } else if (this.reservedQuantity > 0) {
    this.status = "RESERVED";
  } else if (this.damagedQuantity > 0) {
    this.status = "DAMAGED";
  } else {
    this.status = "IN_STOCK";
  }

 
});

/*
|--------------------------------------------------------------------------
| METHODS
|--------------------------------------------------------------------------
*/

stockLocationSchema.methods.addStock = function (qty = 0) {

  this.quantity += qty;

  return this.quantity;
};

stockLocationSchema.methods.removeStock = function (qty = 0) {

  this.quantity -= qty;

  if (this.quantity < 0) {
    this.quantity = 0;
  }

  return this.quantity;
};

stockLocationSchema.methods.reserveStock = function (qty = 0) {

  this.reservedQuantity += qty;

  if (this.reservedQuantity > this.quantity) {
    this.reservedQuantity = this.quantity;
  }

  return this.reservedQuantity;
};

stockLocationSchema.methods.releaseReservedStock =
function (qty = 0) {

  this.reservedQuantity -= qty;

  if (this.reservedQuantity < 0) {
    this.reservedQuantity = 0;
  }

  return this.reservedQuantity;
};

stockLocationSchema.methods.markDamaged =
function (qty = 0) {

  this.damagedQuantity += qty;

  if (this.damagedQuantity > this.quantity) {
    this.damagedQuantity = this.quantity;
  }

  return this.damagedQuantity;
};

stockLocationSchema.methods.restoreDamaged =
function (qty = 0) {

  this.damagedQuantity -= qty;

  if (this.damagedQuantity < 0) {
    this.damagedQuantity = 0;
  }

  return this.damagedQuantity;
};

/*
|--------------------------------------------------------------------------
| STATIC METHODS
|--------------------------------------------------------------------------
*/

stockLocationSchema.statics.getProductLocations =
function (productId) {
  return this.find({
    productId,
  })
    .populate("warehouseId")
    .populate("boxId")
    .populate("stickId");
};

stockLocationSchema.statics.getBoxStock =
function (boxId) {
  return this.find({
    boxId,
  }).populate("productId");
};

stockLocationSchema.statics.getStickStock =
function (stickId) {
  return this.find({
    stickId,
  }).populate("productId");
};

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

module.exports = mongoose.model(
  "StockLocation",
  stockLocationSchema
);