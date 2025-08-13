const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
const cors = require('cors');

connectDB();

const app = express();

app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const amendeRoutes = require('./routes/amendeRoutes');
const categorieRoutes = require('./routes/categorieRoutes.js');
const commandeRoutes = require('./routes/commandeFournisseurRoutes');
const livreRoutes = require('./routes/livreRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const exemplaireRoutes = require('./routes/exemplaireRoutes');
const pretRoutes = require('./routes/pretRoutes');
const ligneCommandeRoutes = require('./routes/ligneCommandeFournisseurRoutes.js');
const reservationRoutes = require('./routes/reservationRoutes.js');
const authRoutes = require('./routes/authRoutes'); // <-- أضف هذا السطر

const errorHandler = require('./middlewares/errorHandler');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.get('/', (req, res) => res.send('Backend opérationnel'));

app.use('/api/users', userRoutes);
app.use('/api/amendes', amendeRoutes);
app.use('/api/categories', categorieRoutes);
app.use('/api/commandes', commandeRoutes);
app.use('/api/livres', livreRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/exemplaires', exemplaireRoutes);
app.use('/api/prets', pretRoutes);
app.use('/api/lignes-commandes', ligneCommandeRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/auth', authRoutes); 

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
