import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Modal from "../components/Modal";

export default function Exemplaires() {
  const [exemplaires, setExemplaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editExemplaire, setEditExemplaire] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // دالة جلب البيانات
  const fetchExemplaires = async () => {
    try {
      setLoading(true);
      const res = await api.get("/exemplaires");
      setExemplaires(res.data);
    } catch (err) {
      toast.error(
        "Erreur chargement exemplaires : " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // تنادى مرة واحدة وقت تحميل الصفحة
  useEffect(() => {
    fetchExemplaires();
  }, []);

  const deleteExemplaire = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      setIsProcessing(true);
      await api.delete(`/exemplaires/${id}`);
      // بعد الحذف نعيد تحميل القائمة
      await fetchExemplaires();
      toast.success("Exemplaire supprimé");
    } catch {
      toast.error("Erreur suppression exemplaire");
    } finally {
      setIsProcessing(false);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
      editExemplaire || { livreId: "", codeExemplaire: "", etat: "" },
    validationSchema: Yup.object({
      livreId: Yup.string().required("ID livre requis"),
      codeExemplaire: Yup.string().required("Code requis"),
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
        // بعد الإضافة أو التعديل نعيد تحميل القائمة
        await fetchExemplaires();
      } catch (err) {
        toast.error(err.response?.data?.message || "Erreur enregistrement");
      } finally {
        setIsProcessing(false);
      }
    },
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">📚 Gestion des Exemplaires</h2>
        <button
          onClick={() =>
            setEditExemplaire({ livreId: "", codeExemplaire: "", etat: "" })
          }
          disabled={isProcessing}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Ajouter exemplaire
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Livre</th>
              <th className="p-3 text-left">Code</th>
              <th className="p-3 text-left">État</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exemplaires.map((e) => (
              <tr key={e._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{e.livreId?.nom || "—"}</td>
                <td className="p-3">{e.codeExemplaire}</td>
                <td className="p-3">{e.etat}</td>
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
                <td colSpan="4" className="p-3 text-center text-gray-500">
                  Aucun exemplaire trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editExemplaire && (
        <Modal
          title={editExemplaire._id ? "Modifier Exemplaire" : "Ajouter Exemplaire"}
          onClose={() => setEditExemplaire(null)}
        >
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {["livreId", "codeExemplaire", "etat"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {field}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formik.values[field]}
                  onChange={formik.handleChange}
                  className="w-full border p-2 rounded mt-1"
                />
                {formik.errors[field] && (
                  <div className="text-red-500 text-sm">{formik.errors[field]}</div>
                )}
              </div>
            ))}
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
