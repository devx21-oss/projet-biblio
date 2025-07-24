const mongoose = require('mongoose');

const livreSchema = new mongoose.Schema({
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  titre: {
    type: String,
    required: true
  },
  auteur: {
    type: String,
    required: true
  },
  editeur: String,
  anneePublication: Number,
  langue: String,
  description: String,
  imageCouverture: String,
  categorie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categorie'
  },
  exemplaires: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exemplaire'
  }]
}, { timestamps: true });

// Prevent OverwriteModelError
module.exports = mongoose.models.Livre || mongoose.model('Livre', livreSchema);
