import React, { useEffect, useState, useMemo, useRef } from "react";
import { api } from "../api/axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Modal from "../components/Modal";

export default function Amendes() {
  const [amendes, setAmendes] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [prets, setPrets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editAmende, setEditAmende] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const montantInputRef = useRef(null);

  const token = localStorage.getItem("token");
  const headers = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  // Fetch données amendes, utilisateurs (filtrer étudiants), prêts
  const fetchData = async () => {
    try {
      setLoading(true);
      const [amendesRes, usersRes, pretsRes] = await Promise.all([
        api.get("/amendes", headers),
        api.get("/users", headers),
        api.get("/prets/user", headers)

      ]);

      setAmendes(amendesRes.data);
      const etudiantsData = usersRes.data.filter(user => user.role === "etudiant");
      setEtudiants(etudiantsData);
      setPrets(pretsRes.data);
    } catch (err) {
      toast.error("Erreur chargement données: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Supprimer amende avec confirmation
  const deleteAmende = async (id) => {
    if (!window.confirm("Confirmer la suppression de cette amende ?")) return;
    try {
      setIsProcessing(true);
      await api.delete(`/amendes/${id}`, headers);
      setAmendes(amendes.filter(a => a._id !== id));
      toast.success("Amende supprimée");
    } catch {
      toast.error("Erreur suppression amende");
    } finally {
      setIsProcessing(false);
    }
  };

  const amendeSchema = Yup.object({
    montant: Yup.number().required("Montant requis").positive("Doit être positif"),
    motif: Yup.string().required("Motif requis"),
    etudiantId: Yup.string().required("Étudiant requis"),
    pretId: Yup.string().required("Prêt requis"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: editAmende || {
      montant: "",
      motif: "",
      etudiantId: "",
      pretId: "",
    },
    validationSchema: amendeSchema,
    onSubmit: async (values) => {
      try {
        setIsProcessing(true);
        let res;
        if (editAmende?._id) {
          res = await api.put(`/amendes/${editAmende._id}`, values, headers);
          setAmendes(amendes.map(a => (a._id === editAmende._id ? res.data.amende : a)));
          toast.success("Amende mise à jour");
        } else {
          res = await api.post("/amendes", values, headers);
          setAmendes([...amendes, res.data.amende]);
          toast.success("Amende ajoutée");
        }
        setEditAmende(null);
      } catch (err) {
        toast.error(err.response?.data?.message || "Erreur amende");
      } finally {
        setIsProcessing(false);
      }
    },
  });

  useEffect(() => {
    if (editAmende && montantInputRef.current) {
      montantInputRef.current.focus();
    }
  }, [editAmende]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">💸 Gestion des Amendes</h2>
        <button
          onClick={() => setEditAmende({ montant: "", motif: "", etudiantId: "", pretId: "" })}
          disabled={isProcessing}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-400 text-white px-4 py-2 rounded transition"
        >
          <span className="text-xl font-bold">+</span> Ajouter amende
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow max-h-[500px] overflow-y-auto">
        {amendes.length === 0 ? (
          <div className="text-center p-6 text-gray-500">Pas d'amendes trouvées.</div>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-3 text-left">Montant (€)</th>
                <th className="p-3 text-left">Motif</th>
                <th className="p-3 text-left">Étudiant</th>
                <th className="p-3 text-left">Prêt</th>
                <th className="p-3 text-left">Date création</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {amendes.map((a) => (
                <tr key={a._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{a.montant.toFixed(2)}</td>
                  <td className="p-3">{a.motif}</td>
                  <td className="p-3">{a.etudiantId?.nom || "N/A"}</td>
                  <td className="p-3">{a.pretId?._id || "N/A"}</td>
                  <td className="p-3">
                    {new Date(a.dateCreationAmende).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="p-3 capitalize">{a.status}</td>
                  <td className="p-3 flex space-x-2">
                    <button
                      onClick={() => setEditAmende(a)}
                      disabled={isProcessing}
                      className="text-blue-500 hover:text-blue-700"
                      title="Modifier"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteAmende(a._id)}
                      disabled={isProcessing}
                      className="text-red-500 hover:text-red-700"
                      title="Supprimer"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editAmende && (
        <Modal
          title={editAmende._id ? "Modifier Amende" : "Ajouter Amende"}
          onClose={() => setEditAmende(null)}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold mb-4">
              {editAmende._id ? "Modifier Amende" : "Ajouter Amende"}
            </h3>
            <button
              onClick={() => setEditAmende(null)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Fermer"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Montant (€)</label>
              <input
                type="number"
                name="montant"
                value={formik.values.montant}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border p-2 rounded mt-1"
                step="0.01"
                ref={montantInputRef}
              />
              {formik.touched.montant && formik.errors.montant && (
                <div className="text-red-500 text-sm">{formik.errors.montant}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Motif</label>
              <input
                type="text"
                name="motif"
                value={formik.values.motif}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border p-2 rounded mt-1"
              />
              {formik.touched.motif && formik.errors.motif && (
                <div className="text-red-500 text-sm">{formik.errors.motif}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Étudiant</label>
              <select
                name="etudiantId"
                value={formik.values.etudiantId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border p-2 rounded mt-1"
              >
                <option value="">-- Sélectionner un étudiant --</option>
                {etudiants.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.nom} {e.prenom}
                  </option>
                ))}
              </select>
              {formik.touched.etudiantId && formik.errors.etudiantId && (
                <div className="text-red-500 text-sm">{formik.errors.etudiantId}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Prêt</label>
              <select
                name="pretId"
                value={formik.values.pretId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border p-2 rounded mt-1"
              >
                <option value="">-- Sélectionner un prêt --</option>
                {prets.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p._id} - {p.livreTitre || "Livre"}
                  </option>
                ))}
              </select>
              {formik.touched.pretId && formik.errors.pretId && (
                <div className="text-red-500 text-sm">{formik.errors.pretId}</div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={() => setEditAmende(null)}
                className="px-4 py-2 rounded border hover:bg-gray-100"
                disabled={isProcessing}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                disabled={isProcessing}
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
