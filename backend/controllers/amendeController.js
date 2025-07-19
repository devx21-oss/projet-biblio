const Amende = require('../models/Amende');

const createAmende = async (req, res) => {
  try {
    const { montant, motif, etudiantId, pretId, dateCreationAmende } = req.body;

    const amende = new Amende({
      montant,
      motif,
      etudiantId,
      pretId,
      dateCreationAmende: dateCreationAmende || new Date(),
      status: 'impayée'
    });

    await amende.save();
    res.status(201).json({ message: 'Amende créée.', amende });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAmendes = async (req, res) => {
  try {
    const amendes = await Amende.find().populate(['etudiantId', 'pretId']);
    res.json(amendes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAmendeById = async (req, res) => {
  try {
    const amende = await Amende.findById(req.params.id).populate(['etudiantId', 'pretId']);
    if (!amende) return res.status(404).json({ message: 'Amende non trouvée.' });
    res.json(amende);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAmende = async (req, res) => {
  try {
    const updates = req.body;
    const amende = await Amende.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!amende) return res.status(404).json({ message: 'Amende non trouvée.' });
    res.json({ message: 'Amende mise à jour.', amende });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAmende = async (req, res) => {
  try {
    const amende = await Amende.findByIdAndDelete(req.params.id);
    if (!amende) return res.status(404).json({ message: 'Amende non trouvée.' });
    res.json({ message: 'Amende supprimée.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAmende,
  getAllAmendes,
  getAmendeById,
  updateAmende,
  deleteAmende
};
