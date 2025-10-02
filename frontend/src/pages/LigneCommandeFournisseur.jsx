import React, { useEffect, useState } from "react";
import { api } from "../api/axios";

export default function LigneCommandeFournisseur() {
  const [commandes, setCommandes] = useState([]);
  const [selectedCommandeId, setSelectedCommandeId] = useState("");
  const [lignes, setLignes] = useState([]);
  const [newLigne, setNewLigne] = useState({ idLivre: "", quantite: 1, prixUnitaire: 0 });
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 🔹 Headers avec token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token manquant");
    return { Authorization: `Bearer ${token}` };
  };

  // 🔹 Fetch commandes
  useEffect(() => {
    async function fetchCommandes() {
      try {
        const res = await api.get("/commandes", { headers: getAuthHeaders() });
        setCommandes(Array.isArray(res.data) ? res.data : res.data.commandes || []);
      } catch (error) {
        console.error("Erreur fetching commandes:", error);
        setCommandes([]);
      }
    }
    fetchCommandes();
  }, []);

  // 🔹 Fetch lignes quand une commande est sélectionnée
  useEffect(() => {
    if (!selectedCommandeId) {
      setLignes([]);
      setTotal(0);
      return;
    }

    async function fetchLignes() {
      try {
        const res = await api.get(`/lignes-commandes/commande/${selectedCommandeId}`, {
          headers: getAuthHeaders()
        });
        // Si tu utilises pagination côté serveur
        const data = Array.isArray(res.data) ? res.data : res.data.items || [];
        setLignes(data);
        calculateTotal(data);
        setCurrentPage(1);
      } catch (error) {
        console.error("Erreur fetching lignes:", error);
        setLignes([]);
        setTotal(0);
      }
    }

    fetchLignes();
  }, [selectedCommandeId]);

  const calculateTotal = (lignesData) => {
    const sum = lignesData.reduce((acc, ligne) => acc + ligne.quantite * ligne.prixUnitaire, 0);
    setTotal(sum);
  };

  const handleChangeNewLigne = (e) => {
    const { name, value } = e.target;
    setNewLigne(prev => ({
      ...prev,
      [name]: name === "quantite" || name === "prixUnitaire" ? Number(value) : value
    }));
  };

  const handleAddLigne = async () => {
    if (!selectedCommandeId) return alert("Veuillez sélectionner une commande.");
    if (!newLigne.idLivre || newLigne.quantite <= 0 || newLigne.prixUnitaire <= 0)
      return alert("Veuillez remplir correctement tous les champs.");

    try {
      const payload = { idCommandeFournisseur: selectedCommandeId, ...newLigne };
      const res = await api.post("/lignes-commandes", payload, { headers: getAuthHeaders() });
      const updatedLignes = [...lignes, res.data];
      setLignes(updatedLignes);
      calculateTotal(updatedLignes);
      setNewLigne({ idLivre: "", quantite: 1, prixUnitaire: 0 });
    } catch (error) {
      console.error("Erreur ajout ligne:", error);
      alert(error.response?.data?.message || "Erreur lors de l'ajout");
    }
  };

  const handleDeleteLigne = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await api.delete(`/lignes-commandes/${id}`, { headers: getAuthHeaders() });
      const updatedLignes = lignes.filter(l => l._id !== id);
      setLignes(updatedLignes);
      calculateTotal(updatedLignes);
    } catch (error) {
      console.error("Erreur suppression ligne:", error);
      alert(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const handleUpdateLigne = async (id, field, value) => {
    try {
      const updatedValue = field === "quantite" || field === "prixUnitaire" ? Number(value) : value;
      const res = await api.put(`/lignes-commandes/${id}`, { [field]: updatedValue }, { headers: getAuthHeaders() });
      const updatedLignes = lignes.map(l => l._id === id ? res.data : l);
      setLignes(updatedLignes);
      calculateTotal(updatedLignes);
    } catch (error) {
      console.error("Erreur update ligne:", error);
      alert(error.response?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentLignes = lignes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(lignes.length / itemsPerPage);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestion des Lignes de Commande Fournisseur</h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Choisir une commande :</label>
        <select className="border p-2 w-full" value={selectedCommandeId} onChange={e => setSelectedCommandeId(e.target.value)}>
          <option value="">-- Sélectionner --</option>
          {commandes.map(cmd => (
            <option key={cmd._id} value={cmd._id}>
              {cmd._id} - {cmd.statut} - Montant: {cmd.montantTotal}€
            </option>
          ))}
        </select>
      </div>

      {selectedCommandeId && (
        <>
          <table className="w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Livre</th>
                <th className="border p-2">Quantité</th>
                <th className="border p-2">Prix Unitaire (€)</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentLignes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4">Pas de lignes pour cette commande.</td>
                </tr>
              ) : (
                currentLignes.map(ligne => (
                  <tr key={ligne._id}>
                    <td className="border p-2">{ligne.idLivre?.titre || "N/A"}</td>
                    <td className="border p-2">
                      <input type="number" min="1" value={ligne.quantite} onChange={e => handleUpdateLigne(ligne._id, "quantite", e.target.value)} className="w-20 p-1 border rounded" />
                    </td>
                    <td className="border p-2">
                      <input type="number" min="0" step="0.01" value={ligne.prixUnitaire} onChange={e => handleUpdateLigne(ligne._id, "prixUnitaire", e.target.value)} className="w-24 p-1 border rounded" />
                    </td>
                    <td className="border p-2 text-center">
                      <button onClick={() => handleDeleteLigne(ligne._id)} className="text-red-600 hover:underline">Supprimer</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mb-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : ""}`}>{i + 1}</button>
              ))}
            </div>
          )}

          <div className="mb-4 border p-4 rounded bg-gray-50">
            <h2 className="font-semibold mb-2">Ajouter une nouvelle ligne</h2>
            <div className="flex flex-wrap gap-2">
              <input type="text" name="idLivre" placeholder="ID Livre" value={newLigne.idLivre} onChange={handleChangeNewLigne} className="border p-2 flex-grow min-w-[120px]" />
              <input type="number" name="quantite" min="1" value={newLigne.quantite} onChange={handleChangeNewLigne} className="border p-2 w-24" />
              <input type="number" name="prixUnitaire" min="0" step="0.01" value={newLigne.prixUnitaire} onChange={handleChangeNewLigne} className="border p-2 w-28" placeholder="Prix unitaire" />
              <button onClick={handleAddLigne} className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">Ajouter</button>
            </div>
          </div>

          <div className="text-right font-bold text-lg">Total: {total.toFixed(2)} €</div>
        </>
      )}
    </div>
  );
}
