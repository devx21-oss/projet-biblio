const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exemplaire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exemplaire", // تأكد أن اسم الموديل هذا موجود فعلاً
      required: true,
    },
    dateReservation: {
      type: Date,
      default: Date.now,
    },
    dateExpiration: {
      type: Date,
    },
    statutReservation: {
      type: String,
      enum: ["en attente", "confirmée", "annulée", "expirée", "complétée"],
      default: "en attente",
    },
    priorite: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Définir automatiquement la date d'expiration (7 jours après)
reservationSchema.pre("save", function (next) {
  if (this.isNew && !this.dateExpiration) {
    this.dateExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
  next();
});

module.exports = mongoose.model("Reservation", reservationSchema);
