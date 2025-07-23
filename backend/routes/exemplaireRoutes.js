const express = require('express');
const router = express.Router();
const exemplaireController = require('../controllers/exemplaireController');
const { auth, authorize } = require('../middlewares/auth');

router.get('/', exemplaireController.getAllExemplaires);
router.get('/:id', exemplaireController.getExemplaireById);

router.post('/', auth, authorize(['employe', 'admin']), exemplaireController.createExemplaire);
router.put('/:id', auth, authorize(['employe', 'admin']), exemplaireController.updateExemplaire);
router.delete('/:id', auth, authorize(['employe', 'admin']), exemplaireController.deleteExemplaire);

module.exports = router;
