const LigneCommandeFournisseur = require('../models/LigneCommandeFournisseur');
const CommandeFournisseur = require('../models/CommandeFournisseur');
const Livre = require('../models/Livre');

// Créer une nouvelle ligne de commande fournisseur
exports.createLigneCommande = async (req, res) => {
  try {
    const { idCommandeFournisseur, idLivre, quantite, prixUnitaire } = req.body;

    // Vérifier que la commande existe
    const commande = await CommandeFournisseur.findById(idCommandeFournisseur);
    if (!commande) {
      return res.status(404).json({ message: 'Commande fournisseur non trouvée' });
    }

    // Vérifier que le livre existe
    const livre = await Livre.findById(idLivre);
    if (!livre) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    const ligneCommande = new LigneCommandeFournisseur({
      idCommandeFournisseur,
      idLivre,
      quantite,
      prixUnitaire
    });

    const savedLigne = await ligneCommande.save();
    res.status(201).json(savedLigne);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer toutes les lignes d'une commande
exports.getLignesByCommande = async (req, res) => {
  try {
    const { idCommande } = req.params;
    const lignes = await LigneCommandeFournisseur.find({ idCommandeFournisseur: idCommande })
      .populate('idLivre', 'titre auteur isbn')
      .exec();

    res.status(200).json(lignes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour une ligne de commande
exports.updateLigneCommande = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantite, prixUnitaire } = req.body;

    const ligne = await LigneCommandeFournisseur.findByIdAndUpdate(
      id,
      { quantite, prixUnitaire },
      { new: true }
    );

    if (!ligne) {
      return res.status(404).json({ message: 'Ligne de commande non trouvée' });
    }

    res.status(200).json(ligne);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une ligne de commande
exports.deleteLigneCommande = async (req, res) => {
  try {
    const { id } = req.params;
    const ligne = await LigneCommandeFournisseur.findByIdAndDelete(id);

    if (!ligne) {
      return res.status(404).json({ message: 'Ligne de commande non trouvée' });
    }

    res.status(200).json({ message: 'Ligne de commande supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculer le total d'une commande
exports.calculerTotalCommande = async (req, res) => {
  try {
    const { idCommande } = req.params;
    const lignes = await LigneCommandeFournisseur.find({ idCommandeFournisseur: idCommande });

    const total = lignes.reduce((sum, ligne) => {
      return sum + (ligne.quantite * ligne.prixUnitaire);
    }, 0);

    res.status(200).json({ total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};