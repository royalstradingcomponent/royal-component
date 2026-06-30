const mongoose = require("mongoose");

const returnReasonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      default: "",
    },

    color: {
      type: String,
      default: "#f97316",
    },

    type: {
  type: String,
  enum: [
    "RETURN",
    "EXCHANGE",
    "BOTH",
    "UI_SETTINGS",
  ],
  default: "BOTH",
},

key: {
  type: String,
  default: "",
},

    subReasons: [
      {
        title: String,
      },
    ],

    uiSettings: {
  heading: {
    type: String,
    default: "",
  },

  subHeading: {
    type: String,
    default: "",
  },

  stepLabels: {
    type: [String],
    default: [],
  },

  uploadImageTitle: {
    type: String,
    default: "",
  },

  uploadImageSubtitle: {
    type: String,
    default: "",
  },

  uploadVideoTitle: {
    type: String,
    default: "",
  },

  uploadVideoSubtitle: {
    type: String,
    default: "",
  },

  guidelineTitle: {
    type: String,
    default: "",
  },

  guidelines: {
    type: [String],
    default: [],
  },

  cancelButtonText: {
    type: String,
    default: "",
  },

  submitButtonText: {
    type: String,
    default: "",
  },
},

    sortOrder: {
      type: Number,
      default: 0,
    },


    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.ReturnReason ||
  mongoose.model("ReturnReason", returnReasonSchema);