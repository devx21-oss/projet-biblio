import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { BookOpen, CalendarCheck, Library } from 'lucide-react';
import { api } from '../api/axios';
import CardProduit from '../components/CardProduit';

export default function Accueil() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const res = await api.get('/livres');
        setProduits(res.data);
      } catch (err) {
        setError('Erreur lors du chargement des livres.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Section principale avec background */}
      <div
        className="flex-grow bg-cover bg-center flex flex-col"
        style={{ backgroundImage: "url('/images/bibliotheque.jpg')" }}
      >
        <div className="bg-black bg-opacity-60 flex-grow flex flex-col items-center justify-center text-white px-6 py-20 text-center">
          <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
            Bienvenue à votre Bibliothèque d'Arcadie
          </h1>
          <p className="max-w-xl mb-10 text-lg drop-shadow-md">
            Dans un coin tranquille du monde… les livres cachent des âmes qui parlent. <br />
            Lisez, et laissez-les vous murmurer ce que nul autre n’a osé dire.
          </p>

          {/* Toujours afficher les boutons Se connecter et Créer un compte */}
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
            <div className="bg-white bg-opacity-20 rounded-lg p-6 shadow-lg backdrop-blur-sm text-center">
              <CalendarCheck className="mx-auto mb-3 text-white" size={32} />
              <h3 className="text-xl font-semibold mb-2">Réservation simple</h3>
              <p>Choisissez vos livres et réservez-les en quelques secondes.</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-6 shadow-lg backdrop-blur-sm text-center">
              <BookOpen className="mx-auto mb-3 text-white" size={32} />
              <h3 className="text-xl font-semibold mb-2">Suivi intelligent</h3>
              <p>Suivez vos emprunts à tout moment et recevez des rappels utiles.</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-6 shadow-lg backdrop-blur-sm text-center">
              <Library className="mx-auto mb-3 text-white" size={32} />
              <h3 className="text-xl font-semibold mb-2">Univers de lecture</h3>
              <p>Parcourez une collection riche pour éveiller votre curiosité.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section affichage des livres */}
      <div className="max-w-6xl mx-auto mt-12 px-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Nos Livres Disponibles</h2>

        {loading && <p className="text-center text-lg">Chargement des livres...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {produits.map((p) => (
            <CardProduit key={p._id || p.id} produit={p} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
