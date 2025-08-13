import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import { toast } from "react-toastify";
import { FaUndo } from "react-icons/fa";
import { MdAddAlarm } from "react-icons/md";
import { HiOutlineBookOpen } from "react-icons/hi";

export default function PretOverdue() {
  const [prets, setPrets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const fetchOverdue = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/prets/overdue");
        setPrets(data);
      } catch {
        toast.error("❌ Erreur lors du chargement des prêts en retard");
      } finally {
        setLoading(false);
      }
    };
    fetchOverdue();
  }, []);

  const handleReturnPret = async (id) => {
    if (!window.confirm("📦 Confirmer le retour de ce prêt ?")) return;
    try {
      setProcessingId(id);
      await api.put(`/prets/${id}/return`);
      setPrets((prev) => prev.filter((pret) => pret._id !== id));
      toast.success("✅ Prêt retourné avec succès !");
    } catch {
      toast.error("❌ Erreur lors du retour du prêt");
    } finally {
      setProcessingId(null);
    }
  };

  const handleExtendPret = async (id) => {
    try {
      setProcessingId(id);
      const { data } = await api.put(`/prets/${id}/extend`);
      setPrets((prev) => prev.map((pret) => (pret._id === id ? data : pret)));
      toast.success("⏳ Prêt prolongé de 7 jours !");
    } catch {
      toast.error("❌ Erreur lors de la prolongation du prêt");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-blue-600 font-medium text-lg animate-pulse">
        Chargement des prêts en retard...
      </div>
    );
  }

  if (prets.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        🎉 Aucun prêt en retard trouvé.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-red-600">
        <HiOutlineBookOpen className="text-3xl" /> Prêts en Retard
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-xs">
              <th className="p-3 text-left">📖 Livre</th>
              <th className="p-3 text-left">👤 Étudiant</th>
              <th className="p-3 text-left">📅 Emprunté le</th>
              <th className="p-3 text-left">⏰ Retour prévu</th>
              <th className="p-3 text-center">⚙ Actions</th>
            </tr>
          </thead>
          <tbody>
            {prets.map((pret) => (
              <tr
                key={pret._id}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="p-3 font-medium">
                  {pret.exemplaire?.livre?.titre || "N/A"}
                </td>
                <td className="p-3">
                  {pret.etudiant?.nom} {pret.etudiant?.prenom}
                </td>
                <td className="p-3">{formatDate(pret.dateEmprunt)}</td>
                <td className="p-3 text-red-500 font-semibold">
                  {formatDate(pret.dateRetourPrevue)}
                </td>
                <td className="p-3 flex justify-center gap-2">
                  <button
                    onClick={() => handleReturnPret(pret._id)}
                    disabled={processingId === pret._id}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition"
                  >
                    <FaUndo />{" "}
                    {processingId === pret._id ? "..." : "Retourner"}
                  </button>
                  <button
                    onClick={() => handleExtendPret(pret._id)}
                    disabled={processingId === pret._id}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition"
                  >
                    <MdAddAlarm />{" "}
                    {processingId === pret._id ? "..." : "Prolonger 7j"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
