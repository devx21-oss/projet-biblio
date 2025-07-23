const mongoose = require('mongoose');

const ligneCommandeFournisseurSchema = new mongoose.Schema({
  idCommandeFournisseur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommandeFournisseur',
    required: true,
  },
  idLivre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Livre',
    required: true,
  },
  quantite: {
    type: Number,
    required: true,
    min: 1,
  },
  prixUnitaire: {
    type: Number,
    required: true,
    min: 0,
  },
}, {
  timestamps: true,
});

// Méthode pour calculer le sous-total
ligneCommandeFournisseurSchema.methods.calculerSousTotal = function() {
  return this.quantite * this.prixUnitaire;
};

module.exports = mongoose.model('LigneCommandeFournisseur', ligneCommandeFournisseurSchema);
