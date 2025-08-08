module.exports = ({ chatService }) => {
  const startChat = async (req, res, next) => {
    try {
      const otherUserId = req.body.userId;
      const chat = await chatService.startChat(req.user.id, otherUserId);
      res.status(201).json(chat);
    } catch (err) {
      next(err);
    }
  };

  const sendMessage = async (req, res, next) => {
    try {
      const { chatId, content } = req.body;
      const updatedChat = await chatService.sendMessage(
        chatId,
        req.user.id,
        content
      );
      res.status(200).json(updatedChat);
    } catch (err) {
      next(err);
    }
  };

  const listUserChats = async (req, res, next) => {
    try {
      const chats = await chatService.listUserChats(req.user.id);
      res.json(chats);
    } catch (err) {
      next(err);
    }
  };

  const getChatDetails = async (req, res, next) => {
    try {
      const chat = await chatService.getChatDetails(req.params.id);
      res.json(chat);
    } catch (err) {
      next(err);
    }
  };

  return { startChat, sendMessage, listUserChats, getChatDetails };
};
