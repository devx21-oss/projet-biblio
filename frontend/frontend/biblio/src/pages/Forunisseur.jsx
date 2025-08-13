// src/pages/Commande.jsx
import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Modal from "../components/Modal";

export default function Commande() {
  const [commandes, setCommandes] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCommande, setEditCommande] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [commandesRes, fournisseursRes, employesRes] = await Promise.all([
        api.get("/commandes"),
        api.get("/users?role=supplier"),
        api.get("/users?role=employe"),
      ]);
      setCommandes(commandesRes.data);
      setFournisseurs(fournisseursRes.data);
      setEmployes(employesRes.data);
    } catch (err) {
      toast.error("Erreur chargement données : " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteCommande = async (id) => {
    if (!window.confirm("Confirmer la suppression de cette commande ?")) return;
    try {
      setIsProcessing(true);
      await api.delete(`/commandes/${id}`);
      setCommandes(commandes.filter(c => c._id !== id));
      toast.success("Commande supprimée");
      if (editCommande?._id === id) setEditCommande(null);
    } catch {
      toast.error("Erreur suppression commande");
    } finally {
      setIsProcessing(false);
    }
  };

  const commandeSchema = Yup.object({
    fournisseurId: Yup.string().required("Fournisseur requis"),
    employeId: Yup.string().required("Employé requis"),
    montantTotal: Yup.number()
      .typeError("Montant doit être un nombre")
      .required("Montant requis")
      .min(0, "Doit être ≥ 0"),
    statut: Yup.string().required("Statut requis"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: editCommande || {
      fournisseurId: "",
      employeId: "",
      montantTotal: "",
      statut: "En attente",
    },
    validationSchema: commandeSchema,
    onSubmit: async (values) => {
      try {
        setIsProcessing(true);
        let res;
        if (editCommande?._id) {
          res = await api.put(`/commandes/${editCommande._id}`, values);
          setCommandes(commandes.map(c => (c._id === editCommande._id ? res.data.commande : c)));
          toast.success("Commande mise à jour");
        } else {
          res = await api.post("/commandes", values);
          setCommandes([...commandes, res.data.commande]);
          toast.success("Commande ajoutée");
        }
        setEditCommande(null);
      } catch (err) {
        toast.error(err.response?.data?.message || "Erreur commande");
      } finally {
        setIsProcessing(false);
      }
    },
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">🛒 Gestion des Commandes Fournisseurs</h2>
        <button
          onClick={() =>
            setEditCommande({ fournisseurId: "", employeId: "", montantTotal: "", statut: "En attente" })
          }
          disabled={isProcessing}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow"
        >
          + Ajouter commande
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left font-medium text-gray-700">Fournisseur</th>
              <th className="p-3 text-left font-medium text-gray-700">Employé</th>
              <th className="p-3 text-left font-medium text-gray-700">Montant Total</th>
              <th className="p-3 text-left font-medium text-gray-700">Statut</th>
              <th className="p-3 text-left font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {commandes.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  Pas de commandes trouvées.
                </td>
              </tr>
            ) : (
              commandes.map((c) => (
                <tr key={c._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    {c.fournisseurId ? `${c.fournisseurId.nom} ${c.fournisseurId.prenom}` : "-"}
                  </td>
                  <td className="p-3">
                    {c.employeId ? `${c.employeId.nom} ${c.employeId.prenom}` : "-"}
                  </td>
                  <td className="p-3">{c.montantTotal} TND</td>
                  <td className="p-3 font-semibold">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        c.statut === "Livrée"
                          ? "bg-green-100 text-green-700"
                          : c.statut === "Annulée"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {c.statut}
                    </span>
                  </td>
                  <td className="p-3 flex space-x-3">
                    <button
                      onClick={() => setEditCommande(c)}
                      disabled={isProcessing}
                      className="text-blue-600 hover:text-blue-800"
                      title="Modifier"
                    >
                      <PencilIcon className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => deleteCommande(c._id)}
                      disabled={isProcessing}
                      className="text-red-600 hover:text-red-800"
                      title="Supprimer"
                    >
                      <TrashIcon className="h-6 w-6" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editCommande && (
        <Modal title={editCommande._id ? "Modifier Commande" : "Ajouter Commande"} onClose={() => setEditCommande(null)}>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Fournisseur</label>
              <select
                name="fournisseurId"
                value={formik.values.fournisseurId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border p-2 rounded mt-1"
              >
                <option value="">-- Sélectionner un fournisseur --</option>
                {fournisseurs.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.nom} {f.prenom}
                  </option>
                ))}
              </select>
              {formik.touched.fournisseurId && formik.errors.fournisseurId && (
                <div className="text-red-600 text-sm mt-1">{formik.errors.fournisseurId}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Employé</label>
              <select
                name="employeId"
                value={formik.values.employeId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border p-2 rounded mt-1"
              >
                <option value="">-- Sélectionner un employé --</option>
                {employes.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.nom} {e.prenom}
                  </option>
                ))}
              </select>
              {formik.touched.employeId && formik.errors.employeId && (
                <div className="text-red-600 text-sm mt-1">{formik.errors.employeId}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Montant Total</label>
              <input
                type="number"
                name="montantTotal"
                value={formik.values.montantTotal}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min="0"
                step="0.01"
                className="w-full border p-2 rounded mt-1"
              />
              {formik.touched.montantTotal && formik.errors.montantTotal && (
                <div className="text-red-600 text-sm mt-1">{formik.errors.montantTotal}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Statut</label>
              <select
                name="statut"
                value={formik.values.statut}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border p-2 rounded mt-1"
              >
                <option value="En attente">En attente</option>
                <option value="Livrée">Livrée</option>
                <option value="Annulée">Annulée</option>
              </select>
              {formik.touched.statut && formik.errors.statut && (
                <div className="text-red-600 text-sm mt-1">{formik.errors.statut}</div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setEditCommande(null)}
                className="px-4 py-2 rounded border hover:bg-gray-100"
                disabled={isProcessing}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isProcessing || !formik.isValid || !formik.dirty}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {isProcessing ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
