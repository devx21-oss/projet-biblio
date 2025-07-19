const express = require('express');
const router = express.Router();

const reservationController = require('../controllers/reservationController');
const { auth, authorize } = require('../middleware/auth');
const { validateReservation } = require('../middleware/validation');

// Routes pour Étudiant
router.post('/ajouter', auth, authorize(['etudiant']), validateReservation, reservationController.createReservation);
router.get('/mes-reservations', auth, authorize(['etudiant']), reservationController.getMyReservations);

// Routes pour Employé
router.post('/confirmer/:id', auth, authorize(['employe']), reservationController.confirmerReservation);
router.delete('/:id', auth, authorize(['employe']), reservationController.annulerReservation);
router.get('/', auth, authorize(['employe']), reservationController.getAllReservations);

module.exports = router;
