// src/pages/Amendes.jsx
import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

export default function Amendes() {
  const [amendes, setAmendes] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [prets, setPrets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editAmende, setEditAmende] = useState(null);

  const fetchAmendes = async () => {
    try {
      const res = await api.get("/amendes");
      setAmendes(res.data.amendes || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEtudiants = async () => {
    try {
      const res = await api.get("/utilisateurs?role=etudiant");
      setEtudiants(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPrets = async () => {
    try {
      const res = await api.get("/prets");
      setPrets(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAmendes();
    fetchEtudiants();
    fetchPrets();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      montant: editAmende?.montant ?? "",
      motif: editAmende?.motif ?? "",
      etudiantId: editAmende?.etudiantId ?? "",
      pretId: editAmende?.pretId ?? "",
    },
    validationSchema: Yup.object({
      montant: Yup.number().required("Montant requis"),
      motif: Yup.string().required("Motif requis"),
      etudiantId: Yup.string().required("Étudiant requis"),
      pretId: Yup.string().required("Prêt requis"),
    }),
    onSubmit: async (values) => {
      try {
        if (editAmende?._id) {
          await api.put(`/amendes/${editAmende._id}`, values);
          toast.success("Amende mise à jour !");
        } else {
          await api.post("/amendes", values);
          toast.success("Amende ajoutée !");
        }
        setShowModal(false);
        fetchAmendes();
      } catch (error) {
        toast.error("Erreur lors de l'enregistrement.");
        console.error(error);
      }
    },
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment annuler cette amende ?")) return;
    try {
      await api.delete(`/amendes/${id}`);
      toast.success("Amende annulée !");
      fetchAmendes();
    } catch (error) {
      toast.error("Erreur lors de l'annulation.");
      console.error(error);
    }
  };

  const handlePay = async (id) => {
    try {
      await api.put(`/amendes/${id}/pay`);
      toast.success("Amende payée !");
      fetchAmendes();
    } catch (error) {
      toast.error("Erreur lors du paiement.");
      console.error(error);
    }
  };

  return (
    <div className="p-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100">📑 Gestion des Amendes</h1>
        <button
          onClick={() => {
            setEditAmende({
              _id: null,
              montant: "",
              motif: "",
              etudiantId: "",
              pretId: "",
            });
            setShowModal(true);
          }}
          className="flex items-center bg-gradient-to-r from-green-600 to-green-700 px-5 py-2 rounded-lg hover:from-green-500 hover:to-green-600 transition shadow-lg"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Ajouter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-gray-900 rounded-xl shadow-lg">
        <table className="w-full border border-gray-800 rounded-xl">
          <thead>
            <tr className="bg-gray-800 text-gray-300 text-left">
              <th className="p-3">Montant</th>
              <th className="p-3">Motif</th>
              <th className="p-3">Étudiant</th>
              <th className="p-3">Prêt</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {amendes.map((a) => (
              <tr
                key={a._id}
                className="border-t border-gray-800 hover:bg-gray-800/50 transition"
              >
                <td className="p-3 font-semibold text-green-400">{a.montant} DT</td>
                <td className="p-3">{a.motif}</td>
                <td className="p-3">
                  {a.etudiantId?.nom} {a.etudiantId?.prenom}
                </td>
                <td className="p-3 text-sm text-gray-300">
                  {new Date(a.pretId?.dateEmprunt).toLocaleDateString()}
                </td>
                <td
                  className={`p-3 font-bold ${
                    a.status === "payée"
                      ? "text-green-500"
                      : a.status === "annulée"
                      ? "text-red-500"
                      : "text-yellow-400"
                  }`}
                >
                  {a.status}
                </td>
                <td className="p-3 flex justify-center space-x-3">
                  <button
                    onClick={() => {
                      setEditAmende({
                        _id: a._id,
                        montant: a.montant,
                        motif: a.motif,
                        etudiantId: a.etudiantId?._id || "",
                        pretId: a.pretId?._id || "",
                      });
                      setShowModal(true);
                    }}
                    className="p-2 rounded bg-blue-600 hover:bg-blue-700 transition shadow"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="p-2 rounded bg-red-600 hover:bg-red-700 transition shadow"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                  {a.status !== "payée" && a.status !== "annulée" && (
                    <button
                      onClick={() => handlePay(a._id)}
                      className="p-2 rounded bg-green-600 hover:bg-green-700 transition shadow"
                    >
                      <BanknotesIcon className="h-5 w-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {amendes.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-400">
                  Aucune amende trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-900 p-8 rounded-2xl w-1/2 shadow-xl">
            <h2 className="text-2xl mb-6 font-semibold text-gray-100">
              {editAmende?._id ? "✏️ Modifier Amende" : "➕ Ajouter Amende"}
            </h2>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* Montant */}
              <div>
                <label className="block mb-1">Montant</label>
                <input
                  type="number"
                  name="montant"
                  onChange={formik.handleChange}
                  value={formik.values.montant}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                />
                {formik.errors.montant && (
                  <div className="text-red-500 text-sm">{formik.errors.montant}</div>
                )}
              </div>

              {/* Motif */}
              <div>
                <label className="block mb-1">Motif</label>
                <input
                  type="text"
                  name="motif"
                  onChange={formik.handleChange}
                  value={formik.values.motif}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                />
                {formik.errors.motif && (
                  <div className="text-red-500 text-sm">{formik.errors.motif}</div>
                )}
              </div>

              {/* Étudiant */}
              <div>
                <label className="block mb-1">Étudiant</label>
                <select
                  name="etudiantId"
                  onChange={formik.handleChange}
                  value={formik.values.etudiantId}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="">-- Choisir un étudiant --</option>
                  {etudiants.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.nom} {e.prenom}
                    </option>
                  ))}
                </select>
                {formik.errors.etudiantId && (
                  <div className="text-red-500 text-sm">{formik.errors.etudiantId}</div>
                )}
              </div>

              {/* Prêt */}
              <div>
                <label className="block mb-1">Prêt</label>
                <select
                  name="pretId"
                  onChange={formik.handleChange}
                  value={formik.values.pretId}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="">-- Choisir un prêt --</option>
                  {prets.map((p) => (
                    <option key={p._id} value={p._id}>
                      {new Date(p.dateEmprunt).toLocaleDateString()} →{" "}
                      {new Date(p.dateRetourPrevue).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                {formik.errors.pretId && (
                  <div className="text-red-500 text-sm">{formik.errors.pretId}</div>
                )}
              </div>

              {/* Boutons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-700 px-5 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-green-600 px-5 py-2 rounded-lg hover:bg-green-700 transition shadow"
                >
                  {editAmende?._id ? "Mettre à jour" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
