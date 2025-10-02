const mongoose = require("mongoose");

const ExemplaireSchema = new mongoose.Schema(
  {
    livreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Livre",
      required: true,
    },
    IdExemplaire: {
      type: String,
      required: [true, "Le code de l'exemplaire est requis"],
      unique: true, // ✅ chaque exemplaire doit avoir un code unique
      trim: true,
    },
    etat: {
      type: String,
      enum: ["Neuf", "Bon", "Usé", "Détérioré"],
      default: "Neuf",
    },
    disponible: {
      type: Boolean,
      default: true,
    },
    dateAcquisition: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exemplaire", ExemplaireSchema);
