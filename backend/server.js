const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

connectDB(); // Connexion à la base de données

const app = express();
app.use(express.json());


app.get('/', (req, res) => res.send('Backend opérationnel'));
app.use('/api/users', userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${process.env.PORT}`);
});
