const express = require('express');
const router = express.Router();
const amendeController = require('../controllers/amendeController');
const { auth, authorize } = require('../middlewares/auth');

router.get('/', amendeController.getAllAmendes);
router.get('/:id', amendeController.getAmendeById);

// حماية المسارات الحساية (إنشاء، تعديل، حذف) للموظفين والإداريين فقط
router.post('/', auth, authorize(['employe', 'admin']), amendeController.createAmende);
router.put('/:id', auth, authorize(['employe', 'admin']), amendeController.updateAmende);
router.delete('/:id', auth, authorize(['employe', 'admin']), amendeController.deleteAmende);

module.exports = router;
