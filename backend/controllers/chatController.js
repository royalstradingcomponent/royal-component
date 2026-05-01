const Chat = require("../models/Chat");
const Order = require("../models/Order");
const { getAutoReply } = require("../utils/supportAnswers");

exports.startChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    let chat = await Chat.findOne({
      user: userId,
      order: orderId,
      isDeleted: false,
    }).populate("order");

    if (!chat) {
      chat = await Chat.create({
        user: userId,
        order: orderId,
        messages: [
          {
            sender: "support",
            message:
              "Hello! Royal Component support is here. You can ask about dispatch, delivery, GST invoice, payment, cancellation, address change, datasheet, alternate part, warranty or bulk quantity.",
          },
        ],
      });

      chat = await Chat.findById(chat._id).populate("order");
    }

    return res.json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("Start chat error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to start chat",
    });
  }
};

exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      user: req.user._id,
      isDeleted: false,
    }).populate("order");

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    return res.json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("Get chat error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load chat",
    });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const chat = await Chat.findOne({
      _id: req.params.chatId,
      user: req.user._id,
      isDeleted: false,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    chat.messages.push({
      sender: "user",
      message: message.trim(),
    });

    const replies = getAutoReply(message.trim());

    replies.forEach((reply) => {
      chat.messages.push({
        sender: "support",
        message: reply,
      });
    });

    await chat.save();

    const updatedChat = await Chat.findById(chat._id).populate("order");

    return res.json({
      success: true,
      chat: updatedChat,
    });
  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

exports.getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      user: req.user._id,
      isDeleted: false,
    })
      .populate("order")
      .sort({ updatedAt: -1 });

    return res.json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error("My chats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load chats",
    });
  }
};