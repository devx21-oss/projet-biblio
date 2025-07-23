const express = require('express');
const router = express.Router();
const ligneCommandeController = require('../controllers/ligneCommendeFourniseurController.js');
const { auth, authorize } = require('../middlewares/auth');

router.post('/', auth, authorize(['employe', 'admin']), ligneCommandeController.createLigneCommande);

router.get('/commande/:idCommande', auth, authorize(['employe', 'admin']), ligneCommandeController.getLignesByCommande);

router.put('/:id', auth, authorize(['employe', 'admin']), ligneCommandeController.updateLigneCommande);

router.delete('/:id', auth, authorize(['admin']), ligneCommandeController.deleteLigneCommande);

router.get('/commande/:idCommande/total', auth, authorize(['employe', 'admin']), ligneCommandeController.calculerTotalCommande);

module.exports = router;
