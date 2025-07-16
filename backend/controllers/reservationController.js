const Reservation = require('../models/Reservation');

async function createReservation(req, res) {
  try {
    const reservation = new Reservation(req.body);
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

async function getReservationById(req, res) {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('utilisateur', 'nom prenom')
      .populate('exemplaire');
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateReservation(req, res) {
  try {
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteReservation(req, res) {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.json({ message: 'Réservation supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getUserReservations(req, res) {
  try {
    const { userId } = req.params;
    const reservations = await Reservation.find({ utilisateur: userId })
      .populate('utilisateur', 'nom prenom')
      .populate('exemplaire');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
  getUserReservations,
};