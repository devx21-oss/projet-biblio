// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

const createUser = async (req, res) => {
  try {
    const {
      nom, prenom, email, motDePasse, role,
      matricule, departement, roleEmploye,
      numeroEtudiant, filiere, niveauEtude, maxEmprunts,
      nomEntreprise, siret, adresseEntreprise, contactPrincipal
    } = req.body;

    // Vérifie que le rôle est valide
    if (!['employe', 'etudiant', 'supplier','admin'].includes(role)) {
      return res.status(400).json({ message: 'Role invalide.' });
    }

    // Vérifie que l'utilisateur n'existe pas déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
    }

    // Hash du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(motDePasse, salt);

    const user = new User({
      nom, prenom, email, motDePasse: hashedPassword, role,
      matricule, departement, roleEmploye,
      numeroEtudiant, filiere, niveauEtude, maxEmprunts,
      nomEntreprise, siret, adresseEntreprise, contactPrincipal
    });

    await user.save();

    // Génère le token
    const token = generateToken(user);

    // Ne renvoie pas le mot de passe dans la réponse
    const userResponse = user.toObject();
    delete userResponse.motDePasse;

    res.status(201).json({
      message: 'Utilisateur créé avec succès.',
      user: userResponse,
      token: token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.motDePasse) {
      const salt = await bcrypt.genSalt(10);
      updates.motDePasse = await bcrypt.hash(updates.motDePasse, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    res.json({ message: 'Utilisateur mis à jour.', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.json({ message: 'Utilisateur supprimé.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add this new register function after the existing createUser function

const register = async (req, res) => {
  try {
    const {
      nom, prenom, email, motDePasse,
      numeroEtudiant, filiere, niveauEtude
    } = req.body;

    // Vérifie que l'utilisateur n'existe pas déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
    }

    // Hash du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(motDePasse, salt);

    // Crée un nouvel utilisateur avec le rôle 'etudiant' par défaut
    const user = new User({
      nom, 
      prenom, 
      email, 
      motDePasse: hashedPassword, 
      role: 'etudiant',  // Rôle étudiant par défaut
      numeroEtudiant, 
      filiere, 
      niveauEtude,
      maxEmprunts: 3  // Valeur par défaut pour les étudiants
    });

    await user.save();

    // Génère le token
    const token = generateToken(user);

    // Ne renvoie pas le mot de passe dans la réponse
    const userResponse = user.toObject();
    delete userResponse.motDePasse;

    res.status(201).json({
      message: 'Étudiant inscrit avec succès.',
      user: userResponse,
      token: token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update the module.exports to include the new register function
module.exports = {
  createUser,
  register,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};

// Add this login function after the register function
const login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    // Validate input
    if (!email || !motDePasse) {
      return res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe.' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Check if user is active
    if (user.statut !== 'actif') {
      return res.status(401).json({ message: 'Compte utilisateur inactif ou suspendu.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isMatch) {
      return res.status(401).json({ message: ' mot de passe incorrect.' });
    }

    // Generate token
    const token = generateToken(user);

    // Don't send password in response
    const userResponse = user.toObject();
    delete userResponse.motDePasse;

    res.json({
      message: 'Connexion réussie.',
      user: userResponse,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update the module.exports to include the new login function
module.exports = {
  createUser,
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};