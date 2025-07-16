// routes/amendeRoutes.js
const express = require('express');
const router = express.Router();
const amendeController = require('../controllers/amendeController');

// CRUD routes
router.post('/createAmende', amendeController.createAmende);
router.get('/getAllAmendes', amendeController.getAllAmendes);
router.get('/:id', amendeController.getAmendeById);
router.put('/:id', amendeController.updateAmende);
router.delete('/:id', amendeController.deleteAmende);

module.exports = router;