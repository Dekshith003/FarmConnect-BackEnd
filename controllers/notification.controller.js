// Notification Controller
class NotificationController {
  async getNotifications(req, res, next) {
    // Stub: return notifications for user
    try {
      res.json({ notifications: [] });
    } catch (err) {
      next(err);
    }
  }

  async markAsRead(req, res, next) {
    // Stub: mark notification as read
    try {
      res.json({ message: "Marked as read (stub)" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = NotificationController;
