const express = require('express');
const router = express.Router();

const reservationController = require('../controllers/reservationController');
const { auth, authorize } = require('../middlewares/auth');

// Créer réservation (étudiant/admin)
router.post('/ajouter', auth, authorize(['etudiant', 'admin']), reservationController.createReservation);

// Voir ses réservations (étudiant)
router.get('/mes-reservations', auth, authorize(['etudiant']), reservationController.getMyReservations);

// Confirmer réservation (employé/admin)
router.post('/confirmer/:id', auth, authorize(['employe', 'admin']), reservationController.confirmerReservation);

// Annuler réservation (étudiant/employé/admin)
router.delete('/:id', auth, authorize(['etudiant', 'employe', 'admin']), reservationController.annulerReservation);

// Voir toutes les réservations (employé/admin)
router.get('/', auth, authorize(['employe', 'admin']), reservationController.getAllReservations);

module.exports = router;
