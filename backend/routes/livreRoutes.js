const express = require('express');
const router = express.Router();
const livreController = require('../controllers/livreController');

// Place specific routes before dynamic ones:
router.post('/', livreController.createLivre);
router.get('/', livreController.getAllLivres);
// Dynamic routes with :id must be last:
router.get('/:id', livreController.getLivreById);
router.put('/:id', livreController.updateLivre);
router.delete('/:id', livreController.deleteLivre);

module.exports = router;