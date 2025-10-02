const Exemplaire = require('../models/Exemplaire');

// Créer exemplaire
async function createExemplaire(req, res) {
  try {
    const exemplaire = new Exemplaire(req.body);
    await exemplaire.save();
    res.status(201).json(exemplaire);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Tous les exemplaires avec pagination
async function getAllExemplaires(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Exemplaire.countDocuments();
    const exemplaires = await Exemplaire.find()
      .populate('livreId')
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      items: exemplaires
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Récupérer un exemplaire par ID
async function getExemplaireById(req, res) {
  try {
    const exemplaire = await Exemplaire.findById(req.params.id).populate('livreId');
    if (!exemplaire) return res.status(404).json({ message: 'Exemplaire non trouvé' });
    res.json(exemplaire);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Récupérer les exemplaires disponibles
async function getExemplairesDisponibles(req, res) {
  try {
    const exemplaires = await Exemplaire.find({ disponible: true })
      .populate("livreId", "titre auteur");

    if (!exemplaires.length) {
      return res.status(404).json({ message: "Aucun exemplaire disponible pour ce livre" });
    }

    res.json(exemplaires);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// Mettre à jour exemplaire
async function updateExemplaire(req, res) {
  try {
    const exemplaire = await Exemplaire.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exemplaire) return res.status(404).json({ message: 'Exemplaire non trouvé' });
    res.json(exemplaire);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Supprimer exemplaire
async function deleteExemplaire(req, res) {
  try {
    const exemplaire = await Exemplaire.findByIdAndDelete(req.params.id);
    if (!exemplaire) return res.status(404).json({ message: 'Exemplaire non trouvé' });
    res.json({ message: 'Exemplaire supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createExemplaire,
  getAllExemplaires,
  getExemplaireById,
  getExemplairesDisponibles,
  updateExemplaire,
  deleteExemplaire,
};
