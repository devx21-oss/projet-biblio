import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import { toast } from "react-toastify";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function GestionReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await api.get("/reservations"); // employe/admin
      setReservations(res.data);
    } catch {
      toast.error("Erreur lors du chargement des réservations");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await api.post(`/reservations/confirmer/${id}`);
      setReservations((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, statutReservation: "confirmée" } : r
        )
      );
      toast.success("Réservation confirmée !");
    } catch {
      toast.error("Erreur lors de la confirmation");
    }
  };

  const handleCancel = async (id) => {
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

  if (loading) return <p className="text-center mt-6">Chargement...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Gestion des Réservations</h2>
      {reservations.length === 0 ? (
        <p>Aucune réservation trouvée.</p>
      ) : (
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Livre</th>
              <th className="p-3 text-left">Utilisateur</th>
              <th className="p-3 text-left">Statut</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((resv) => (
              <tr key={resv._id} className="border-t">
                <td className="p-3">{resv.exemplaire?.livre?.titre || "N/A"}</td>
                <td className="p-3">
                  {resv.utilisateur?.nom} {resv.utilisateur?.prenom}
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      resv.statutReservation === "en attente"
                        ? "bg-yellow-500"
                        : resv.statutReservation === "confirmée"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {resv.statutReservation}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  {resv.statutReservation === "en attente" && (
                    <>
                      <button
                        onClick={() => handleConfirm(resv._id)}
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleCancel(resv._id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
