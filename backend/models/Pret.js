const mongoose = require("mongoose");

const pretSchema = new mongoose.Schema(
  {
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exemplaire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Copy",
      required: true,
    },
    employe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateEmprunt: {
      type: Date,
      default: Date.now,
    },
    dateRetourPrevue: {
      type: Date,
      required: true,
    },
    dateRetourEffective: {
      type: Date,
    },
    statutPret: {
      type: String,
      enum: ["en cours", "retourné", "en retard", "perdu"],
      default: "en cours",
    },
  },
  {
    timestamps: true,
  }
);

// Définir dateRetourPrevue automatiquement si non fournie
pretSchema.pre("save", function (next) {
  if (this.isNew && !this.dateRetourPrevue) {
    this.dateRetourPrevue = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  }
  next();
});

module.exports = mongoose.model("Pret", pretSchema);
