const mongoose = require('mongoose');

const exemplaireSchema = mongoose.Schema({
  IdExemplaire: {
    type: String,
    required: true,
    unique: true
  },
  etat: {
    type: String,
    enum: ['Neuf', 'Bon', 'Usé', 'Détérioré'],
    default: 'Neuf'
  },
  disponible: {
    type: Boolean,
    default: true
  },
  livreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Livre',
    required: true
  },
  dateAcquisition: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exemplaire', exemplaireSchema);