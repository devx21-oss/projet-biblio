const express = require('express');
const router = express.Router();
const ligneCommandeController = require('../controllers/LigneCommandeFournisseurController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Seuls les employés peuvent gérer les lignes de commande
router.use(authMiddleware);
router.use(roleMiddleware(['bibliothecaire', 'administrateur']));

// Créer une nouvelle ligne de commande
router.post('/', ligneCommandeController.createLigneCommande);

// Récupérer toutes les lignes d'une commande
router.get('/commande/:idCommande', ligneCommandeController.getLignesByCommande);

// Mettre à jour une ligne de commande
router.put('/:id', ligneCommandeController.updateLigneCommande);

// Supprimer une ligne de commande
router.delete('/:id', ligneCommandeController.deleteLigneCommande);

// Calculer le total d'une commande
router.get('/commande/:idCommande/total', ligneCommandeController.calculerTotalCommande);

module.exports = router;