const mongoose = require("mongoose");

/* =====================================================
   CONSTANTS
===================================================== */
const ITEM_STATUS = [
  "Order Placed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const EXCHANGE_STATUS = [
  "Not Requested",
  "Requested",
  "Approved",
  "Rejected",
  "Pickup Scheduled",
  "Picked Up",
  "Quality Checking",
  "Replacement Packed",
  "Replacement Shipped",
  "Out for Delivery",
  "Completed",
];

const requestHistorySchema = new mongoose.Schema(
  {
    status: { type: String, default: "" },
    message: { type: String, default: "" },
    date: { type: Date, default: Date.now },
    by: {
      type: String,
      enum: ["Customer", "Admin", "System"],
      default: "System",
    },
  },
  { _id: false }
);

const pickupAddressSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    addressLine1: { type: String, default: "" },
    addressLine2: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    country: { type: String, default: "India" },
  },
  { _id: false }
);

/* =====================================================
   ORDER ITEM SCHEMA
===================================================== */
const orderProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    name: { type: String, required: true, trim: true },
    brand: { type: String, default: "Generic", trim: true },
    sku: { type: String, default: "", trim: true },
    mpn: { type: String, default: "", trim: true },
    hsnCode: { type: String, default: "", trim: true },
    img: { type: String, default: "", trim: true },
    slug: { type: String, default: "", trim: true },

    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, default: 0 },
    gstPercent: { type: Number, default: 18 },

    lineSubtotal: { type: Number, required: true },
    gstAmount: { type: Number, default: 0 },
    lineTotal: { type: Number, required: true },

    /* ================= STATUS ================= */
    itemStatus: {
      type: String,
      enum: ITEM_STATUS,
      default: "Order Placed",
      index: true,
    },

    itemStatusHistory: [
      {
        status: { type: String, default: "Order Placed" },
        message: { type: String, default: "Order created" },
        date: { type: Date, default: Date.now },
      },
    ],

    /* ================= ITEM CANCELLATION ================= */
    cancellation: {
      cancelReason: { type: String, default: "" },
      cancelComment: { type: String, default: "" },
      cancelledAt: { type: Date, default: null },
    },
  },
  { _id: true }
);

/* =====================================================
   ORDER SCHEMA
===================================================== */
const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* ================= USER SNAPSHOT ================= */
    userInfo: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      alternatePhone: { type: String, default: "" },
      email: { type: String, default: "" },

      companyName: { type: String, default: "" },
      gstNumber: { type: String, default: "" },

      addressLine1: { type: String, required: true },
      addressLine2: { type: String, default: "" },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: "India" },
    },

    /* ================= ITEMS ================= */
    products: {
      type: [orderProductSchema],
      default: [],
    },

    /* ================= PRICING ================= */
    pricing: {
      subtotal: { type: Number, default: 0 },
      productDiscount: { type: Number, default: 0 },
      couponDiscount: { type: Number, default: 0 },
      shippingCharge: { type: Number, default: 0 },
      platformFee: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      totalAmount: { type: Number, default: 0 },
      itemCount: { type: Number, default: 0 },
    },

    /* ================= PAYMENT ================= */
    payment: {
      method: {
        type: String,
       enum: ["RAZORPAY", "COD", "BANK_TRANSFER"],
        default: "RAZORPAY",
      },


      status: {
        type: String,
        enum: [
          "Pending",
          "Paid",
          "Failed",
          "Refund Pending",
          "Refund Processing",
          "Refunded",
        ],
        default: "Pending",
      },

      paymentId: { type: String, default: "" },
      transactionId: { type: String, default: "" },

      razorpayOrderId: {
        type: String,
        default: "",
      },

      razorpayPaymentId: {
        type: String,
        default: "",
      },

      razorpaySignature: {
        type: String,
        default: "",
      },

      amountPaid: { type: Number, default: 0 },
      paidAt: { type: Date, default: null },

      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      verifiedAt: { type: Date, default: null },
      adminNote: { type: String, default: "" },

      paymentChanged: { type: Boolean, default: false },
      paymentChangedAt: { type: Date, default: null },
    },

    /* ================= SHIPMENT ================= */
    shipment: {
      trackingId: { type: String, default: "" },
      courier: { type: String, default: "" },
      trackingUrl: { type: String, default: "" },
      estimatedDelivery: { type: Date, default: null },
      shippedAt: { type: Date, default: null },
      deliveredAt: { type: Date, default: null },
    },

    /* ================= ORDER STATUS ================= */
    orderStatus: {
      type: String,
      enum: ITEM_STATUS,
      default: "Order Placed",
      index: true,
    },

    timeline: [
      {
        status: {
          type: String,
        },

        message: {
          type: String,
        },

        time: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    /* ================= ORDER LEVEL CANCEL ================= */
    cancellation: {
      cancelReason: { type: String, default: "" },
      cancelComment: { type: String, default: "" },
      cancelledAt: { type: Date, default: null },
    },

    refund: {
      status: {
        type: String,
        enum: ["Not Requested", "Requested", "Approved", "Rejected", "Processing", "Refunded"],
        default: "Not Requested",
        index: true,
      },

      amount: { type: Number, default: 0 },

      reason: { type: String, default: "" },
      comment: { type: String, default: "" },

      method: {
        type: String,
        enum: ["RAZORPAY", "COD"],
        default: "RAZORPAY",
      },

      upi: {
        upiId: { type: String, default: "" },
        phone: { type: String, default: "" },
      },

      bank: {
        accountHolderName: { type: String, default: "" },
        accountNumber: { type: String, default: "" },
        ifsc: { type: String, default: "" },
        bankName: { type: String, default: "" },
      },

      card: {
        last4: { type: String, default: "" },
        transactionId: { type: String, default: "" },
      },

      admin: {
        note: { type: String, default: "" },
        processedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        refundReferenceId: { type: String, default: "" },
      },

      requestedAt: { type: Date, default: null },
      approvedAt: { type: Date, default: null },
      rejectedAt: { type: Date, default: null },
      processedAt: { type: Date, default: null },
      refundedAt: { type: Date, default: null },

      history: [
        {
          status: { type: String, default: "" },
          message: { type: String, default: "" },
          date: { type: Date, default: Date.now },
        },
      ],
    },
   /* ================= RETURN ================= */

/* ================= RETURN ================= */
returnRequest: {
  status: {
    type: String,
    enum: [
      "Not Requested",
      "Requested",
      "Approved",
      "Rejected",
      "Pickup Scheduled",
      "Picked Up",
      "Quality Checking",
      "Refund Approved",
      "Completed",
    ],
    default: "Not Requested",
    index: true,
  },

  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },

  reasonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ReturnReason",
    default: null,
  },

  reasonTitle: { type: String, default: "" },
  subReason: { type: String, default: "" },
  description: { type: String, default: "" },
  comment: { type: String, default: "" },
  adminRemark: { type: String, default: "" },

  customerMessage: { type: String, default: "" },
invalidFields: [{ type: String, default: "" }],

  evidence: {
    photos: [{ type: String, default: "" }],
    videos: [{ type: String, default: "" }],
  },

  refundPreference: {
  method: {
    type: String,
    enum: ["", "BANK", "WALLET"],
    default: "",
  },
  accountHolder: { type: String, default: "" },
  bankName: { type: String, default: "" },
  accountNumber: { type: String, default: "" },
  ifsc: { type: String, default: "" },
  upi: { type: String, default: "" },
  walletStatus: { type: String, default: "" },
  walletValidityMonths: { type: Number, default: 0 },
},

  adminReview: {
    type: new mongoose.Schema(
      {
        reviewedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
        reviewNote: { type: String, default: "" },
        reviewedAt: { type: Date, default: null },
      },
      { _id: false }
    ),
    default: () => ({}),
  },

  requestedAt: { type: Date, default: null },
  approvedAt: { type: Date, default: null },
  rejectedAt: { type: Date, default: null },
  pickupScheduledAt: { type: Date, default: null },
  pickedUpAt: { type: Date, default: null },
  qualityCheckedAt: { type: Date, default: null },
refundApprovedAt: { type: Date, default: null },
completedAt: { type: Date, default: null },
updatedAt: { type: Date, default: null },

  history: { type: [requestHistorySchema], default: [] },
},
/* ================= EXCHANGE ================= */
exchange: {
  status: {
    type: String,
    enum: EXCHANGE_STATUS,
    default: "Not Requested",
    index: true,
  },

  itemId: { type: mongoose.Schema.Types.ObjectId, default: null },

  reasonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ReturnReason",
    default: null,
  },

  reasonTitle: { type: String, default: "" },
  subReason: { type: String, default: "" },
  description: { type: String, default: "" },
  comment: { type: String, default: "" },

  replacementSku: { type: String, default: "" },
  replacementProductName: { type: String, default: "" },

  pickupAddress: {
    type: pickupAddressSchema,
    default: () => ({}),
  },

  pickupShipment: {
  type: new mongoose.Schema(
    {
      courier: { type: String, default: "" },
      trackingId: { type: String, default: "" },
      trackingUrl: { type: String, default: "" },
    },
    { _id: false }
  ),
  default: () => ({}),
},

replacementShipment: {
  type: new mongoose.Schema(
    {
      courier: { type: String, default: "" },
      trackingId: { type: String, default: "" },
      trackingUrl: { type: String, default: "" },
      estimatedDelivery: { type: Date, default: null },
    },
    { _id: false }
  ),
  default: () => ({}),
},
  evidence: {
    photos: [{ type: String, default: "" }],
    videos: [{ type: String, default: "" }],
  },

adminReview: {
  type: new mongoose.Schema(
    {
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      reviewNote: { type: String, default: "" },
      reviewedAt: { type: Date, default: null },
    },
    { _id: false }
  ),
  default: () => ({}),
},

  requestedAt: { type: Date, default: null },
  approvedAt: { type: Date, default: null },
  rejectedAt: { type: Date, default: null },
  pickupScheduledAt: { type: Date, default: null },
  pickedUpAt: { type: Date, default: null },
  qualityCheckedAt: { type: Date, default: null },
  replacementPackedAt: { type: Date, default: null },
  replacementShippedAt: { type: Date, default: null },
  outForDeliveryAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },

  history: { type: [requestHistorySchema], default: [] },
},
    canEditAddress: { type: Boolean, default: true },
    canEditPhone: { type: Boolean, default: true },

    note: { type: String, default: "" },
    invoiceNumber: { type: String, default: "" },
  },
  { timestamps: true }
);

/* =====================================================
   INDEXES (IMPORTANT FOR PRODUCTION)
===================================================== */
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ "products.sku": 1 });
orderSchema.index({ "refund.status": 1 });

/* =====================================================
   EXPORT
===================================================== */
module.exports =
  mongoose.models.Order || mongoose.model("Order", orderSchema);