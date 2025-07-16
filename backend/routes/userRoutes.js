const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, authorize } = require('../middlewares/auth'); // صحح المسار هنا

// Routes publiques
router.post('/register', userController.register);
router.post('/login', userController.login);

// Routes protégées, accessibles فقط للـ admins
router.post('/', auth, authorize('admin'), userController.createUser);
router.get('/', auth, authorize('admin'), userController.getAllUsers);
router.put('/:id', auth, authorize('admin'), userController.updateUser);
router.delete('/:id', auth, authorize('admin'), userController.deleteUser);
router.get('/:id', auth, authorize('admin'), userController.getUserById);

module.exports = router;
