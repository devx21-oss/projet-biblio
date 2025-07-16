// models/Livre.js
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
  imageCouverture: String, // URL ou chemin vers l'image
  categorie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categorie' // FK vers le modèle Categorie
  },
  exemplaires: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exemplaire'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Livre', livreSchema);