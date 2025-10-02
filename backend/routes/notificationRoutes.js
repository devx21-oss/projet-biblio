const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { auth, authorize } = require('../middlewares/auth');  // تأكد من مسار الملف

// ➕ Créer une notification (admin / employé)
router.post('/', auth, authorize(['employe', 'admin']), notificationController.createNotification);

// 📌 Mes notifications (pour utilisateur connecté)
router.get("/me", auth, notificationController.getAllNotifications);

// 🔍 Toutes les notifications (admin / employé)
router.get('/', auth, authorize(['employe', 'admin']), notificationController.getAllNotifications);

// 🔍 Notification par ID (admin / employé)
router.get('/:id', auth, authorize(['employe', 'admin']), notificationController.getNotificationById);

// ✏️ Mettre à jour notification (admin / employé)
router.put('/:id', auth, authorize(['employe', 'admin']), notificationController.updateNotification);

// ❌ Supprimer notification (admin / employé)
router.delete('/:id', auth, authorize(['employe', 'admin']), notificationController.deleteNotification);

module.exports = router;