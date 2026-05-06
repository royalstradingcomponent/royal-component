const mongoose = require("mongoose");

const requestItemSchema = new mongoose.Schema(
  {
    componentName: { type: String, required: true, trim: true },
    partNumber: { type: String, trim: true, default: "" },
    brand: { type: String, trim: true, default: "" },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false }
);

const componentRequestSchema = new mongoose.Schema(
  {
    items: {
      type: [requestItemSchema],
      required: true,
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "At least one component is required",
      },
    },

    description: { type: String, trim: true, default: "" },

    datasheetUrls: [{ type: String, default: "" }],
    imageUrls: [{ type: String, default: "" }],

    customerName: { type: String, required: true, trim: true },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    customerPhone: { type: String, trim: true, default: "" },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
  type: String,
  enum: [
    "new",
    "checking",
    "available",
    "quoted",
    "unavailable",
    "closed",
  ],
  default: "new",
},

    adminPrice: { type: Number, default: 0 },
    adminLeadTime: { type: String, default: "" },
    adminNote: { type: String, default: "" },

    customerMessage: {
  type: String,
  default: "",
},

adminContactNumber: {
  type: String,
  default: "",
},

availableItemsNote: {
  type: String,
  default: "",
},

matchedSupplierSources: [
  {
    supplierSource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SupplierSource",
      default: null,
    },
    supplierCompany: { type: String, default: "" },
    componentName: { type: String, default: "" },
    partNumber: { type: String, default: "" },
    brand: { type: String, default: "" },
    purchasePrice: { type: Number, default: 0 },
    moq: { type: Number, default: 1 },
    leadTime: { type: String, default: "" },
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    email: { type: String, default: "" },
    availabilityStatus: { type: String, default: "" },
    isPreferred: { type: Boolean, default: false },
  },
],

  },
  { timestamps: true }
);

componentRequestSchema.index({
  "items.componentName": "text",
  "items.partNumber": "text",
  "items.brand": "text",
  customerEmail: "text",
});

module.exports = mongoose.model("ComponentRequest", componentRequestSchema);