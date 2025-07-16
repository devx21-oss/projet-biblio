const mongoose = require('mongoose');

const categorieSchema = mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  codeClassification: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Categorie', categorieSchema);