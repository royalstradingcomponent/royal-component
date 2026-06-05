const mongoose = require("mongoose");

const auditTrailSchema = new mongoose.Schema(
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
    },

    module: {
      type: String,
      required: true,
      index: true,
    },

    action: {
      type: String,
      enum: [
        "CREATE",
        "UPDATE",
        "DELETE",
        "VIEW",
      ],
      required: true,
      index: true,
    },

    targetId: {
      type: String,
      default: "",
      index: true,
    },

    oldData: {
      type: Object,
      default: {},
    },

    newData: {
      type: Object,
      default: {},
    },

    changedFields: [
      {
        field: String,
        oldValue: mongoose.Schema.Types.Mixed,
        newValue: mongoose.Schema.Types.Mixed,
      },
    ],

    ipAddress: {
      type: String,
      default: "",
    },

    sessionId: {
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

auditTrailSchema.index({
  module: 1,
  action: 1,
  createdAt: -1,
});

module.exports =
  mongoose.models.AuditTrail ||
  mongoose.model(
    "AuditTrail",
    auditTrailSchema
  );