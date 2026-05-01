const express = require("express");
const router = express.Router();

const {
  startChat,
  getChatById,
  sendMessage,
  getMyChats,
} = require("../controllers/chatController");

const { protect } = require("../middleware/authMiddleware");

router.post("/start/:orderId", protect, startChat);
router.get("/my-chats", protect, getMyChats);
router.get("/:chatId", protect, getChatById);
router.post("/:chatId/message", protect, sendMessage);

module.exports = router;