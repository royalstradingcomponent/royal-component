const mongoose = require("mongoose");

const crmConversationSchema =
  new mongoose.Schema(
    {
      contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CrmContact",
        required: true,
      },

      channel: {
        type: String,
        default: "whatsapp",
      },

      status: {
        type: String,
        enum: [
          "open",
          "closed",
          "pending",
        ],
        default: "open",
      },

      assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },

      unreadCount: {
        type: Number,
        default: 0,
      },

      lastMessage: {
        type: String,
        default: "",
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
  "CrmConversation",
  crmConversationSchema
);