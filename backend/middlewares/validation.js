// Validation middleware for different resources

// Validate loan creation
const validateLoan = (req, res, next) => {
  const { exemplaire, etudiant, dateEmprunt, dateRetourPrevue } = req.body;
  
  if (!exemplaire) {
    return res.status(400).json({ message: 'ID de l\'exemplaire requis.' });
  }
  
  if (!etudiant) {
    return res.status(400).json({ message: 'ID de l\'étudiant requis.' });
  }
  
  // Optional validation for dates
  if (dateEmprunt && isNaN(new Date(dateEmprunt).getTime())) {
    return res.status(400).json({ message: 'Format de date d\'emprunt invalide.' });
  }
  
  if (dateRetourPrevue && isNaN(new Date(dateRetourPrevue).getTime())) {
    return res.status(400).json({ message: 'Format de date de retour prévue invalide.' });
  }
  
  next();
};

// Validate reservation creation
const validateReservation = (req, res, next) => {
  const { exemplaire } = req.body;
  
  if (!exemplaire) {
    return res.status(400).json({ message: 'ID de l\'exemplaire requis.' });
  }
  
  next();
};

// Validate user creation/update
// Update the validateUser function to include admin role
const validateUser = (req, res, next) => {
  const { nom, prenom, email, role } = req.body;
  
  if (!nom || !prenom) {
    return res.status(400).json({ message: 'Nom et prénom requis.' });
  }
  
  if (!email) {
    return res.status(400).json({ message: 'Email requis.' });
  }
  
  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Format d\'email invalide.' });
  }
  
  if (role && !['admin', 'employe', 'etudiant', 'supplier'].includes(role)) {
    return res.status(400).json({ message: 'Rôle invalide.' });
  }
  
  next();
};

module.exports = {
  validateLoan,
  validateReservation,
  validateUser
};