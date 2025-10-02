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

  // pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");
  const headers = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  const fetchCategories = async (p = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/categories?page=${p}&limit=${itemsPerPage}`, headers);
      setCategories(res.data.categories);
      setTotalPages(Math.ceil(res.data.total / itemsPerPage));
    } catch (err) {
      toast.error("Erreur chargement catégories: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(page); }, [page]);

  const deleteCategorie = async (id) => {
    if (!window.confirm("Confirmer la suppression de cette catégorie ?")) return;
    try {
      setIsProcessing(true);
      await api.delete(`/categories/${id}`, headers);
      toast.success("Catégorie supprimée");
      fetchCategories(page);
    } catch {
      toast.error("Erreur suppression catégorie");
    } finally { setIsProcessing(false); }
  };

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
          toast.success("Catégorie mise à jour");
        } else {
          res = await api.post("/categories", values, headers);
          toast.success("Catégorie ajoutée");
        }
        setEditCategorie(null);
        fetchCategories(page);
      } catch (err) {
        toast.error(err.response?.data?.message || "Erreur catégorie");
      } finally { setIsProcessing(false); }
    },
  });

  if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="p-2 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-2 md:space-y-0">
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
        <table className="w-full min-w-[500px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left hidden sm:table-cell">Description</th>
              <th className="p-3 text-left">Code Classification</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-500">Pas de catégories trouvées.</td>
              </tr>
            ) : categories.map(c => (
              <tr key={c._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{c.nom}</td>
                <td className="p-3 hidden sm:table-cell">{c.description || "-"}</td>
                <td className="p-3">{c.codeClassification}</td>
                <td className="p-3 flex space-x-2">
                  <button onClick={() => setEditCategorie(c)} disabled={isProcessing} className="text-blue-500 hover:text-blue-700"><PencilIcon className="h-5 w-5" /></button>
                  <button onClick={() => deleteCategorie(c._id)} disabled={isProcessing} className="text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="px-3 py-1 border rounded hover:bg-gray-100">&lt;</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setPage(i+1)} className={`px-3 py-1 border rounded ${page===i+1 ? 'bg-blue-500 text-white' : ''}`}>{i+1}</button>
        ))}
        <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="px-3 py-1 border rounded hover:bg-gray-100">&gt;</button>
      </div>

      {/* Modal Form */}
      {editCategorie && (
        <Modal title={editCategorie._id ? "Modifier Catégorie" : "Ajouter Catégorie"} onClose={() => setEditCategorie(null)}>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input type="text" name="nom" value={formik.values.nom} onChange={formik.handleChange} className="w-full border p-2 rounded mt-1" />
              {formik.errors.nom && <div className="text-red-500 text-sm">{formik.errors.nom}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" value={formik.values.description} onChange={formik.handleChange} className="w-full border p-2 rounded mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Code Classification</label>
              <input type="text" name="codeClassification" value={formik.values.codeClassification} onChange={formik.handleChange} className="w-full border p-2 rounded mt-1" />
              {formik.errors.codeClassification && <div className="text-red-500 text-sm">{formik.errors.codeClassification}</div>}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button type="button" onClick={() => setEditCategorie(null)} className="px-4 py-2 rounded border hover:bg-gray-100" disabled={isProcessing}>Annuler</button>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50" disabled={isProcessing}>{isProcessing ? "Enregistrement..." : "Enregistrer"}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
