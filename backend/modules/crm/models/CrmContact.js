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

    profileImage: {
      type: String,
      default: "",
    },

    tags: [
      {
        type: String,
      },
    ],

    notes: {
      type: String,
      default: "",
    },

    source: {
      type: String,
      enum: [
        "website",
        "whatsapp",
        "manual",
        "facebook",
        "instagram",
      ],
      default: "website",
    },

    status: {
      type: String,
      enum: [
        "new",
        "lead",
        "customer",
        "inactive",
      ],
      default: "new",
    },

    assignedAgent: {
      type: String,
      default: "",
    },

    customFields: [
      {
        key: String,
        value: String,
      },
    ],

    isBlocked: {
      type: Boolean,
      default: false,
    },

    lastMessageAt: {
      type: Date,
    },

    leadScore: {
  type: Number,
  default: 50,
},

customerValue: {
  type: Number,
  default: 0,
},

lastActivity: {
  type: String,
  default: "Contact Created",
},

activities: [
  {
    title: String,

    description: String,

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
],

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CrmContact",
  crmContactSchema
);