const Exemplaire = require('../models/Exemplaire');

async function createExemplaire(req, res) {
  try {
    const exemplaire = new Exemplaire(req.body);
    await exemplaire.save();
    res.status(201).json(exemplaire);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getAllExemplaires(req, res) {
  try {
    const exemplaires = await Exemplaire.find().populate('livreId');
    res.json(exemplaires);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getExemplaireById(req, res) {
  try {
    const exemplaire = await Exemplaire.findById(req.params.id).populate('livreId');
    if (!exemplaire) {
      return res.status(404).json({ message: 'Exemplaire non trouvé' });
    }
    res.json(exemplaire);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateExemplaire(req, res) {
  try {
    const exemplaire = await Exemplaire.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exemplaire) {
      return res.status(404).json({ message: 'Exemplaire non trouvé' });
    }
    res.json(exemplaire);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteExemplaire(req, res) {
  try {
    const exemplaire = await Exemplaire.findByIdAndDelete(req.params.id);
    if (!exemplaire) {
      return res.status(404).json({ message: 'Exemplaire non trouvé' });
    }
    res.json({ message: 'Exemplaire supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createExemplaire,
  getAllExemplaires,
  getExemplaireById,
  updateExemplaire,
  deleteExemplaire,
};