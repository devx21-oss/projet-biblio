const mongoose = require("mongoose")

const reservationSchema = new mongoose.Schema(
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
    dateReservation: {
      type: Date,
      default: Date.now,
    },
    dateExpiration: {
      type: Date,
      required: true,
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
  },
)

// Set expiration date automatically (7 days from reservation)
reservationSchema.pre("save", function (next) {
  if (this.isNew && !this.dateExpiration) {
    this.dateExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
  next()
})

module.exports = mongoose.model("Reservation", reservationSchema)