const Amende = require('../models/Amende');
// Create Amende
const createAmende = async (req, res) => {
  try {
    const { montant, motif, etudiantId, pretId, dateCreationAmende } = req.body;

    if (!montant || !motif || !etudiantId || !pretId) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    const amende = new Amende({
      montant,
      motif,
      etudiantId,
      pretId,
      dateCreationAmende: dateCreationAmende || new Date(),
      status: "impayée",
    });

    await amende.save();
    res.status(201).json({ message: "Amende créée.", amende });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all with pagination + filters
const getAllAmendes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.etudiantId) filter.etudiantId = req.query.etudiantId;
    if (req.query.pretId) filter.pretId = req.query.pretId;
    if (req.query.motif) filter.motif = new RegExp(req.query.motif, "i");

    const total = await Amende.countDocuments(filter);
    const amendes = await Amende.find(filter)
      .populate("etudiantId", "nom prenom email")
      .populate("pretId", "dateEmprunt dateRetourPrevue")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      amendes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalItems: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get by ID
const getAmendeById = async (req, res) => {
  try {
    const amende = await Amende.findById(req.params.id)
      .populate("etudiantId", "nom prenom email")
      .populate("pretId", "dateEmprunt dateRetourPrevue");
    if (!amende) return res.status(404).json({ message: "Amende non trouvée." });
    res.json(amende);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
const updateAmende = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.status === "payée") {
      updates.datePaiement = new Date();
    }

    const amende = await Amende.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!amende) return res.status(404).json({ message: "Amende non trouvée." });

    res.json({ message: "Amende mise à jour.", amende });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Soft delete (Annuler une amende au lieu de supprimer)
const deleteAmende = async (req, res) => {
  try {
    const amende = await Amende.findById(req.params.id);
    if (!amende) return res.status(404).json({ message: "Amende non trouvée." });

    amende.status = "annulée";
    await amende.save();

    res.json({ message: "Amende annulée (soft delete).", amende });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Payer une amende
const payAmende = async (req, res) => {
  try {
    const amende = await Amende.findById(req.params.id);
    if (!amende) return res.status(404).json({ message: "Amende non trouvée." });

    if (amende.status === "payée") {
      return res.status(400).json({ message: "Cette amende est déjà payée." });
    }

    amende.status = "payée";
    amende.datePaiement = new Date();
    await amende.save();

    res.json({ message: "Amende payée.", amende });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAmende,
  getAllAmendes,
  getAmendeById,
  updateAmende,
  deleteAmende,
  payAmende,
};