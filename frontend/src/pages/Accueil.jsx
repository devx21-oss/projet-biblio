import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate, generatePath } from 'react-router-dom';
import { BookOpen, CalendarCheck, Library, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import CardProduit from '../components/CardProduit';
import Footer from '../components/Footer';
import { api } from '../api/axios';
import { jwtDecode } from 'jwt-decode';

// Constantes pour les routes (évite les strings magiques)
const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profil',
  RESERVATIONS: '/MesReservations'
};

// Composant pour les cartes d'information réutilisables
const InfoCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white bg-opacity-20 rounded-lg p-6 shadow-lg backdrop-blur-sm text-center transition-transform hover:scale-105">
    <Icon className="mx-auto mb-3 text-white" size={32} />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-sm md:text-base">{description}</p>
  </div>
);

// Composant de pagination séparé pour une meilleure maintenabilité
const Pagination = ({ currentPage, totalPages, onPrev, onNext, className = '' }) => {
  if (totalPages <= 1) return null;
  
  return (
    <div className={`flex flex-col sm:flex-row justify-center items-center gap-4 ${className}`}>
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors duration-200"
        aria-label="Page précédente"
      >
        <ChevronLeft size={18} className="mr-1" />
        Précédent
      </button>
      <span className="text-sm md:text-base font-medium">
        Page {currentPage} / {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors duration-200"
        aria-label="Page suivante"
      >
        Suivant
        <ChevronRight size={18} className="ml-1" />
      </button>
    </div>
  );
};

// Composant de chargement avec skeleton screens
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
    ))}
  </div>
);

export default function Accueil() {
  const [produits, setProduits] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const itemsPerPage = 6;

  // Vérifier token et utilisateur avec gestion d'erreur améliorée
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      
      // Vérification de l'expiration du token
      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp < currentTime) {
        throw new Error("Token expiré");
      }
      
      setUser({
        nom: decoded.nom || 'Utilisateur',
        prenom: decoded.prenom || '',
        role: decoded.role || 'inconnu',
      });
    } catch (err) {
      console.error("Erreur décodage token:", err);
      localStorage.removeItem('token');
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [navigate]);

  // Récupération livres avec pagination et gestion d'annulation
  const fetchLivres = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/livres?page=${page}&limit=${itemsPerPage}`, { signal });
      
      // Gestion plus robuste de la réponse API
      const responseData = res.data || {};
      const livresData = Array.isArray(responseData) 
        ? responseData 
        : responseData.livres || [];
      
      setProduits(livresData);
      setTotalPages(responseData.totalPages || 1);
    } catch (err) {
      // Ne pas afficher d'erreur si la requête a été annulée
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      
      console.error(err);
      setError('Erreur lors du chargement des livres. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, [page, itemsPerPage]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    
    fetchLivres(signal);
    
    // Nettoyage: annule la requête si le composant est démonté
    return () => controller.abort();
  }, [fetchLivres]);

  const handleNext = useCallback(() => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
      // Scroll doux vers le haut de la section des livres
      document.getElementById('livres-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [page, totalPages]);

  const handlePrev = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1);
      document.getElementById('livres-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [page]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    navigate(ROUTES.LOGIN);
  }, [navigate]);

  // Mémorisation des cartes d'information pour éviter les recréations inutiles
  const infoCards = useMemo(() => [
    {
      icon: CalendarCheck,
      title: "Réservation simple",
      description: "Choisissez vos livres et réservez-les rapidement."
    },
    {
      icon: BookOpen,
      title: "Suivi intelligent",
      description: "Suivez vos emprunts et recevez des rappels utiles."
    },
    {
      icon: Library,
      title: "Univers de lecture",
      description: "Parcourez une collection riche pour éveiller votre curiosité."
    }
  ], []);

  // Rendu conditionnel pour éviter la répétition
  const renderAuthButtons = useMemo(() => {
    if (!user) {
      return (
        <>
          <Link
            to={ROUTES.LOGIN}
            className="bg-blue-600 hover:bg-blue-700 px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold shadow-lg transition-colors duration-200"
          >
            Se connecter
          </Link>
          <Link
            to={ROUTES.REGISTER}
            className="border border-white hover:bg-white hover:text-blue-600 px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Créer un compte
          </Link>
        </>
      );
    }

    return (
      <>
        <button 
          onClick={() => navigate(ROUTES.PROFILE)} 
          className="px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold shadow-lg bg-green-600 hover:bg-green-700 text-sm md:text-base transition-colors duration-200"
        >
          Bienvenue, {user.prenom} {user.nom} ({user.role})
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold shadow-lg transition-colors duration-200"
        >
          Se déconnecter
        </button>

        {/* Bouton Mes Réservations */}
        {user.role === 'etudiant' && (
          <button
            onClick={() => navigate(ROUTES.RESERVATIONS)}
            className="bg-yellow-500 hover:bg-yellow-600 px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold shadow-lg transition-colors duration-200"
          >
            Mes Réservations
          </button>
        )}
      </>
    );
  }, [user, handleLogout, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Section bienvenue */}
      <section
        className="bg-cover bg-center flex flex-col"
        style={{ backgroundImage: "url('/images/bibliotheque.jpg')" }}
      >
        <div className="bg-black bg-opacity-60 flex-grow flex flex-col items-center justify-center text-white px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg">
            Bienvenue à votre Bibliothèque d'Arcadie
          </h1>
          <p className="max-w-xl mb-10 text-base md:text-lg drop-shadow-md">
            Dans un coin tranquille du monde… les livres cachent des âmes qui parlent. <br />
            Lisez, et laissez-les vous murmurer ce que nul autre n’a osé dire.
          </p>

          {/* Buttons selon connexion */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {renderAuthButtons}
          </div>

          {/* Cards info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl w-full">
            {infoCards.map((card, index) => (
              <InfoCard 
                key={index}
                icon={card.icon}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section Livres */}
      <section id="livres-section" className="max-w-6xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Nos Livres Disponibles</h2>

        {loading && <LoadingSkeleton />}
        
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => setPage(1)} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {produits.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Aucun livre disponible pour le moment.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {produits.map((p) => (
                    <CardProduit key={p._id || p.id} produit={p} />
                  ))}
                </div>

                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  className="mt-8"
                />
              </>
            )}
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}