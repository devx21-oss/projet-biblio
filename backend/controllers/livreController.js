// controllers/livreController.js
const Livre = require('../models/livre');

// Create a new Livre
const createLivre = async (req, res) => {
  try {
    const {
      isbn, titre, auteur, editeur,
      anneePublication, langue, description,
      categorie, quantite
    } = req.body;

    const imagePath = req.file ? req.file.filename : null;

    const livre = new Livre({
      isbn,
      titre,
      auteur,
      editeur,
      anneePublication,
      langue,
      description,
      categorie,
      quantite: quantite || 1,
      imageCouverture: imagePath
    });

    await livre.save();
    res.status(201).json(livre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all livres with pagination & optional search
const getAllLivres = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    const filter = search ? { titre: { $regex: search, $options: "i" } } : {};

    const total = await Livre.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const livres = await Livre.find(filter)
      .populate('categorie')
      .skip(skip)
      .limit(limit);

    res.json({ livres, totalPages, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single Livre
const getLivreById = async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.id).populate('categorie');
    if (!livre) return res.status(404).json({ message: 'Livre non trouvé' });
    res.json(livre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Livre (with optional new image)
const updateLivre = async (req, res) => {
  try {
    const {
      isbn, titre, auteur, editeur,
      anneePublication, langue, description,
      categorie, quantite
    } = req.body;

    const updateData = {
      isbn, titre, auteur, editeur,
      anneePublication, langue, description,
      categorie, quantite
    };

    if (req.file) updateData.imageCouverture = req.file.filename;

    const livre = await Livre.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!livre) return res.status(404).json({ message: 'Livre non trouvé' });

    res.json(livre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Livre
const deleteLivre = async (req, res) => {
  try {
    const livre = await Livre.findByIdAndDelete(req.params.id);
    if (!livre) return res.status(404).json({ message: 'Livre non trouvé' });
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