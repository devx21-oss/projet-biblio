import React, { useEffect, useState } from "react";
import { api } from "../api/axios"; // استيراد api بدل axios

export default function LigneCommandeFournisseur() {
  const [commandes, setCommandes] = useState([]);
  const [selectedCommandeId, setSelectedCommandeId] = useState("");
  const [lignes, setLignes] = useState([]);
  const [newLigne, setNewLigne] = useState({
    idLivre: "",
    quantite: 1,
    prixUnitaire: 0,
  });
  const [total, setTotal] = useState(0);

  // جلب كل الطلبات الموردين عشان الاختيار
  useEffect(() => {
    async function fetchCommandes() {
      try {
        const res = await api.get("/commandes"); // استبدل axios بـ api
        setCommandes(res.data);
      } catch (error) {
        console.error("Erreur fetching commandes:", error);
      }
    }
    fetchCommandes();
  }, []);

  // جلب أسطر الطلبات حسب الطلب المختار
  useEffect(() => {
    if (!selectedCommandeId) {
      setLignes([]);
      setTotal(0);
      return;
    }
    async function fetchLignes() {
      try {
        const res = await api.get(`/lignes-commandes/commande/${selectedCommandeId}`); // تعديل رابط ال endpoint
        setLignes(res.data);
        calculateTotal(res.data);
      } catch (error) {
        console.error("Erreur fetching lignes:", error);
      }
    }
    fetchLignes();
  }, [selectedCommandeId]);

  // حساب المجموع الكلي
  const calculateTotal = (lignesData) => {
    const sum = lignesData.reduce(
      (acc, ligne) => acc + ligne.quantite * ligne.prixUnitaire,
      0
    );
    setTotal(sum);
  };

  // تعديل بيانات الإدخال لسطر جديد
  const handleChangeNewLigne = (e) => {
    const { name, value } = e.target;
    setNewLigne((prev) => ({
      ...prev,
      [name]: name === "quantite" || name === "prixUnitaire" ? Number(value) : value,
    }));
  };

  // إضافة سطر طلب جديد
  const handleAddLigne = async () => {
    if (!selectedCommandeId) {
      alert("Veuillez sélectionner une commande.");
      return;
    }
    if (!newLigne.idLivre || newLigne.quantite <= 0 || newLigne.prixUnitaire <= 0) {
      alert("Veuillez remplir correctement tous les champs.");
      return;
    }
    try {
      const payload = {
        idCommandeFournisseur: selectedCommandeId,
        idLivre: newLigne.idLivre,
        quantite: newLigne.quantite,
        prixUnitaire: newLigne.prixUnitaire,
      };
      const res = await api.post("/lignes-commandes", payload);
      setLignes((prev) => [...prev, res.data]);
      calculateTotal([...lignes, res.data]);
      // Reset inputs
      setNewLigne({ idLivre: "", quantite: 1, prixUnitaire: 0 });
    } catch (error) {
      console.error("Erreur ajout ligne:", error);
    }
  };

  // حذف سطر طلب
  const handleDeleteLigne = async (id) => {
    if (!window.confirm("Confirmer la suppression?")) return;
    try {
      await api.delete(`/lignes-commandes/${id}`);
      const updatedLignes = lignes.filter((l) => l._id !== id);
      setLignes(updatedLignes);
      calculateTotal(updatedLignes);
    } catch (error) {
      console.error("Erreur suppression ligne:", error);
    }
  };

  // تعديل سطر طلب (كمية أو سعر فقط)
  const handleUpdateLigne = async (id, field, value) => {
    try {
      const updatedValue = field === "quantite" || field === "prixUnitaire" ? Number(value) : value;
      const res = await api.put(`/lignes-commandes/${id}`, { [field]: updatedValue });
      const updatedLignes = lignes.map((ligne) =>
        ligne._id === id ? res.data : ligne
      );
      setLignes(updatedLignes);
      calculateTotal(updatedLignes);
    } catch (error) {
      console.error("Erreur update ligne:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestion des Lignes de Commande Fournisseur</h1>

      <div className="mb-6">
        <label className="block mb-2 font-semibold">Choisir une commande :</label>
        <select
          className="border p-2 w-full"
          value={selectedCommandeId}
          onChange={(e) => setSelectedCommandeId(e.target.value)}
        >
          <option value="">-- Sélectionner --</option>
          {commandes.map((cmd) => (
            <option key={cmd._id} value={cmd._id}>
              {cmd._id} - {cmd.statut} - Montant: {cmd.montantTotal}€
            </option>
          ))}
        </select>
      </div>

      {selectedCommandeId && (
        <>
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Livre</th>
                <th className="border border-gray-300 p-2">Quantité</th>
                <th className="border border-gray-300 p-2">Prix Unitaire (€)</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lignes.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-4">
                    Pas de lignes pour cette commande.
                  </td>
                </tr>
              )}
              {lignes.map((ligne) => (
                <tr key={ligne._id}>
                  <td className="border border-gray-300 p-2">
                    {ligne.idLivre ? ligne.idLivre.titre : "N/A"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      min="1"
                      value={ligne.quantite}
                      onChange={(e) =>
                        handleUpdateLigne(ligne._id, "quantite", e.target.value)
                      }
                      className="w-20 p-1 border rounded"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={ligne.prixUnitaire}
                      onChange={(e) =>
                        handleUpdateLigne(ligne._id, "prixUnitaire", e.target.value)
                      }
                      className="w-24 p-1 border rounded"
                    />
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      onClick={() => handleDeleteLigne(ligne._id)}
                      className="text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mb-6 border p-4 rounded bg-gray-50">
            <h2 className="font-semibold mb-2">Ajouter une nouvelle ligne</h2>
            <div className="flex gap-4 flex-wrap">
              <input
                type="text"
                name="idLivre"
                placeholder="ID Livre"
                value={newLigne.idLivre}
                onChange={handleChangeNewLigne}
                className="border p-2 flex-grow"
              />
              <input
                type="number"
                name="quantite"
                min="1"
                value={newLigne.quantite}
                onChange={handleChangeNewLigne}
                className="border p-2 w-24"
              />
              <input
                type="number"
                name="prixUnitaire"
                min="0"
                step="0.01"
                value={newLigne.prixUnitaire}
                onChange={handleChangeNewLigne}
                className="border p-2 w-28"
                placeholder="Prix unitaire"
              />
              <button
                onClick={handleAddLigne}
                className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
              >
                Ajouter
              </button>
            </div>
          </div>

          <div className="text-right font-bold text-lg">
            Total: {total.toFixed(2)} €
          </div>
        </>
      )}
    </div>
  );
}
