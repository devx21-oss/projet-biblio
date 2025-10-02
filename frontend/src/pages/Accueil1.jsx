import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CardProduit from "../components/CardProduit";
import Footer from "../components/Footer";
import { CalendarCheck, BookOpen, Library } from "lucide-react";
import { api } from "../api/axios";
import Chatbot from "../components/chatbot";

export default function Accueil() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(`/livres?page=${page}&limit=${itemsPerPage}`);
        
        // ✅ Structure attendue : { livres: [], totalPages: X }
        let livres = [];
        let total = 1;

        if (res.data) {
          if (Array.isArray(res.data)) {
            livres = res.data;
          } else {
            livres = res.data.livres || [];
            total = res.data.totalPages || 1;
          }
        }

        setProduits(livres);
        setTotalPages(total);
      } catch (err) {
        console.error("Erreur fetch livres:", err);
        setError("Erreur lors du chargement des livres.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();
  }, [page]);

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative">
      {/* Section bienvenue */}
      <div
        className="bg-cover bg-center flex flex-col"
        style={{ backgroundImage: "url('/images/bibliotheque.jpg')" }}
      >
        <div className="bg-black bg-opacity-60 flex-grow flex flex-col items-center justify-center text-white px-6 py-20 text-center">
          <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
            Bienvenue à votre Bibliothèque d'Arcadie
          </h1>
          <p className="max-w-xl mb-10 text-lg drop-shadow-md">
            Dans un coin tranquille du monde… les livres cachent des âmes qui
            parlent. <br />
            Lisez, et laissez-les vous murmurer ce que nul autre n’a osé dire.
          </p>

          {/* Boutons */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold shadow-lg transition"
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              className="border border-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-semibold transition"
            >
              Créer un compte
            </Link>
          </div>

          {/* Cards info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
            <div className="bg-white bg-opacity-20 rounded-lg p-6 shadow-lg backdrop-blur-sm text-center hover:scale-105 transition-transform">
              <CalendarCheck className="mx-auto mb-3 text-white" size={32} />
              <h3 className="text-xl font-semibold mb-2">Réservation simple</h3>
              <p>Choisissez vos livres et réservez-les en quelques secondes.</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-6 shadow-lg backdrop-blur-sm text-center hover:scale-105 transition-transform">
              <BookOpen className="mx-auto mb-3 text-white" size={32} />
              <h3 className="text-xl font-semibold mb-2">Suivi intelligent</h3>
              <p>
                Suivez vos emprunts à tout moment et recevez des rappels utiles.
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-6 shadow-lg backdrop-blur-sm text-center hover:scale-105 transition-transform">
              <Library className="mx-auto mb-3 text-white" size={32} />
              <h3 className="text-xl font-semibold mb-2">Univers de lecture</h3>
              <p>
                Parcourez une collection riche pour éveiller votre curiosité.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Livres */}
      <div className="max-w-6xl mx-auto mt-16 px-6">
        <h2 className="text-3xl font-bold text-center relative inline-block after:content-[''] after:block after:w-16 after:h-1 after:bg-blue-600 after:mx-auto after:mt-2 mb-12">
          Nos Livres Disponibles
        </h2>

        {loading && (
          <p className="text-center text-lg animate-pulse">
            Chargement des livres...
          </p>
        )}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && !error && produits.length === 0 && (
          <p className="text-center text-gray-500">
            Aucun livre disponible pour le moment.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {produits.map((p) => (
            <div
              key={p._id || p.id}
              className="transform hover:scale-105 transition duration-300"
            >
              <CardProduit produit={p} />
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 transition"
            >
              ◀ Précédent
            </button>
            <span className="font-semibold">
              Page {page} / {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 transition"
            >
              Suivant ▶
            </button>
          </div>
        )}
      </div>

      <Footer />
      <Chatbot />
    </div>
  );
}
