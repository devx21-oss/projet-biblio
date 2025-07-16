const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Create notification
router.post('/', notificationController.createNotification);

// Get all notifications
router.get('/', notificationController.getAllNotifications);

// Get one notification by id
router.get('/:id', notificationController.getNotificationById);

// Update notification by id
router.put('/:id', notificationController.updateNotification);

// Delete notification by id
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;