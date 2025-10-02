const User = require('../models/User');
const bcrypt = require('bcryptjs');  
const jwt = require('jsonwebtoken');

// ==================== TOKEN GENERATOR ====================
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      nom: user.nom || '',
      prenom: user.prenom || ''
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// ==================== CREATE USER (ADMIN) ====================
const createUser = async (req, res) => {
  try {
    const {
      nom, prenom, email, motDePasse, role,
      matricule, departement, roleEmploye,
      numeroEtudiant, filiere, niveauEtude, maxEmprunts,
      nomEntreprise, siret, adresseEntreprise, contactPrincipal
    } = req.body;

    if (!motDePasse) return res.status(400).json({ message: 'Le mot de passe est obligatoire.' });
    if (!['employe', 'etudiant', 'supplier', 'admin'].includes(role)) return res.status(400).json({ message: 'Role invalide.' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });

    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    const photo = req.file ? req.file.filename : undefined;

    const user = new User({
      nom, prenom, email, motDePasse: hashedPassword, role,
      matricule, departement, roleEmploye,
      numeroEtudiant, filiere, niveauEtude, maxEmprunts,
      nomEntreprise, siret, adresseEntreprise, contactPrincipal,
      photo
    });

    await user.save();

    const token = generateToken(user);
    const userResponse = user.toObject();
    delete userResponse.motDePasse;

    res.status(201).json({ message: 'Utilisateur créé avec succès.', user: userResponse, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== REGISTER STUDENT ====================
const register = async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse, numeroEtudiant, filiere, niveauEtude } = req.body;

    if (!motDePasse) return res.status(400).json({ message: 'Le mot de passe est obligatoire.' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });

    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    const photo = req.file ? req.file.filename : undefined;

    const user = new User({
      nom, prenom, email,
      motDePasse: hashedPassword,
      role: 'etudiant',
      numeroEtudiant, filiere, niveauEtude,
      maxEmprunts: 3,
      photo
    });

    await user.save();

    const token = generateToken(user);
    const userResponse = user.toObject();
    delete userResponse.motDePasse;

    res.status(201).json({ message: 'Étudiant inscrit avec succès.', user: userResponse, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== LOGIN ====================
const login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    if (!email || !motDePasse) return res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    if (user.statut !== 'actif') return res.status(401).json({ message: 'Compte utilisateur inactif ou suspendu.' });

    const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect.' });

    const token = generateToken(user);
    const userResponse = user.toObject();
    delete userResponse.motDePasse;

    res.json({ message: 'Connexion réussie.', user: userResponse, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== UPDATE USER ====================
const updateUser = async (req, res) => {
  try {
    const updates = req.body || {};
    if (updates.motDePasse) updates.motDePasse = await bcrypt.hash(updates.motDePasse, 10);
    if (req.file) updates.photo = req.file.filename;

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-motDePasse');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    res.json({ message: 'Utilisateur mis à jour.', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== EDIT USER PROFILE ====================
const editProfile = async (req, res) => {
  try {
    console.log("📩 Données reçues:", req.body);
    console.log("📷 Fichier reçu:", req.file);
    console.log("👤 Utilisateur ID:", req.user?.id);

    const updates = req.body || {};

    delete updates.role;
    delete updates.statut;

    if (updates.motDePasse) {
      updates.motDePasse = await bcrypt.hash(updates.motDePasse, 10);
    }

    if (req.file) {
      updates.photo = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-motDePasse');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    res.json({ message: 'Profil mis à jour avec succès.', user });
  } catch (error) {
    console.error("❌ Erreur dans editProfile:", error);
    res.status(500).json({ 
      message: "Erreur serveur lors de la mise à jour", 
      error: error.message,
      stack: error.stack 
    });
  }
};


module.exports = {
  createUser,
  register,
  login,
  updateUser,
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      res.json({ message: 'Utilisateur supprimé.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select('-motDePasse');
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-motDePasse');
      if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getUsersByRole: async (req, res) => {
    try {
      let users;
      if (req.user.role === 'admin') users = await User.find().select('-motDePasse');
      else if (req.user.role === 'supplier') users = await User.find({ role: 'supplier' }).select('-motDePasse');
      else return res.status(403).json({ message: 'Accès refusé.' });

      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  editProfile,
  getMyProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-motDePasse");
      if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
