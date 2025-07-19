const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { auth, authorize } = require('../middlewares/auth');  // تأكد من مسار الملف

// Créer une notification - فقط 'employe' أو 'admin'
router.post('/', auth, authorize(['employe', 'admin']), notificationController.createNotification);

// Obtenir toutes les notifications - فقط 'employe' أو 'admin'
router.get('/', auth, authorize(['employe', 'admin']), notificationController.getAllNotifications);

// Obtenir une notification par id - فقط 'employe' أو 'admin'
router.get('/:id', auth, authorize(['employe', 'admin']), notificationController.getNotificationById);

// Mettre à jour une notification - فقط 'employe' أو 'admin'
router.put('/:id', auth, authorize(['employe', 'admin']), notificationController.updateNotification);

// Supprimer une notification - فقط 'employe' أو 'admin'
router.delete('/:id', auth, authorize(['employe', 'admin']), notificationController.deleteNotification);

module.exports = router;
