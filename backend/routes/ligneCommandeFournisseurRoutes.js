const express = require('express');
const router = express.Router();
const ligneCommandeController = require('../controllers/LigneCommandeFournisseurController');
const { auth, authorize } = require('../middlewares/auth');  // تأكد من المسار الصحيح

// فقط الموظفون والإداريون يمكنهم إدارة خطوط الأوامر
router.use(auth);
router.use(authorize(['employe', 'admin']));

// إنشاء خط أمر جديد
router.post('/', ligneCommandeController.createLigneCommande);

// استرجاع كل خطوط أمر معينة
router.get('/commande/:idCommande', ligneCommandeController.getLignesByCommande);

// تحديث خط أمر
router.put('/:id', ligneCommandeController.updateLigneCommande);

// حذف خط أمر
router.delete('/:id', ligneCommandeController.deleteLigneCommande);

// حساب مجموع قيمة الأمر
router.get('/commande/:idCommande/total', ligneCommandeController.calculerTotalCommande);

module.exports = router;
