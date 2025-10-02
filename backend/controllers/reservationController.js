const Reservation = require('../models/Reservation');
const Exemplaire = require('../models/Exemplaire');

// 📌 Créer une réservation
async function createReservation(req, res) {
  try {
    const { exemplaire } = req.body;

    // Vérifier que l'exemplaire existe et est disponible
    const ex = await Exemplaire.findById(exemplaire);
    if (!ex) return res.status(404).json({ message: "Exemplaire introuvable" });
    if (!ex.disponible) return res.status(400).json({ message: "Exemplaire non disponible" });

    const reservation = new Reservation({
      utilisateur: req.user.id,
      exemplaire,
      statutReservation: 'en attente'
    });

    await reservation.save();

    // Marquer l'exemplaire comme indisponible
    ex.disponible = false;
    await ex.save();

    const savedReservation = await Reservation.findById(reservation._id)
      .populate({ path: 'exemplaire', populate: { path: 'livreId', select: 'titre auteur' } })
      .populate({ path: 'utilisateur', select: 'nom prenom role' });

    res.status(201).json(savedReservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 📌 Voir ses réservations
async function getMyReservations(req, res) {
  try {
    const reservations = await Reservation.find({ utilisateur: req.user.id })
      .populate({
        path: 'exemplaire',
        populate: { path: 'livreId', select: 'titre auteur' }
      })
      .populate({ path: 'utilisateur', select: 'nom prenom role' });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// 📌 Toutes les réservations (admin/employé)
async function getAllReservations(req, res) {
  try {
    const reservations = await Reservation.find()
      .populate({ path: 'exemplaire', populate: { path: 'livreId', select: 'titre auteur' } })
      .populate({ path: 'utilisateur', select: 'nom prenom role' });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 📌 Confirmer une réservation
async function confirmerReservation(req, res) {
  try {
    let reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });

    reservation.statutReservation = 'confirmée';
    await reservation.save();

    reservation = await Reservation.findById(reservation._id)
      .populate({ path: 'exemplaire', populate: { path: 'livreId', select: 'titre auteur' } })
      .populate({ path: 'utilisateur', select: 'nom prenom role' });

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 📌 Annuler une réservation
async function annulerReservation(req, res) {
  try {
    let reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });

    reservation.statutReservation = 'annulée';
    await reservation.save();

    // Optionnel : remettre l'exemplaire disponible
    const ex = await Exemplaire.findById(reservation.exemplaire);
    if (ex) {
      ex.disponible = true;
      await ex.save();
    }

    reservation = await Reservation.findById(reservation._id)
      .populate({ path: 'exemplaire', populate: { path: 'livreId', select: 'titre auteur' } })
      .populate({ path: 'utilisateur', select: 'nom prenom role' });

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createReservation,
  getMyReservations,
  getAllReservations,
  confirmerReservation,
  annulerReservation
};
