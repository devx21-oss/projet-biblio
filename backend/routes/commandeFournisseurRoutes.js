const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commandeFournisseurController');
const { auth, authorize } = require('../middlewares/auth'); // Corrige le chemin si besoin

router.post('/', auth, authorize(['admin', 'supplier']), commandeController.createCommande);
router.get('/', auth, authorize(['admin', 'supplier']), commandeController.getAllCommandes);
router.get('/:id', auth, authorize(['admin', 'supplier']), commandeController.getCommandeById);
router.put('/:id', auth, authorize(['admin', 'supplier']), commandeController.updateCommande);
router.delete('/:id', auth, authorize(['admin']), commandeController.deleteCommande);

module.exports = router;