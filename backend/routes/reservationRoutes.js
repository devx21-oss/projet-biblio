const express = require('express');
const router = express.Router();

const reservationController = require('../controllers/reservationController');
const { auth, authorize } = require('../middlewares/auth');
const { validateReservation } = require('../middlewares/validation');

// Étudiant : Créer réservation
router.post('/ajouter', auth, authorize(['employe', 'admin']), validateReservation, reservationController.createReservation);

// Étudiant : Voir ses réservations
router.get('/mes-reservations', auth, authorize(['etudiant']), reservationController.getMyReservations);

// Employé : Confirmer réservation
router.post('/confirmer/:id', auth, authorize(['employe', 'admin']), reservationController.confirmerReservation);

// Employé : Annuler réservation
router.delete('/:id', auth, authorize(['employe', 'admin']), reservationController.annulerReservation);

// Employé : Voir toutes les réservations
router.get('/', auth, authorize(['employe', 'admin']), reservationController.getAllReservations);

module.exports = router;
