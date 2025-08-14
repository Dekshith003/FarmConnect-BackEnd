const logger = require("../utils/logger");
const Chat = require("../models/Chat");
const Message = require("../models/Message");

module.exports = () => {
  const startChat = async (userId1, userId2) => {
    // Validate both user IDs are provided
    if (!userId1 || !userId2 || userId1.toString() === userId2.toString()) {
      throw new Error("Both distinct user IDs are required to start a chat");
    }
    let chat = await Chat.findOne({
      participants: { $all: [userId1, userId2] },
    });
    if (!chat) {
      chat = await Chat.create({
        participants: [userId1, userId2],
        messages: [],
      });
    }
    return chat;
  };

  const sendMessage = async (chatId, senderId, content) => {
    if (!content || !content.trim()) {
      const err = new Error("Message content is required");
      err.statusCode = 400;
      throw err;
    }
    // Find chat and participants
    const chat = await Chat.findById(chatId);
    if (!chat) {
      const err = new Error("Chat not found");
      err.statusCode = 404;
      throw err;
    }
    // Debug log for chat document
    if (logger) {
      logger.info("Chat document for sendMessage", {
        chatId,
        participants: chat.participants,
        users: chat.users,
      });
    }
    // Determine receiverId
    let receiverId = null;
    // Prefer 'participants' array (current model)
    if (Array.isArray(chat.participants)) {
      if (chat.participants.length > 1) {
        receiverId = chat.participants.find(
          (u) => u.toString() !== senderId.toString()
        );
      } else if (chat.participants.length === 1) {
        receiverId = chat.participants[0];
      }
    }
    // Fallback to 'users' array if present
    if (!receiverId && Array.isArray(chat.users)) {
      if (chat.users.length > 1) {
        receiverId = chat.users.find(
          (u) => u.toString() !== senderId.toString()
        );
      } else if (chat.users.length === 1) {
        receiverId = chat.users[0];
      }
    }
    // If still not found, fallback to senderId (self-message)
    if (!receiverId) {
      receiverId = senderId;
    }
    // For roles, you may need to fetch user models. For now, set as 'Unknown'.
    const senderRole = "Unknown";
    const receiverRole = "Unknown";
    const message = await Message.create({
      senderId,
      receiverId,
      senderRole,
      receiverRole,
      message: content,
    });
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { messages: message._id } },
      { new: true }
    ).populate("messages");
    return updatedChat;
  };

  const listUserChats = async (userId) => {
    return await Chat.find({ participants: userId }).populate("messages");
  };

  const getChatDetails = async (chatId) => {
    const chat = await Chat.findById(chatId).populate("messages");
    if (!chat) {
      const err = new Error("Chat not found");
      err.statusCode = 404;
      throw err;
    }
    return chat;
  };

  const getChatHistory = async (chatId) => {
    // Return all messages for a chat, sorted by creation time
    const chat = await Chat.findById(chatId).populate({
      path: "messages",
      options: { sort: { createdAt: 1 } },
    });
    if (!chat) {
      const err = new Error("Chat not found");
      err.statusCode = 404;
      throw err;
    }
    return chat.messages;
  };

  return {
    startChat,
    sendMessage,
    listUserChats,
    getChatDetails,
    getChatHistory,
  };
};
