const mongoose = require("mongoose");

const crmMessageSchema =
  new mongoose.Schema(
    {
      conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CrmConversation",
        required: true,
      },

      contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CrmContact",
      },

      direction: {
        type: String,
        enum: [
          "incoming",
          "outgoing",
        ],
        required: true,
      },

      type: {
        type: String,
        enum: [
          "text",
          "image",
          "document",
          "audio",
          "video",
        ],
        default: "text",
      },

      message: {
        type: String,
        default: "",
      },

      mediaUrl: {
        type: String,
        default: "",
      },

      status: {
        type: String,
        default: "sent",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "CrmMessage",
  crmMessageSchema
);