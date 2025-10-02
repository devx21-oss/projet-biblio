// models/CommandeFournisseur.js
const mongoose = require('mongoose');
const Livre = require('./livre');

const commandeFournisseurSchema = mongoose.Schema({
  dateCommande: { type: Date, default: Date.now },
  statut: { type: String, enum: ['En attente', 'Livrée', 'Annulée'], default: 'En attente' },
  fournisseurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  montantTotal: { type: Number, required: true },
  livres: [
    {
      livreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Livre', required: true },
      quantite: { type: Number, required: true, min: 1 },
      imageCouverture: { type: String } // نضيف الصورة هنا
    }
  ]
}, { timestamps: true });

// Middleware post-save
commandeFournisseurSchema.post('save', async function(doc, next) {
  try {
    if (doc.statut === 'Livrée' && doc.livres && doc.livres.length > 0) {
      for (const item of doc.livres) {
        const livre = await Livre.findById(item.livreId);
        if (livre) {
          livre.quantite += item.quantite;
          if (item.imageCouverture) {
            livre.imageCouverture = item.imageCouverture; // تحديث الصورة
          }
          await livre.save();
        }
      }
    }
    next();
  } catch (err) {
    console.error('Erreur update stock:', err.message);
    next(err);
  }
});

// Middleware post findOneAndUpdate (لـ updateCommande)
commandeFournisseurSchema.post('findOneAndUpdate', async function(doc, next) {
  try {
    if (!doc) return next();
    if (doc.statut === 'Livrée' && doc.livres && doc.livres.length > 0) {
      for (const item of doc.livres) {
        const livre = await Livre.findById(item.livreId);
        if (livre) {
          livre.quantite += item.quantite;
          if (item.imageCouverture) {
            livre.imageCouverture = item.imageCouverture;
          }
          await livre.save();
        }
      }
    }
    next();
  } catch (err) {
    console.error('Erreur update stock (findOneAndUpdate):', err.message);
    next(err);
  }
});

module.exports = mongoose.model('CommandeFournisseur', commandeFournisseurSchema);
