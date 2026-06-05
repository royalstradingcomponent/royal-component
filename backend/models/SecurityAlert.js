const mongoose = require("mongoose");

const securityAlertSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "NEW_DEVICE_LOGIN",
        "NEW_IP_LOGIN",
        "MULTIPLE_FAILED_OTP",
        "LOGOUT_ALL_DEVICES",
        "SUSPICIOUS_LOGIN",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    ipAddress: {
      type: String,
      default: "",
    },

    browser: {
      type: String,
      default: "",
    },

    os: {
      type: String,
      default: "",
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   INDEXES
========================= */

securityAlertSchema.index({
  adminId: 1,
  createdAt: -1,
});

module.exports =
  mongoose.models.SecurityAlert ||
  mongoose.model(
    "SecurityAlert",
    securityAlertSchema
  );