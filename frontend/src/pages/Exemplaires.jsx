import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Modal from "../components/Modal";

export default function Exemplaires() {
  const [exemplaires, setExemplaires] = useState([]);
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editExemplaire, setEditExemplaire] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);

  // Fetch exemplaires with pagination
  const fetchExemplaires = async (page = 1, limit = 5) => {
    setLoading(true);
    try {
      const res = await api.get(`/exemplaires?page=${page}&limit=${limit}`);
      setExemplaires(res.data.items || []);
      setPage(res.data.page || 1);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error("Erreur chargement exemplaires : " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Fetch livres for dropdown
  const fetchLivres = async () => {
    try {
      const res = await api.get("/livres");
      setLivres(res.data.items || []);
    } catch (err) {
      toast.error("Erreur chargement livres");
    }
  };

  useEffect(() => {
    fetchExemplaires(page, limit);
    fetchLivres();
  }, [page, limit]);

  // Delete exemplaire
  const deleteExemplaire = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      setIsProcessing(true);
      await api.delete(`/exemplaires/${id}`);
      await fetchExemplaires(page, limit);
      toast.success("Exemplaire supprimé");
    } catch (err) {
      toast.error("Erreur suppression exemplaire");
    } finally {
      setIsProcessing(false);
    }
  };

  // Formik setup
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: editExemplaire || {
      livreId: "",
      IdExemplaire: "",
      etat: "Neuf",
      disponible: true,
    },
    validationSchema: Yup.object({
      livreId: Yup.string().required("Livre requis"),
      IdExemplaire: Yup.string().required("Code requis"),
      etat: Yup.string().required("État requis"),
    }),
    onSubmit: async (values) => {
      try {
        setIsProcessing(true);
        if (editExemplaire?._id) {
          await api.put(`/exemplaires/${editExemplaire._id}`, values);
          toast.success("Exemplaire mis à jour");
        } else {
          await api.post("/exemplaires", values);
          toast.success("Exemplaire ajouté");
        }
        setEditExemplaire(null);
        await fetchExemplaires(page, limit);
      } catch (err) {
        toast.error(err.response?.data?.message || "Erreur enregistrement");
      } finally {
        setIsProcessing(false);
      }
    },
  });

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="p-4 flex flex-col space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
        <h2 className="text-2xl font-semibold">📚 Gestion des Exemplaires</h2>
        <button
          onClick={() =>
            setEditExemplaire({ livreId: "", IdExemplaire: "", etat: "Neuf", disponible: true })
          }
          disabled={isProcessing}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Ajouter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Livre</th>
              <th className="p-3 text-left">Code</th>
              <th className="p-3 text-left">État</th>
              <th className="p-3 text-left">Disponible</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exemplaires.map((e) => (
              <tr key={e._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{e.livreId?.titre || "—"}</td>
                <td className="p-3">{e.IdExemplaire}</td>
                <td className="p-3">{e.etat}</td>
                <td className="p-3">{e.disponible ? "✅ Oui" : "❌ Non"}</td>
                <td className="p-3 flex space-x-2">
                  <button
                    onClick={() => setEditExemplaire(e)}
                    disabled={isProcessing}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteExemplaire(e._id)}
                    disabled={isProcessing}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {exemplaires.length === 0 && (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  Aucun exemplaire trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-1 mt-2 flex-wrap">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm sm:text-base"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => goToPage(i + 1)}
            className={`px-2 py-1 rounded text-sm sm:text-base ${
              page === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm sm:text-base"
        >
          Next
        </button>
      </div>

      {/* Modal Form */}
      {editExemplaire && (
        <Modal
          title={editExemplaire._id ? "Modifier Exemplaire" : "Ajouter Exemplaire"}
          onClose={() => setEditExemplaire(null)}
        >
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Livre */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Livre</label>
              <select
                name="livreId"
                value={formik.values.livreId}
                onChange={formik.handleChange}
                className="w-full border p-2 rounded mt-1"
              >
                <option value="">-- Choisir --</option>
                {livres.map((livre) => (
                  <option key={livre._id} value={livre._id}>
                    {livre.titre} - {livre.auteur}
                  </option>
                ))}
              </select>
              {formik.errors.livreId && <div className="text-red-500 text-sm">{formik.errors.livreId}</div>}
            </div>

            {/* Code exemplaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Code Exemplaire</label>
              <input
                type="text"
                name="IdExemplaire"
                value={formik.values.IdExemplaire}
                onChange={formik.handleChange}
                className="w-full border p-2 rounded mt-1"
              />
              {formik.errors.IdExemplaire && <div className="text-red-500 text-sm">{formik.errors.IdExemplaire}</div>}
            </div>

            {/* Etat */}
            <div>
              <label className="block text-sm font-medium text-gray-700">État</label>
              <select
                name="etat"
                value={formik.values.etat}
                onChange={formik.handleChange}
                className="w-full border p-2 rounded mt-1"
              >
                {["Neuf", "Bon", "Usé", "Détérioré"].map((etat) => (
                  <option key={etat} value={etat}>{etat}</option>
                ))}
              </select>
              {formik.errors.etat && <div className="text-red-500 text-sm">{formik.errors.etat}</div>}
            </div>

            {/* Disponible */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Disponible</label>
              <select
                name="disponible"
                value={formik.values.disponible}
                onChange={(e) =>
                  formik.setFieldValue("disponible", e.target.value === "true")
                }
                className="w-full border p-2 rounded mt-1"
              >
                <option value="true">Oui</option>
                <option value="false">Non</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={() => setEditExemplaire(null)}
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
