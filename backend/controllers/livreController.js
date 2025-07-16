// controllers/livreController.js
const Livre = require('../models/livre');

const createLivre = async (req, res) => {
  try {
    const livre = new Livre(req.body);
    await livre.save();
    res.status(201).json(livre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllLivres = async (req, res) => {
  try {
    const livres = await Livre.find().populate('categorie');
    res.json(livres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLivreById = async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.id).populate('categorie');
    if (!livre) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.json(livre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLivre = async (req, res) => {
  try {
    const livre = await Livre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!livre) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.json(livre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteLivre = async (req, res) => {
  try {
    const livre = await Livre.findByIdAndDelete(req.params.id);
    if (!livre) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.json({ message: 'Livre supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLivre,
  getAllLivres,
  getLivreById,
  updateLivre,
  deleteLivre
};