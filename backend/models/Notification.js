const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema(
  {
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    typeNotification: {
      type: String,
      required: true,
      enum: ["rappel retour", "amende", "réservation disponible", "prolongation", "général"],
    },
    dateEnvoi: {
      type: Date,
      default: Date.now,
    },
    statutNotification: {
      type: String,
      enum: ["envoyée", "lue"],
      default: "envoyée",
    },
    lienEntite: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "typeEntite",
    },
    typeEntite: {
      type: String,
      enum: ["Loan", "Reservation", "Fine"],
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Notification", notificationSchema)