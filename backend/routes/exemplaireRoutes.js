const express = require('express');
const router = express.Router();
const exemplaireController = require('../controllers/exemplaireController');
const { auth, authorize } = require('../middlewares/auth');

// Tous les exemplaires (public)
router.get('/', exemplaireController.getAllExemplaires);

// Exemplaires disponibles pour étudiants
router.get('/disponibles', auth, authorize(['etudiant','admin']), exemplaireController.getExemplairesDisponibles);

// Récupérer un exemplaire par ID
router.get('/:id', exemplaireController.getExemplaireById);

// CRUD pour employés/admin
router.post('/', auth, authorize(['employe', 'admin']), exemplaireController.createExemplaire);
router.put('/:id', auth, authorize(['employe', 'admin']), exemplaireController.updateExemplaire);
router.delete('/:id', auth, authorize(['employe', 'admin']), exemplaireController.deleteExemplaire);

module.exports = router;