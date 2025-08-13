import React, { useEffect, useState, useMemo } from "react";
import { api } from "../api/axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Modal from "../components/Modal";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCategorie, setEditCategorie] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const token = localStorage.getItem("token");
  const headers = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories", headers);
      setCategories(res.data);
    } catch (err) {
      toast.error("Erreur chargement catégories: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const deleteCategorie = async (id) => {
    if (!window.confirm("Confirmer la suppression de cette catégorie ?")) return;
    try {
      setIsProcessing(true);
      await api.delete(`/categories/${id}`, headers);
      setCategories(categories.filter(c => c._id !== id));
      toast.success("Catégorie supprimée");
    } catch {
      toast.error("Erreur suppression catégorie");
    } finally {
      setIsProcessing(false);
    }
  };

  // Validation schema
  const categorieSchema = Yup.object({
    nom: Yup.string().required("Nom requis"),
    description: Yup.string(),
    codeClassification: Yup.string().required("Code requis"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: editCategorie || { nom: "", description: "", codeClassification: "" },
    validationSchema: categorieSchema,
    onSubmit: async (values) => {
      try {
        setIsProcessing(true);
        let res;
        if (editCategorie?._id) {
          res = await api.put(`/categories/${editCategorie._id}`, values, headers);
          setCategories(categories.map(c => (c._id === editCategorie._id ? res.data.categorie : c)));
          toast.success("Catégorie mise à jour");
        } else {
          res = await api.post("/categories", values, headers);
          setCategories([...categories, res.data.categorie]);
          toast.success("Catégorie ajoutée");
        }
        setEditCategorie(null);
      } catch (err) {
        toast.error(err.response?.data?.message || "Erreur catégorie");
      } finally {
        setIsProcessing(false);
      }
    },
  });

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
        <h2 className="text-2xl font-semibold">📚 Gestion des Catégories</h2>
        <button
          onClick={() => setEditCategorie({ nom: "", description: "", codeClassification: "" })}
          disabled={isProcessing}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Ajouter catégorie
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Code Classification</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{c.nom}</td>
                <td className="p-3">{c.description || "-"}</td>
                <td className="p-3">{c.codeClassification}</td>
                <td className="p-3 flex space-x-2">
                  <button
                    onClick={() => setEditCategorie(c)}
                    disabled={isProcessing}
                    className="text-blue-500 hover:text-blue-700"
                    title="Modifier"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteCategorie(c._id)}
                    disabled={isProcessing}
                    className="text-red-500 hover:text-red-700"
                    title="Supprimer"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-500">
                  Pas de catégories trouvées.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editCategorie && (
        <Modal
          title={editCategorie._id ? "Modifier Catégorie" : "Ajouter Catégorie"}
          onClose={() => setEditCategorie(null)}
        >
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                name="nom"
                value={formik.values.nom}
                onChange={formik.handleChange}
                className="w-full border p-2 rounded mt-1"
              />
              {formik.errors.nom && <div className="text-red-500 text-sm">{formik.errors.nom}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                className="w-full border p-2 rounded mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Code Classification</label>
              <input
                type="text"
                name="codeClassification"
                value={formik.values.codeClassification}
                onChange={formik.handleChange}
                className="w-full border p-2 rounded mt-1"
              />
              {formik.errors.codeClassification && (
                <div className="text-red-500 text-sm">{formik.errors.codeClassification}</div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={() => setEditCategorie(null)}
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
