const LigneCommandeFournisseur = require('../models/LigneCommandeFournisseur');
const CommandeFournisseur = require('../models/CommandeFournisseur');
const Livre = require('../models/Livre');

// Créer une nouvelle ligne
exports.createLigneCommande = async (req, res) => {
  try {
    let { idCommandeFournisseur, idLivre, quantite, prixUnitaire } = req.body;
    if (!idCommandeFournisseur || !idLivre || !quantite || !prixUnitaire)
      return res.status(400).json({ message: 'Tous les champs sont requis' });

    quantite = Number(quantite);
    prixUnitaire = Number(prixUnitaire);

    const commande = await CommandeFournisseur.findById(idCommandeFournisseur);
    if (!commande) return res.status(404).json({ message: 'Commande fournisseur non trouvée' });

    const livre = await Livre.findById(idLivre);
    if (!livre) return res.status(404).json({ message: 'Livre non trouvé' });

    const ligneCommande = new LigneCommandeFournisseur({ idCommandeFournisseur, idLivre, quantite, prixUnitaire });
    const savedLigne = await ligneCommande.save();
    res.status(201).json(savedLigne);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Récupérer toutes les lignes d'une commande
exports.getLignesByCommande = async (req, res) => {
  try {
    const { idCommande } = req.params;
    const lignes = await LigneCommandeFournisseur.find({ idCommandeFournisseur: idCommande })
      .populate('idLivre', 'titre auteur isbn');

    res.status(200).json(lignes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour une ligne
exports.updateLigneCommande = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};
    if (req.body.quantite !== undefined) updates.quantite = Number(req.body.quantite);
    if (req.body.prixUnitaire !== undefined) updates.prixUnitaire = Number(req.body.prixUnitaire);

    const ligne = await LigneCommandeFournisseur.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!ligne) return res.status(404).json({ message: 'Ligne non trouvée' });

    res.status(200).json(ligne);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une ligne
exports.deleteLigneCommande = async (req, res) => {
  try {
    const { id } = req.params;
    const ligne = await LigneCommandeFournisseur.findByIdAndDelete(id);
    if (!ligne) return res.status(404).json({ message: 'Ligne non trouvée' });

    res.status(200).json({ message: 'Ligne supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Calculer total d'une commande
exports.calculerTotalCommande = async (req, res) => {
  try {
    const { idCommande } = req.params;
    const lignes = await LigneCommandeFournisseur.find({ idCommandeFournisseur: idCommande });
    const total = lignes.reduce((sum, ligne) => sum + (ligne.quantite * ligne.prixUnitaire), 0);
    res.status(200).json({ total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
