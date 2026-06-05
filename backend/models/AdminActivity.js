const mongoose = require("mongoose");

const adminActivitySchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    adminName: {
      type: String,
      default: "",
      index: true,
    },

    adminEmail: {
      type: String,
      default: "",
      index: true,
    },

    action: {
      type: String,
      required: true,
      index: true,
    },

    module: {
      type: String,
      required: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
    },

    targetId: {
      type: String,
      default: "",
    },

    sessionId: {
      type: String,
      default: "",
      index: true,
    },

    details: {
      type: Object,
      default: {},
    },

    ipAddress: {
      type: String,
      default: "",
      index: true,
    },

    browser: {
      type: String,
      default: "",
    },

    browserVersion: {
      type: String,
      default: "",
    },

    os: {
      type: String,
      default: "",
    },

    osVersion: {
      type: String,
      default: "",
    },

    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

adminActivitySchema.index({
  adminId: 1,
  createdAt: -1,
});

adminActivitySchema.index({
  action: 1,
  module: 1,
});

module.exports =
  mongoose.models.AdminActivity ||
  mongoose.model(
    "AdminActivity",
    adminActivitySchema
  );