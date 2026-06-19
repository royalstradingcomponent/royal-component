const express = require("express");

const router = express.Router();

const {
  getDashboard,
  getConversations,
  getMessages,
  sendMessage,
  seedData,

  
} = require("../controllers/crmController");

router.get("/dashboard", getDashboard);

router.get("/conversations", getConversations);

router.get("/messages/:id", getMessages);
router.get("/seed", seedData);
router.post("/send-message", sendMessage);



module.exports = router;
