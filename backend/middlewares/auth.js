const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware d'authentification
const auth = async (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }

    const token = authHeader.replace('Bearer ', '').trim();

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'id utilisateur depuis le token
    const userId = decoded.id || decoded.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Token invalide.' });
    }

    // Trouver l'utilisateur dans la base de données
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé.' });
    }

    if (user.statut !== 'actif') {
      return res.status(401).json({ message: 'Compte utilisateur inactif ou suspendu.' });
    }

    // Ajouter l'utilisateur et token à l'objet request
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    console.error('Erreur auth middleware:', error);
    return res.status(401).json({ message: 'Token invalide.' });
  }
};

// Middleware d'autorisation (rôles)
// Accepte un rôle ou un tableau de rôles
const authorize = (roles) => {
  // Convertir roles en tableau si c'est une chaîne
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentification requise.' });
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé. Permissions insuffisantes.' });
    }

    next();
  };
};


module.exports = { auth, authorize };
