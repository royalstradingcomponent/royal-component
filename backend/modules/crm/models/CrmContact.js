const mongoose = require("mongoose");

const crmContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      default: "",
    },

    company: {
      type: String,
      default: "",
    },

    tags: [
      {
        type: String,
      },
    ],

    source: {
      type: String,
      default: "website",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    lastMessageAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CrmContact",
  crmContactSchema
);