const mongoose = require('mongoose');

const amendeSchema = mongoose.Schema({
  montant: {
    type: Number,
    required: true
  },
  datePaiement: {
    type: Date,
    default: Date.now
  },
  motif: {
    type: String,
    required: true
  },
  etudiantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Etudiant',
    required: true
  },
  pretId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pret',
    required: true
  },
  dateCreationAmende:{
    type: Date,
  },
  status: {
    type: String,
    enum: ['payée', 'impayée', 'annulée'],
    default: 'en attente'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Amende', amendeSchema);