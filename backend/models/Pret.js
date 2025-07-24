const mongoose = require("mongoose");

const pretSchema = new mongoose.Schema(
  {
    etudiant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exemplaire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exemplaire", // صححت الاسم من "Copy" إلى "Exemplaire"
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

// تعيين تاريخ الإرجاع المتوقع تلقائيا لو ما قدمش في الحفظ
pretSchema.pre("save", function (next) {
  if (this.isNew && !this.dateRetourPrevue) {
    this.dateRetourPrevue = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  }
  next();
});

module.exports = mongoose.model("Pret", pretSchema);
