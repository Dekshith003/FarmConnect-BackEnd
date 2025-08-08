const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");

const chatService = require("../services/chat.service")();
const chatCtrl = require("../controllers/chat.controller")({ chatService });

// All chat routes require authentication
router.use(protect);

// Start a new chat
router.post("/start", chatCtrl.startChat);

// Send a message
router.post("/send", chatCtrl.sendMessage);

// List my chats
router.get("/", chatCtrl.listUserChats);

// Get chat details by ID
router.get("/:id", chatCtrl.getChatDetails);

module.exports = router;
