const express = require('express');
const router = express.Router();
const amendeController = require('../controllers/amendeController');
const { auth, authorize } = require('../middlewares/auth');

router.get("/", auth, authorize(["employe", "admin"]), amendeController.getAllAmendes);

router.get("/:id", auth, authorize(["employe", "admin"]), amendeController.getAmendeById);

router.post("/", auth, authorize(["employe", "admin"]), amendeController.createAmende);

router.put("/:id", auth, authorize(["employe", "admin"]), amendeController.updateAmende);

router.put("/:id/pay", auth, authorize(["employe", "admin"]), amendeController.payAmende);

router.delete("/:id", auth, authorize(["employe", "admin"]), amendeController.deleteAmende);

module.exports = router;