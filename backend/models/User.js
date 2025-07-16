// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Commun
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true }, // ⚠️ Hash avec bcrypt côté controller
  dateInscription: { type: Date, default: Date.now },
  statut: { type: String, enum: ['actif', 'inactif', 'suspendu'], default: 'actif' },
  role: {
    type: String,
    enum: ['employe', 'etudiant', 'supplier','admin'],
    required: true
  },

  // Employé
  matricule: String,
  departement: String,
  roleEmploye: String,

  // Étudiant
  numeroEtudiant: String,
  filiere: String,
  niveauEtude: String,
  maxEmprunts: Number,

  // Fournisseur
  nomEntreprise: String,
  siret: String,
  adresseEntreprise: String,
  contactPrincipal: String
});

// Méthodes utilisateur génériques
userSchema.methods.seConnecter = function() {};
userSchema.methods.seDeconnecter = function() {};
userSchema.methods.modifierProfil = function(updates) {
  Object.assign(this, updates);
  return this.save();
};

const User = mongoose.model('User', userSchema);
module.exports = User;