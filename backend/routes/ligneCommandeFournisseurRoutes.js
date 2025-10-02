const express = require('express');
const router = express.Router();
const ligneCommandeController = require('../controllers/ligneCommendeFourniseurController.js');
const { auth, authorize } = require('../middlewares/auth');

// ✅ Ajouter une ligne (employé et admin)
router.post('/', auth, authorize(['employe', 'admin']), ligneCommandeController.createLigneCommande);

// ✅ Récupérer toutes les lignes d'une commande (employé et admin)
router.get('/commande/:idCommande', auth, authorize(['employe', 'admin']), ligneCommandeController.getLignesByCommande);

// ✅ Mettre à jour une ligne (employé et admin)
router.put('/:id', auth, authorize(['employe', 'admin']), ligneCommandeController.updateLigneCommande);

// ✅ Supprimer une ligne (admin seulement)
router.delete('/:id', auth, authorize(['admin']), ligneCommandeController.deleteLigneCommande);

// ✅ Calculer le total d'une commande (employé et admin)
router.get('/commande/:idCommande/total', auth, authorize(['employe', 'admin']), ligneCommandeController.calculerTotalCommande);

module.exports = router;
