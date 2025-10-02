import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { toast } from "react-toastify";
import { FaTimes, FaPlus, FaArrowLeft, FaSpinner, FaExclamationTriangle, FaCheck } from "react-icons/fa";
import { jwtDecode } from 'jwt-decode'; 

export default function MesReservations() {
  const [reservations, setReservations] = useState([]);
  const [exemplaires, setExemplaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exemplairesLoading, setExemplairesLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedExemplaire, setSelectedExemplaire] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Décoder token
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUser({ nom: decoded.nom, prenom: decoded.prenom, role: decoded.role, id: decoded.id });
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate, token]);

  // Récupérer réservations
  const fetchReservations = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);

    try {
      const endpoint = user.role === "etudiant" ? "/reservations/mes-reservations" : "/reservations";
      const res = await api.get(endpoint, { headers: { Authorization: `Bearer ${token}` } });

      const sortedReservations = res.data.sort((a, b) => {
        const statusOrder = { "en attente": 1, "confirmée": 2, "annulée": 3 };
        return statusOrder[a.statutReservation] - statusOrder[b.statutReservation] || new Date(b.createdAt) - new Date(a.createdAt);
      });

      setReservations(sortedReservations);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => { if (user) fetchReservations(); }, [user, fetchReservations]);

  // Récupérer exemplaires disponibles
  const fetchExemplaires = useCallback(async () => {
    if (!token) return;
    setExemplairesLoading(true);
    try {
      const res = await api.get("/exemplaires/disponibles", { headers: { Authorization: `Bearer ${token}` } });
      setExemplaires(res.data.items);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors du chargement des exemplaires");
    } finally {
      setExemplairesLoading(false);
    }
  }, [token]);

  // Annuler réservation
  const handleCancel = async (id) => {
    if (!window.confirm("Voulez-vous vraiment annuler cette réservation ?")) return;
    try {
      await api.delete(`/reservations/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setReservations(prev => prev.map(r => r._id === id ? { ...r, statutReservation: "annulée" } : r));
      toast.success("Réservation annulée !");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'annulation");
    }
  };

  // Confirmer réservation
  const handleConfirm = async (id) => {
    if (!window.confirm("Voulez-vous vraiment confirmer cette réservation ?")) return;
    try {
      await api.post(`/reservations/confirmer/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setReservations(prev => prev.map(r => r._id === id ? { ...r, statutReservation: "confirmée" } : r));
      toast.success("Réservation confirmée !");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la confirmation");
    }
  };

  // Créer réservation
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!selectedExemplaire) { toast.error("Veuillez choisir un exemplaire"); return; }
    try {
      await api.post("/reservations/ajouter", { exemplaire: selectedExemplaire }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Réservation créée !");
      setShowModal(false);
      setSelectedExemplaire("");
      fetchReservations();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la création");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmée": return "bg-green-100 text-green-700";
      case "annulée": return "bg-red-100 text-red-700";
      case "en attente": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "N/A";

  if (loading) return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl relative">
      <div className="flex justify-center items-center py-10">
        <FaSpinner className="animate-spin text-2xl text-blue-500 mr-2" />
        <p>Chargement de vos réservations...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-2xl relative">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition">
        <FaArrowLeft /> Retour
      </button>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{user?.role === "etudiant" ? "Mes Réservations" : "Gestion des Réservations"}</h2>
        {(user?.role === "etudiant" || user?.role === "admin") && (
          <button onClick={() => { fetchExemplaires(); setShowModal(true); }} className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
            <FaPlus className="mr-2" /> Nouvelle Réservation
          </button>
        )}
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-10">
          <FaExclamationTriangle className="text-3xl text-yellow-500 mx-auto mb-3" />
          <p className="text-lg">Aucune réservation trouvée.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Livre</th>
                <th className="p-3">Statut</th>
                {(user?.role === "employe" || user?.role === "admin") && <th className="p-3">Utilisateur</th>}
                <th className="p-3">Date de création</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((resv) => (
                <tr key={resv._id} className="border-b hover:bg-gray-50 transition duration-150">
                  <td className="p-3">{resv.exemplaire?.livreId ? `${resv.exemplaire.livreId.titre} -${resv.exemplaire.livreId.auteur}` : "Titre inconnu"} </td>
                  <td className="p-3"><span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(resv.statutReservation)}`}>{resv.statutReservation}</span></td>
                  {(user?.role === "employe" || user?.role === "admin") && <td className="p-3">{resv.utilisateur ? `${resv.utilisateur.prenom} ${resv.utilisateur.nom}` : "Utilisateur inconnu"}</td>}
                  <td className="p-3">{formatDate(resv.createdAt)}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      {resv.statutReservation === "en attente" && (user?.role === "etudiant" || user?.role === "admin") && <button onClick={() => handleCancel(resv._id)} className="flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"><FaTimes className="mr-1" /> Annuler</button>}
                      {resv.statutReservation === "en attente" && (user?.role === "employe" || user?.role === "admin") && <button onClick={() => handleConfirm(resv._id)} className="flex items-center px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"><FaCheck className="mr-1" /> Confirmer</button>}
                      {resv.statutReservation !== "annulée" && (user?.role === "employe" || user?.role === "admin") && <button onClick={() => handleCancel(resv._id)} className="flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"><FaTimes className="mr-1" /> Annuler</button>}
                      {resv.statutReservation === "annulée" && <span className="text-gray-400 italic text-sm">Aucune action</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (user?.role === "etudiant" || user?.role === "admin") && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Nouvelle Réservation</h3>
            {exemplairesLoading ? (
              <div className="flex justify-center items-center py-4">
                <FaSpinner className="animate-spin text-xl text-blue-500 mr-2" />
                <p>Chargement des exemplaires...</p>
              </div>
            ) : exemplaires.length === 0 ? (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                <p>Aucun exemplaire disponible pour le moment.</p>
              </div>
            ) : (
              <form onSubmit={handleCreate}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Sélectionner un exemplaire</label>
                  <select value={selectedExemplaire} onChange={(e) => setSelectedExemplaire(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    <option value="">-- Choisir un exemplaire --</option>
                    {exemplaires.map((ex) => (
                      <option key={ex._id} value={ex._id}>{ex.livreId ? `${ex.livreId.titre} - ${ex.livreId.auteur}` : "Titre inconnu"}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => { setShowModal(false); setSelectedExemplaire(""); }} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition">Annuler</button>
                  <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition" disabled={!selectedExemplaire}>Confirmer</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}