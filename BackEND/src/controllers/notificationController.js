//src/controllers/notificationController.js

const Notification = require("../models/Notification");

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        userId: req.user.id
      },
      {
        isRead: true
      },
      {
        returnDocument: "after"
      }
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notificação não encontrada"
      });
    }

    res.json({
      message: "Notificação marcada como lida",
      notification
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        userId: req.user.id,
        isRead: false
      },
      {
        isRead: true
      }
    );

    res.json({
      message: "Todas as notificações foram marcadas como lidas"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notificação não encontrada"
      });
    }

    res.json({
      message: "Notificação removida com sucesso"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
};