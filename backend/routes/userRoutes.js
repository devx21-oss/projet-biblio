const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Public routes
router.post('/register', upload.single('photo'), userController.register);
router.post('/login', userController.login);

router.put('/me', auth, upload.single('photo'), userController.editProfile);
router.get("/me", auth, userController.getMyProfile);

// Admin routes
router.post('/', auth, authorize('admin'), upload.single('photo'), userController.createUser);
router.get('/', auth, authorize(['admin', 'supplier']), userController.getUsersByRole);
router.get('/:id', auth, authorize('admin'), userController.getUserById);
router.put('/:id', auth, authorize('admin'), upload.single('photo'), userController.updateUser);
router.delete('/:id', auth, authorize('admin'), userController.deleteUser);

module.exports = router;
