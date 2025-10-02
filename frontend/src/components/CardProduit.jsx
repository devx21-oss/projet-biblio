import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CardProduit({ produit }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const imageUrl = produit.imageCouverture
    ? `http://localhost:5000/uploads/${produit.imageCouverture}`
    : "/placeholder.jpg";

  const handleReservation = async () => {
    try {
      setError("");
      setSuccess("");
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Veuillez vous connecter pour réserver.");
        setLoading(false);
        return;
      }

      // Récupérer les exemplaires disponibles
      const res = await axios.get(
        "http://localhost:5000/api/exemplaires/disponibles",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ⚡ FIX: utiliser res.data directement
      const exemplaires = Array.isArray(res.data) ? res.data : res.data.items || [];

      const exemplaireDispo = exemplaires.find(
        (ex) => ex.livreId?._id === produit._id
      );

      if (!exemplaireDispo) {
        setError("Aucun exemplaire disponible pour ce livre.");
        setLoading(false);
        return;
      }

      // Créer réservation
      await axios.post(
        "http://localhost:5000/api/reservations/ajouter",
        { exemplaire: exemplaireDispo._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Réservation effectuée !");
      setTimeout(() => {
        setOpen(false);
        navigate("/MesReservations");
      }, 1500);
    } catch (err) {
      console.error("Reservation Error:", err);
      setError(err.response?.data?.message || "Erreur lors de la réservation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ---- small card ---- */}
      <motion.div
        className="cursor-pointer rounded-3xl shadow-lg p-4 bg-gradient-to-br from-indigo-100 via-pink-100 to-yellow-100 hover:from-pink-200 hover:via-yellow-200 hover:to-indigo-200 transition-transform transform hover:scale-105 duration-300"
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.07 }}
      >
        <img
          src={imageUrl}
          alt={produit.titre}
          className="w-full h-44 object-cover mb-3 rounded-2xl shadow-md"
        />
        <h3 className="font-bold text-lg truncate">{produit.titre}</h3>
        <p className="text-gray-700 text-sm line-clamp-2">{produit.description}</p>
        <p className="text-green-600 font-semibold mt-2">{produit.prix} €</p>
      </motion.div>

      {/* ---- modal ---- */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-y-auto max-h-[85vh] relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-4 rounded-t-3xl shadow-lg text-white flex justify-between items-center">
                <h2 className="text-xl font-bold">{produit.titre}</h2>
                <button
                  className="text-xl font-bold hover:text-gray-200 transition"
                  onClick={() => setOpen(false)}
                >
                  ✖
                </button>
              </div>

              <div className="p-6 space-y-4">
                <motion.img
                  src={imageUrl}
                  alt={produit.titre}
                  className="w-full h-60 object-cover rounded-2xl shadow-lg"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <p className="text-gray-700 text-sm">{produit.description}</p>
                <p className="text-green-600 font-bold text-lg">Prix: {produit.prix} €</p>
                <p className="text-gray-500">Quantité disponible: {produit.quantite}</p>

                {/* ---- animated messages ---- */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      className="text-red-600 font-semibold"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {error}
                    </motion.p>
                  )}
                  {success && (
                    <motion.p
                      className="text-green-600 font-semibold"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {success}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-2 rounded-xl font-semibold shadow-lg text-white ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                  } transition`}
                  onClick={handleReservation}
                  disabled={loading}
                >
                  {loading ? "Réservation..." : "Réserver"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
