const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const NotificationController = require("../controllers/notification.controller");
const notificationController = new NotificationController();

router.get(
  "/",
  protect,
  notificationController.getNotifications.bind(notificationController)
);
router.post(
  "/read",
  protect,
  notificationController.markAsRead.bind(notificationController)
);

module.exports = router;
