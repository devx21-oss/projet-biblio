// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Validation error من Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  // خطأ مفتاح مكرر في MongoDB (مثل تكرار إيميل)
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Une entrée avec ces données existe déjà.' });
  }

  // أخطاء JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Token invalide.' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expiré.' });
  }

  // أي خطأ آخر غير معروف
  res.status(500).json({
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = errorHandler;
