const logger = require("../utils/logger");
const Chat = require("../models/Chat");
const Message = require("../models/Message");

module.exports = () => {
  const startChat = async (userId1, userId2) => {
    let chat = await Chat.findOne({ users: { $all: [userId1, userId2] } });
    if (!chat) {
      chat = await Chat.create({ users: [userId1, userId2], messages: [] });
    }
    return chat;
  };

  const sendMessage = async (chatId, senderId, content) => {
    if (!content || !content.trim()) {
      const err = new Error("Message content is required");
      err.statusCode = 400;
      throw err;
    }
    const message = await Message.create({
      chat: chatId,
      sender: senderId,
      content,
    });
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { messages: message._id } },
      { new: true }
    ).populate("messages");
    if (!updatedChat) {
      const err = new Error("Chat not found");
      err.statusCode = 404;
      throw err;
    }
    return updatedChat;
  };

  const listUserChats = async (userId) => {
    return await Chat.find({ users: userId }).populate("messages");
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

  return { startChat, sendMessage, listUserChats, getChatDetails };
};
