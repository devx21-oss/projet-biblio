const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

connectDB();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", // React app URL
  credentials: true, // if you use cookies or auth headers
}));

// === Gemini AI setup ===
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    const reply = await result.response.text();
    res.json({ reply });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Something went wrong with Gemini API" });
  }
});

// === Routes ===
const userRoutes = require('./routes/userRoutes');
const amendeRoutes = require('./routes/amendeRoutes');
const categorieRoutes = require('./routes/categorieRoutes');
const commandeRoutes = require('./routes/commandeFournisseurRoutes');
const livreRoutes = require('./routes/livreRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const exemplaireRoutes = require('./routes/exemplaireRoutes');
const pretRoutes = require('./routes/pretRoutes');
const ligneCommandeRoutes = require('./routes/ligneCommandeFournisseurRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const authRoutes = require('./routes/authRoutes');

const errorHandler = require('./middlewares/errorHandler');

// === Middlewares ===
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.get('/', (req, res) => res.send('✅ Backend opérationnel'));

// === API Endpoints ===
app.use('/api/users', userRoutes);
app.use('/api/amendes', amendeRoutes);
app.use('/api/categories', categorieRoutes);
app.use('/api/commandes', commandeRoutes);
app.use('/api/livres', livreRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/notifications', notificationRoutes);
app.use('/api/exemplaires', exemplaireRoutes);
app.use('/api/prets', pretRoutes);
app.use('/api/lignes-commandes', ligneCommandeRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

// === Server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
