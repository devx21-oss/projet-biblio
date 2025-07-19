const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commandeFournisseurController');
const { auth, authorize } = require('../middlewares/auth'); // Corrige le chemin si besoin

// Protection des routes selon les rôles :
// - Création, modification, suppression : uniquement fournisseur ou admin
// - Lecture de toutes les commandes : uniquement admin (à adapter selon tes besoins)

// Créer une commande (fournisseur uniquement)
router.post('/createCommande', auth, authorize(['fournisseur']), commandeController.createCommande);

// Récupérer toutes les commandes (admin uniquement)
router.get('/getAllCommandes', auth, authorize(['admin']), commandeController.getAllCommandes);

// Récupérer une commande par ID (admin et fournisseur)
router.get('/:id', auth, authorize(['admin', 'fournisseur']), commandeController.getCommandeById);

// Mettre à jour une commande (fournisseur uniquement)
router.put('/:id', auth, authorize(['fournisseur']), commandeController.updateCommande);

// Supprimer une commande (admin uniquement)
router.delete('/:id', auth, authorize(['admin']), commandeController.deleteCommande);

module.exports = router;
