const express = require('express');
const router = express.Router();
const amendeController = require('../controllers/amendeController');
const { auth, authorize } = require('../middlewares/auth');

router.get('/', amendeController.getAllAmendes); // accès public ou restreint selonك
router.get('/:id', amendeController.getAmendeById);

// حماية المسارات الحساسة
router.post('/', auth, authorize(['employe', 'admin']), amendeController.createAmende);
router.put('/:id', auth, authorize(['employe', 'admin']), amendeController.updateAmende);
router.delete('/:id', auth, authorize(['employe', 'admin']), amendeController.deleteAmende);

module.exports = router;
