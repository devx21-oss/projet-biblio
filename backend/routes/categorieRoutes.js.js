// routes/categorieRoutes.js
const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorieController');

// CRUD routes
router.post('/createCategorie', categorieController.createCategorie);
router.get('/getAllCategories', categorieController.getAllCategories);
router.get('/:id', categorieController.getCategorieById);
router.put('/:id', categorieController.updateCategorie);
router.delete('/:id', categorieController.deleteCategorie);

module.exports = router;