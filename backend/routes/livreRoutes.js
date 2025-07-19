const express = require('express');
const router = express.Router();
const livreController = require('../controllers/livreController');
const { auth, authorize } = require('../middlewares/auth');

router.get('/', livreController.getAllLivres); // مفتوح للجميع
router.get('/:id', livreController.getLivreById); // مفتوح للجميع

// الحماية فقط للي عندهم دور 'employe'
router.post('/', auth, authorize('employe'), livreController.createLivre);
router.put('/:id', auth, authorize('employe'), livreController.updateLivre);
router.delete('/:id', auth, authorize('employe'), livreController.deleteLivre);

module.exports = router;
