const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const amendeRoutes = require('./routes/amendeRoutes');
const categorieRoutes = require('./routes/categorieRoutes.js');
const commandeRoutes = require('./routes/commandeFournisseurRoutes');
const livreRoutes = require('./routes/livreRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const exemplaireRoutes = require('./routes/exemplaireRoutes');

const errorHandler = require('./middlewares/errorHandler');

dotenv.config();

connectDB();

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Route racine simple pour tester si le serveur tourne
app.get('/', (req, res) => res.send('Backend opérationnel'));

// Routes API
app.use('/api/users', userRoutes);
app.use('/api/amendes', amendeRoutes);
app.use('/api/categories', categorieRoutes);
app.use('/api/commandes', commandeRoutes);
app.use('/api/livres', livreRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/exemplaires', exemplaireRoutes);

// Middleware global pour la gestion des erreurs
app.use(errorHandler);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
