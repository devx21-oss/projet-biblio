const express = require('express');
const router = express.Router();
const livreController = require('../controllers/livreController');
const { auth, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');


router.get('/', livreController.getAllLivres); 
router.get('/:id', livreController.getLivreById);

router.post('/', upload.single("imageCouverture"), livreController.createLivre);
router.put('/:id',
  auth,
  authorize(['employe', 'admin']),
  upload.single("imageCouverture"),  // <- add multer here
  livreController.updateLivre
);router.delete('/:id', auth, authorize(['employe', 'admin']), livreController.deleteLivre);




module.exports = router;
