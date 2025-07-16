// routes/PretRoutes.js

const express = require("express")
const { createLoan, returnLoan, extendLoan, getUserLoans, getOverdueLoans } = require("../controllers/pretController");

const { auth, authorize } = require("../middleware/auth")
const { validateLoan } = require("../middleware/validation")

const router = express.Router()

// Créer un prêt
router.post("/", auth, authorize("employe"), validateLoan, createLoan)

// Retourner un prêt
router.put("/:id/return", auth, authorize("employe"), returnLoan)

// Prolonger un prêt
router.put("/:id/extend", auth, extendLoan)

// Obtenir les prêts d'un utilisateur
router.get("/user/:userId?", auth, getUserLoans)

// Obtenir les prêts en retard
router.get("/overdue", auth, authorize("employe"), getOverdueLoans)

module.exports = router