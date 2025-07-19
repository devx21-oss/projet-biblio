const express = require("express");
const {
  createPret,
  returnPret,
  extendPret,
  getUserPrets,
  getOverduePrets
} = require("../controllers/pretController");

const { auth, authorize } = require("../middleware/auth");
const { validateLoan } = require("../middleware/validation");

const router = express.Router();

// Créer un prêt - uniquement employé
router.post("/", auth, authorize("employe"), validateLoan, createPret);

// Retourner un prêt - uniquement employé
router.put("/:id/return", auth, authorize("employe"), returnPret);

// Prolonger un prêt - uniquement employé (ajout authorize)
router.put("/:id/extend", auth, authorize("employe"), extendPret);

// Obtenir les prêts d'un utilisateur - utilisateur connecté ou employé
router.get("/user/:userId?", auth, getUserPrets);

// Obtenir les prêts en retard - uniquement employé
router.get("/overdue", auth, authorize("employe"), getOverduePrets);

module.exports = router;
