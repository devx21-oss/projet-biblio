const mongoose = require('mongoose');

const amendeSchema = new mongoose.Schema({
  montant: {
    type: Number,
    required: true
  },
  datePaiement: {
    type: Date,
    default: null // null si non payée
  },
  motif: {
    type: String,
    required: true
  },
  etudiantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // اسم الموديل المستخدم
    required: true
  },
  pretId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pret',
    required: true
  },
  dateCreationAmende: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['payée', 'impayée', 'annulée', 'en attente'],
    default: 'impayée' //統一致
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Amende', amendeSchema);
