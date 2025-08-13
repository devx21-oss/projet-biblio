const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { auth, authorize } = require('../middlewares/auth');  // تأكد من مسار الملف

// Créer une notification - employé / admin
router.post('/', auth, authorize(['employe', 'admin']), notificationController.createNotification);

// 📌 Nouvel endpoint : Obtenir mes notifications (étudiant ou autre)
router.get('/me', auth, notificationController.getAllNotifications);

// Obtenir toutes les notifications (admin / employé)
router.get('/', auth, authorize(['employe', 'admin']), notificationController.getAllNotifications);

// Obtenir une notification par id (admin / employé)
router.get('/:id', auth, authorize(['employe', 'admin']), notificationController.getNotificationById);

// Mettre à jour une notification (admin / employé)
router.put('/:id', auth, authorize(['employe', 'admin']), notificationController.updateNotification);

// Supprimer une notification (admin / employé)
router.delete('/:id', auth, authorize(['employe', 'admin']), notificationController.deleteNotification);

module.exports = router;
