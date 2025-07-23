const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { auth, authorize } = require('../middlewares/auth');  // تأكد من مسار الملف

// Créer une notification -  'employe'  'admin'
router.post('/', auth, authorize(['employe', 'admin']), notificationController.createNotification);

// Obtenir toutes les notifications -  'employe'  'admin'
router.get('/', auth, authorize(['employe', 'admin']), notificationController.getAllNotifications);

// Obtenir une notification par id -  'employe'  'admin'
router.get('/:id', auth, authorize(['employe', 'admin']), notificationController.getNotificationById);

// Mettre à jour une notification 'employe''admin'
router.put('/:id', auth, authorize(['employe', 'admin']), notificationController.updateNotification);

// Supprimer une notification 'employe' 'admin'
router.delete('/:id', auth, authorize(['employe', 'admin']), notificationController.deleteNotification);

module.exports = router;
