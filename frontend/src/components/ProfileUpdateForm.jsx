import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5000";

export default function ProfileUpdateForm({ editingUser, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    role: "etudiant",
    photo: null,
  });

  const [preview, setPreview] = useState("/default-avatar.png");

  useEffect(() => {
    if (editingUser) {
      setFormData({
        nom: editingUser.nom || "",
        prenom: editingUser.prenom || "",
        email: editingUser.email || "",
        role: editingUser.role || "etudiant",
        photo: null,
      });

      if (editingUser.photo) {
        // ✅ user.photo is just the filename now
        setPreview(`${API_URL}/uploads/${editingUser.photo}`);
      } else {
        setPreview("/default-avatar.png");
      }
    } else {
      setPreview("/default-avatar.png");
    }
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files.length > 0) {
      setFormData({ ...formData, photo: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">
          {editingUser ? "Modifier Utilisateur" : "Ajouter Utilisateur"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={formData.nom}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="text"
            name="prenom"
            placeholder="Prénom"
            value={formData.prenom}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="etudiant">Étudiant</option>
            <option value="admin">Admin</option>
            <option value="employe">Employé</option>
            <option value="supplier">Fournisseur</option>
          </select>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo
            </label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-20 h-20 rounded-full object-cover border"
              />
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingUser ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
