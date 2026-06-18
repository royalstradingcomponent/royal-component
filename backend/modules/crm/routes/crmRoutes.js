const express = require("express");

const router = express.Router();

const {
  getDashboard,
  getConversations,
  getMessages,
  seedData,
} = require("../controllers/crmController");

router.get("/dashboard", getDashboard);

router.get("/conversations", getConversations);

router.get("/messages/:id", getMessages);
router.get("/seed", seedData);

module.exports = router;
