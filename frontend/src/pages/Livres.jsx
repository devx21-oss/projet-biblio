import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiPlusCircle, FiXCircle } from "react-icons/fi";
import { api } from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Livres() {
  const [livres, setLivres] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    _id: null,
    titre: "",
    auteur: "",
    isbn: "",
    categorie: "",
    description: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [livresRes, categoriesRes] = await Promise.all([
          api.get("/livres"),
          api.get("/categories"),
        ]);
        setLivres(livresRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        toast.error("Erreur lors du chargement des données");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      _id: null,
      titre: "",
      auteur: "",
      isbn: "",
      categorie: "",
      description: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        const res = await api.put(`/livres/${formData._id}`, formData);
        setLivres((prev) =>
          prev.map((livre) => (livre._id === res.data._id ? res.data : livre))
        );
        toast.success("Livre modifié avec succès !");
      } else {
        const res = await api.post("/livres", formData);
        setLivres((prev) => [...prev, res.data]);
        toast.success("Livre ajouté avec succès !");
      }
      resetForm();
    } catch (error) {
      console.error("Erreur sauvegarde livre:", error);
      toast.error("Erreur lors de la sauvegarde du livre");
    }
  };

  const handleEdit = (livre) => {
    setFormData({
      _id: livre._id,
      titre: livre.titre || "",
      auteur: livre.auteur || "",
      isbn: livre.isbn || "",
      categorie: livre.categorie?._id || "",
      description: livre.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce livre ?")) return;
    try {
      await api.delete(`/livres/${id}`);
      setLivres((prev) => prev.filter((livre) => livre._id !== id));
      toast.success("Livre supprimé avec succès !");
      if (formData._id === id) resetForm();
    } catch (error) {
      console.error("Erreur suppression livre:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500 text-lg font-medium">Chargement...</div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">Gestion des Livres</h1>
        {!formData._id && (
          <button
            onClick={resetForm}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 transition text-white font-semibold px-5 py-3 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <FiPlusCircle size={20} />
            Ajouter un livre
          </button>
        )}
      </div>

      {(formData._id || !formData._id) && (
        <form
          onSubmit={handleSubmit}
          className="mb-10 bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">
              {formData._id ? "Modifier le livre" : "Ajouter un nouveau livre"}
            </h2>
            {formData._id && (
              <button
                type="button"
                onClick={resetForm}
                className="text-red-500 hover:text-red-700 transition flex items-center gap-1 font-semibold"
                title="Annuler modification"
              >
                <FiXCircle size={24} />
                Annuler
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium text-gray-700" htmlFor="titre">
                Titre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="titre"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Titre du livre"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700" htmlFor="auteur">
                Auteur <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="auteur"
                name="auteur"
                value={formData.auteur}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom de l'auteur"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700" htmlFor="isbn">
                ISBN
              </label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Numéro ISBN"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700" htmlFor="categorie">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <select
                id="categorie"
                name="categorie"
                value={formData.categorie}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Sélectionner une catégorie --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-medium text-gray-700" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description du livre"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-4 justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {formData._id ? "Mettre à jour" : "Ajouter"}
            </button>
            {formData._id && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-6 py-3 rounded-md shadow-md transition focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Auteur
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                ISBN
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {livres.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 font-medium"
                >
                  Aucun livre trouvé.
                </td>
              </tr>
            ) : (
              livres.map((livre, idx) => (
                <tr
                  key={livre._id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {livre.titre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {livre.auteur}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {livre.isbn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {livre.categorie?.nom || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium flex justify-center gap-4">
                    <button
                      onClick={() => handleEdit(livre)}
                      title="Modifier"
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <FiEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(livre._id)}
                      title="Supprimer"
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
