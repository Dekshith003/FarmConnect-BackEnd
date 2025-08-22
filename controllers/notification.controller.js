module.exports = function NotificationController({ notificationService }) {
  return {
    // Get all notifications for current user
    getNotifications: async (req, res, next) => {
      try {
        const notifications = await notificationService.getNotifications(
          req.user.id
        );
        res.status(200).json({ notifications });
      } catch (error) {
        next(error);
      }
    },
    // Mark notification as read
    markAsRead: async (req, res, next) => {
      try {
        const notification = await notificationService.markAsRead(
          req.params.id
        );
        res.status(200).json({ notification });
      } catch (error) {
        next(error);
      }
    },
    // Delete notification
    deleteNotification: async (req, res, next) => {
      try {
        await notificationService.deleteNotification(req.params.id);
        res.status(200).json({ message: "Notification deleted" });
      } catch (error) {
        next(error);
      }
    },
  };
};
