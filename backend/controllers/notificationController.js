const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// ➕ Créer une notification
async function createNotification(req, res) {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// 📌 Obtenir toutes les notifications de l'utilisateur connecté (pagination)
async function getAllNotifications(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};
    if (!req.user.role || req.user.role === 'student') {
      filter = { utilisateur: req.user.id };
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('utilisateur', 'nom prenom');

    // Populate dynamique selon typeEntite
    for (const notif of notifications) {
      if (notif.typeEntite && mongoose.Types.ObjectId.isValid(notif.lienEntite)) {
        await notif.populate({
          path: 'lienEntite',
          model: notif.typeEntite,
          strictPopulate: false,
        });
      }
    }

    const total = await Notification.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({ notifications, totalPages, currentPage: page });
  } catch (error) {
    console.error("❌ Erreur getAllNotifications:", error);
    res.status(500).json({ message: error.message });
  }
}

// 🔍 Obtenir notification par ID
async function getNotificationById(req, res) {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('utilisateur', 'nom prenom');

    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    if (notification.typeEntite && mongoose.Types.ObjectId.isValid(notification.lienEntite)) {
      await notification.populate({
        path: 'lienEntite',
        model: notification.typeEntite,
        strictPopulate: false,
      });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ✏️ Update notification
async function updateNotification(req, res) {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }
    res.json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// ❌ Delete notification
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