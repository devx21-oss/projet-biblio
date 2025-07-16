const express = require('express');
const router = express.Router();
const exemplaireController = require('../controllers/exemplaireController');

// Create exemplaire
router.post('/', exemplaireController.createExemplaire);

// Get all exemplaires
router.get('/', exemplaireController.getAllExemplaires);

// Get one exemplaire by id
router.get('/:id', exemplaireController.getExemplaireById);

// Update exemplaire by id
router.put('/:id', exemplaireController.updateExemplaire);

// Delete exemplaire by id
router.delete('/:id', exemplaireController.deleteExemplaire);

module.exports = router;