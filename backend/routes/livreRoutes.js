const express = require('express');
const router = express.Router();
const livreController = require('../controllers/livreController');
const { auth, authorize } = require('../middlewares/auth');

router.get('/', livreController.getAllLivres); 
router.get('/:id', livreController.getLivreById);

router.post('/', auth, authorize(['employe', 'admin']), livreController.createLivre);
router.put('/:id', auth, authorize(['employe', 'admin']), livreController.updateLivre);
router.delete('/:id', auth, authorize(['employe', 'admin']), livreController.deleteLivre);


module.exports = router;
