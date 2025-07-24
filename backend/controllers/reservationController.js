const Reservation = require('../models/Reservation');

// إنشاء حجز
async function createReservation(req, res) {
  try {
    const reservation = new Reservation({
      utilisateur: req.user._id,
      exemplaire: req.body.exemplaire,
    });

    await reservation.save();
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getAllReservations(req, res) {
  try {
    const reservations = await Reservation.find()
      .populate('utilisateur', 'nom prenom')
      .populate('exemplaire');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getMyReservations(req, res) {
  try {
    const reservations = await Reservation.find({ utilisateur: req.user._id })
      .populate('utilisateur', 'nom prenom')
      .populate('exemplaire');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function confirmerReservation(req, res) {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });

    reservation.statutReservation = 'confirmée';
    await reservation.save();

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function annulerReservation(req, res) {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });

    reservation.statutReservation = 'annulée';
    await reservation.save();

    res.json({ message: 'Réservation annulée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createReservation,
  getAllReservations,
  getMyReservations,
  confirmerReservation,
  annulerReservation,
};
