// controllers/categorieController.js
const Categorie = require('../models/Categorie');

const createCategorie = async (req, res) => {
  try {
    const { nom, description, codeClassification } = req.body;

    const categorie = new Categorie({
      nom,
      description,
      codeClassification
    });

    await categorie.save();
    res.status(201).json({ message: 'Catégorie créée.', categorie });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Categorie.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategorieById = async (req, res) => {
  try {
    const categorie = await Categorie.findById(req.params.id);
    if (!categorie) return res.status(404).json({ message: 'Catégorie non trouvée.' });
    res.json(categorie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategorie = async (req, res) => {
  try {
    const updates = req.body;
    const categorie = await Categorie.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!categorie) return res.status(404).json({ message: 'Catégorie non trouvée.' });

    res.json({ message: 'Catégorie mise à jour.', categorie });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategorie = async (req, res) => {
  try {
    const categorie = await Categorie.findByIdAndDelete(req.params.id);
    if (!categorie) return res.status(404).json({ message: 'Catégorie non trouvée.' });
    res.json({ message: 'Catégorie supprimée.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Export as an object
module.exports = {
  createCategorie,
  getAllCategories,
  getCategorieById,
  updateCategorie,
  deleteCategorie
};