const Notification = require("../models/Notification");
const logger = require("../utils/logger");

module.exports = function NotificationService() {
  return {
    async createNotification(userId, role, type, message, data = {}) {
      try {
        const notification = await Notification.create({
          user: userId,
          role,
          type,
          message,
          data,
        });
        logger.info(`Notification sent to ${role} ID: ${userId}`);
        return notification;
      } catch (error) {
        logger.error(`Error creating notification: ${error.message}`);
        throw error;
      }
    },
    async getNotifications(userId) {
      return Notification.find({ user: userId }).sort({ createdAt: -1 });
    },
    async markAsRead(notificationId) {
      return Notification.findByIdAndUpdate(
        notificationId,
        { read: true },
        { new: true }
      );
    },
    async deleteNotification(notificationId) {
      return Notification.findByIdAndDelete(notificationId);
    },
  };
};
