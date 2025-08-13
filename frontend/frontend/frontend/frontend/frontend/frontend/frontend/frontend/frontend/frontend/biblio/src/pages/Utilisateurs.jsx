import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Utilisateurs() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({ nom: "", prenom: "", email: "", role: "etudiant", password: "" });
  const [editingUserId, setEditingUserId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("Utilisateur supprimé avec succès");
    } catch (err) {
      toast.error("Erreur lors de la suppression : " + (err.response?.data?.message || err.message));
    }
  }

  function handleEdit(user) {
    setFormData({ nom: user.nom, prenom: user.prenom, email: user.email, role: user.role, password: "" });
    setEditingUserId(user._id);
    setErrors({});
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function validate() {
    const errs = {};
    if (!formData.nom.trim()) errs.nom = "Le nom est obligatoire";
    if (!formData.prenom.trim()) errs.prenom = "Le prénom est obligatoire";
    if (!formData.email.trim()) errs.email = "L'email est obligatoire";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Email invalide";
    if (!editingUserId && !formData.password) errs.password = "Le mot de passe est obligatoire";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      // بناء البيانات مع تحويل password إلى motDePasse
      const dataToSend = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        role: formData.role,
      };

      if (formData.password) {
        dataToSend.motDePasse = formData.password;
      }

      if (editingUserId) {
        await api.put(`/users/${editingUserId}`, dataToSend);
        toast.success("Utilisateur modifié avec succès");
      } else {
        if (!formData.password) {
          toast.error("Le mot de passe est obligatoire pour un nouvel utilisateur.");
          return;
        }
        await api.post("/users", dataToSend);
        toast.success("Utilisateur ajouté avec succès");
      }

      setFormData({ nom: "", prenom: "", email: "", role: "etudiant", password: "" });
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement : " + (err.response?.data?.message || err.message));
    }
  }

  if (loading) return <div className="text-center py-6 text-gray-600">Chargement...</div>;
  if (error) return <div className="text-center py-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-8 bg-white rounded-md shadow-md mt-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <h2 className="text-2xl font-semibold mb-8 text-gray-800 flex items-center gap-3">
        Liste des utilisateurs
        <FaPlus
          className="text-green-600 cursor-pointer hover:text-green-800 hover:shadow-md transition-shadow duration-200"
          size={22}
          title="Ajouter un utilisateur"
          onClick={() => {
            setEditingUserId(null);
            setFormData({ nom: "", prenom: "", email: "", role: "etudiant", password: "" });
            setErrors({});
          }}
        />
      </h2>

      <div className="overflow-x-auto mb-8">
        <table className="min-w-full border border-gray-200 rounded-md text-sm" role="table" aria-label="Liste des utilisateurs">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 border-b border-gray-300 text-left text-gray-700">Nom</th>
              <th className="px-3 py-2 border-b border-gray-300 text-left text-gray-700">Prénom</th>
              <th className="px-3 py-2 border-b border-gray-300 text-left text-gray-700">Email</th>
              <th className="px-3 py-2 border-b border-gray-300 text-left text-gray-700">Rôle</th>
              <th className="px-3 py-2 border-b border-gray-300 text-center text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            ) : (
              users.map(({ _id, nom, prenom, email, role }) => (
                <tr key={_id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border-b border-gray-200">{nom}</td>
                  <td className="px-3 py-2 border-b border-gray-200">{prenom}</td>
                  <td className="px-3 py-2 border-b border-gray-200 truncate max-w-xs">{email}</td>
                  <td className="px-3 py-2 border-b border-gray-200 capitalize">{role}</td>
                  <td className="px-3 py-2 border-b border-gray-200 text-center space-x-3">
                    <button
                      onClick={() => handleEdit({ _id, nom, prenom, email, role })}
                      className="inline-flex items-center p-1 text-blue-600 hover:text-blue-800 hover:shadow-md rounded transition-shadow duration-200"
                      title="Modifier"
                      aria-label={`Modifier l'utilisateur ${nom} ${prenom}`}
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(_id)}
                      className="inline-flex items-center p-1 text-red-600 hover:text-red-800 hover:shadow-md rounded transition-shadow duration-200"
                      title="Supprimer"
                      aria-label={`Supprimer l'utilisateur ${nom} ${prenom}`}
                    >
                      <FaTrash size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-300 pt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-3">
          {editingUserId ? (
            <>
              <FaEdit size={20} /> Modifier Utilisateur
            </>
          ) : (
            <>
              <FaPlus size={20} /> Ajouter Utilisateur
            </>
          )}
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg" noValidate>
          <div>
            <input
              name="nom"
              placeholder="Nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className={`p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm w-full ${
                errors.nom ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.nom && <p className="text-red-600 text-xs mt-1">{errors.nom}</p>}
          </div>

          <div>
            <input
              name="prenom"
              placeholder="Prénom"
              value={formData.prenom}
              onChange={handleChange}
              required
              className={`p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm w-full ${
                errors.prenom ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.prenom && <p className="text-red-600 text-xs mt-1">{errors.prenom}</p>}
          </div>

          <div className="sm:col-span-2">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm w-full ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm w-full"
            >
              <option value="etudiant">Étudiant</option>
              <option value="admin">Admin</option>
              <option value="employe">Employé</option>
              <option value="supplier">Fournisseur</option>
            </select>
          </div>

          <div>
            <input
              name="password"
              type="password"
              placeholder={editingUserId ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
              value={formData.password}
              onChange={handleChange}
              required={!editingUserId}
              className={`p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm w-full ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              autoComplete="new-password"
            />
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          </div>

          <div className="flex items-center space-x-4 sm:col-span-2">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-semibold transition"
            >
              {editingUserId ? <FaEdit size={20} /> : <FaPlus size={20} />}{" "}
              {editingUserId ? "Modifier" : "Ajouter"}
            </button>
            {editingUserId && (
              <button
                type="button"
                onClick={() => {
                  setEditingUserId(null);
                  setFormData({ nom: "", prenom: "", email: "", role: "etudiant", password: "" });
                  setErrors({});
                }}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded text-sm font-semibold transition"
              >
                <FaTimes size={20} /> Annuler
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
