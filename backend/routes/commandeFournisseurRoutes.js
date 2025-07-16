// routes/commandeFournisseurRoutes.js
const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commandeFournisseurController');

// CRUD routes
router.post('/createCommande', commandeController.createCommande);
router.get('/getAllCommandes', commandeController.getAllCommandes);
router.get('/:id', commandeController.getCommandeById);
router.put('/:id', commandeController.updateCommande);
router.delete('/:id', commandeController.deleteCommande);

module.exports = router;