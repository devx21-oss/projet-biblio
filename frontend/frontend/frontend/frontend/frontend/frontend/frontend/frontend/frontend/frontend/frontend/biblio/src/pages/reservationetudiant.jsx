import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import { toast } from "react-toastify";
import { FaTimes, FaPlus } from "react-icons/fa";

export default function MesReservations() {
  const [reservations, setReservations] = useState([]);
  const [exemplaires, setExemplaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedExemplaire, setSelectedExemplaire] = useState("");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await api.get("/reservations/mes-reservations");
      setReservations(res.data);
    } catch {
      toast.error("Erreur lors du chargement des réservations");
    } finally {
      setLoading(false);
    }
  };

  const fetchExemplaires = async () => {
    try {
      const res = await api.get("/exemplaires");
      setExemplaires(res.data);
    } catch {
      toast.error("Erreur lors du chargement des exemplaires");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Voulez-vous vraiment annuler cette réservation ?"))
      return;
    try {
      await api.delete(`/reservations/${id}`);
      setReservations((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, statutReservation: "annulée" } : r
        )
      );
      toast.success("Réservation annulée !");
    } catch {
      toast.error("Erreur lors de l'annulation");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!selectedExemplaire) return toast.error("Veuillez choisir un exemplaire");
    try {
      await api.post("/reservations/ajouter", {
        exemplaire: selectedExemplaire,
      });
      toast.success("Réservation créée !");
      setShowModal(false);
      fetchReservations();
    } catch {
      toast.error("Erreur lors de la création");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmée":
        return "bg-green-100 text-green-700";
      case "annulée":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mes Réservations</h2>
        <button
          onClick={() => {
            fetchExemplaires();
            setShowModal(true);
          }}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          <FaPlus className="mr-2" /> Nouvelle Réservation
        </button>
      </div>

      {reservations.length === 0 ? (
        <p className="text-center">Aucune réservation trouvée.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Livre</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((resv) => (
              <tr
                key={resv._id}
                className="border-b hover:bg-gray-50 transition duration-150"
              >
                <td className="p-3">
                  {resv.exemplaire?.livre?.titre || "Titre inconnu"}
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      resv.statutReservation
                    )}`}
                  >
                    {resv.statutReservation}
                  </span>
                </td>
                <td className="p-3">
                  {resv.statutReservation === "en attente" ? (
                    <button
                      onClick={() => handleCancel(resv._id)}
                      className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      <FaTimes className="mr-2" /> Annuler
                    </button>
                  ) : (
                    <span className="text-gray-400 italic">Aucune action</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal création réservation */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Nouvelle Réservation</h3>
            <form onSubmit={handleCreate}>
              <select
                value={selectedExemplaire}
                onChange={(e) => setSelectedExemplaire(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 mb-4"
              >
                <option value="">-- Choisir un exemplaire --</option>
                {exemplaires.map((ex) => (
                  <option key={ex._id} value={ex._id}>
                    {ex.livre?.titre || "Titre inconnu"} ({ex._id})
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
