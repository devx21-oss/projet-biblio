const express = require("express");
const {
  createPret,
  returnPret,
  extendPret,
  getUserPrets,
  getOverduePrets
} = require("../controllers/pretController");

const { auth, authorize } = require('../middlewares/auth');
const { validateLoan } = require("../middlewares/validation");

const router = express.Router();

// Créer un prêt - uniquement employé
router.post("/", auth, authorize("employe"), validateLoan, createPret);

// Retourner un prêt - uniquement employé
router.put("/:id/return", auth, authorize("employe"), returnPret);

// Prolonger un prêt - uniquement employé
router.put("/:id/extend", auth, authorize("employe"), extendPret);

// Obtenir les prêts d'un utilisateur connecté (sans paramètre)
router.get("/user", auth, getUserPrets);

// Obtenir les prêts d'un utilisateur par son ID
router.get("/user/:userId", auth, getUserPrets);

// Obtenir les prêts en retard - uniquement employé
router.get("/overdue", auth, authorize("employe"), getOverduePrets);

module.exports = router;
