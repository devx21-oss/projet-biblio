const Notification = require('../models/Notification');

async function createNotification(req, res) {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getAllNotifications(req, res) {
  try {
    const notifications = await Notification.find()
      .populate('utilisateur', 'nom prenom')
      .populate('lienEntite');
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getNotificationById(req, res) {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('utilisateur', 'nom prenom')
      .populate('lienEntite');
    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateNotification(req, res) {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }
    res.json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteNotification(req, res) {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }
    res.json({ message: 'Notification supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
};