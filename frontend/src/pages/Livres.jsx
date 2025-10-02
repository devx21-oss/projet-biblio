import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "../api/axios";
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiX, FiChevronLeft, FiChevronRight, FiInfo, FiImage } from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Livres = () => {
  const [livres, setLivres] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sortField, setSortField] = useState("titre");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedLivre, setSelectedLivre] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    titre: "",
    auteur: "",
    isbn: "",
    categorie: "",
    quantite: 1,
    imageCouverture: null
  });

  const [editingId, setEditingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Utilisation de useCallback pour mémoriser les fonctions
  const fetchLivres = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/livres?page=${page}&limit=${limit}&search=${search}&sort=${sortField}&order=${sortOrder}`);
      setLivres(res.data.livres);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des livres");
      toast.error("Erreur lors du chargement des livres");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, sortField, sortOrder]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get("/categories");
      setCategories(Array.isArray(res.data) ? res.data : res.data.categories || []);
    } catch (err) {
      console.error(err);
      setCategories([]);
      setError("Erreur lors du chargement des catégories");
      toast.error("Erreur lors du chargement des catégories");
    }
  }, []);

  useEffect(() => {
    fetchLivres();
    fetchCategories();
  }, [fetchLivres, fetchCategories]);

  // Prévisualisation d'image
  useEffect(() => {
    if (formData.imageCouverture) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(formData.imageCouverture);
    } else {
      setImagePreview(null);
    }
  }, [formData.imageCouverture]);

  // Validation du formulaire
  const validateForm = () => {
    const errors = {};
    
    if (!formData.titre.trim()) errors.titre = "Le titre est requis";
    if (!formData.auteur.trim()) errors.auteur = "L'auteur est requis";
    if (formData.quantite < 0) errors.quantite = "La quantité ne peut pas être négative";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "imageCouverture") {
      setFormData({ ...formData, imageCouverture: files[0] });
    } else if (name === "quantite") {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Effacer l'erreur du champ quand l'utilisateur commence à taper
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }
    
    setError(null);
    try {
      const data = new FormData();
      data.append("titre", formData.titre);
      data.append("auteur", formData.auteur);
      data.append("isbn", formData.isbn);
      data.append("categorie", formData.categorie);
      data.append("quantite", formData.quantite);
      if (formData.imageCouverture) data.append("imageCouverture", formData.imageCouverture);

      if (editingId) {
        await api.put(`/livres/${editingId}`, data, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Livre mis à jour avec succès");
      } else {
        await api.post("/livres", data, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Livre ajouté avec succès");
      }

      resetForm();
      fetchLivres();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Une erreur est survenue";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleEdit = (livre) => {
    setEditingId(livre._id);
    setFormData({
      titre: livre.titre,
      auteur: livre.auteur,
      isbn: livre.isbn || "",
      categorie: livre.categorie?._id || "",
      quantite: livre.quantite || 1,
      imageCouverture: null
    });
    setShowForm(true);
    setImagePreview(livre.imageCouverture ? `http://localhost:5000/uploads/${livre.imageCouverture}` : null);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/livres/${deleteId}`);
      toast.success("Livre supprimé avec succès");
      fetchLivres();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression du livre");
      toast.error("Erreur lors de la suppression du livre");
    } finally {
      setShowDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const resetForm = () => {
    setFormData({ titre: "", auteur: "", isbn: "", categorie: "", quantite: 1, imageCouverture: null });
    setEditingId(null);
    setShowForm(false);
    setFormErrors({});
    setImagePreview(null);
  };

  const showDetails = (livre) => {
    setSelectedLivre(livre);
  };

  // Pagination
  const totalPages = Math.ceil(total / limit);
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }, [page, totalPages]);

  // Statistiques
  const stats = useMemo(() => {
    return {
      total: livres.length,
      available: livres.filter(l => l.quantite > 0).length,
      outOfStock: livres.filter(l => l.quantite === 0).length,
      categories: new Set(livres.map(l => l.categorie?.nom).filter(Boolean)).size
    };
  }, [livres]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Livres</h1>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Total des livres</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Disponibles</h3>
          <p className="text-2xl font-bold">{stats.available}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500">Rupture de stock</h3>
          <p className="text-2xl font-bold">{stats.outOfStock}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
          <h3 className="text-sm font-medium text-gray-500">Catégories</h3>
          <p className="text-2xl font-bold">{stats.categories}</p>
        </div>
      </div>

      {/* Barre de recherche et contrôles */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
        <div className="relative flex-grow">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un livre par titre, auteur ou ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 p-2 pl-10 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <select
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="5">5 par page</option>
            <option value="10">10 par page</option>
            <option value="20">20 par page</option>
            <option value="50">50 par page</option>
          </select>
          
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 justify-center whitespace-nowrap"
          >
            <FiPlus /> {showForm ? "Masquer" : "Nouveau livre"}
          </button>
        </div>
      </div>

      {/* Formulaire */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{editingId ? "Modifier le livre" : "Ajouter un nouveau livre"}</h2>
            <button type="button" onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <FiX size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
              <input 
                type="text" 
                name="titre" 
                value={formData.titre} 
                onChange={handleChange} 
                placeholder="Titre du livre" 
                className={`border ${formErrors.titre ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`} 
              />
              {formErrors.titre && <p className="mt-1 text-sm text-red-600">{formErrors.titre}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Auteur *</label>
              <input 
                type="text" 
                name="auteur" 
                value={formData.auteur} 
                onChange={handleChange} 
                placeholder="Auteur du livre" 
                className={`border ${formErrors.auteur ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`} 
              />
              {formErrors.auteur && <p className="mt-1 text-sm text-red-600">{formErrors.auteur}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
              <input 
                type="text" 
                name="isbn" 
                value={formData.isbn} 
                onChange={handleChange} 
                placeholder="ISBN" 
                className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
              <input 
                type="number" 
                name="quantite" 
                value={formData.quantite} 
                onChange={handleChange} 
                placeholder="Quantité" 
                className={`border ${formErrors.quantite ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`} 
                min="0" 
              />
              {formErrors.quantite && <p className="mt-1 text-sm text-red-600">{formErrors.quantite}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select 
                name="categorie" 
                value={formData.categorie} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Choisir une catégorie --</option>
                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.nom}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image de couverture</label>
              <div className="flex items-center gap-4">
                <label className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 w-full">
                  <FiImage className="text-gray-400 mb-2" size={24} />
                  <span className="text-sm text-gray-500">Choisir une image</span>
                  <input 
                    type="file" 
                    name="imageCouverture" 
                    accept="image/*" 
                    onChange={handleChange} 
                    className="hidden" 
                  />
                </label>
                
                {imagePreview && (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded" />
                    <button 
                      type="button" 
                      onClick={() => {
                        setFormData({...formData, imageCouverture: null});
                        setImagePreview(null);
                      }} 
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              {editingId ? "Mettre à jour" : "Ajouter le livre"}
            </button>
            <button 
              type="button" 
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Tableau des livres */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2">Chargement des livres...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th 
                      className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("titre")}
                    >
                      Titre {sortField === "titre" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th 
                      className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("auteur")}
                    >
                      Auteur {sortField === "auteur" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISBN</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                    <th 
                      className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("quantite")}
                    >
                      Quantité {sortField === "quantite" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {livres.length > 0 ? (
                    livres.map((livre) => (
                      <tr key={livre._id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {livre.imageCouverture ? (
                            <img 
                              src={`http://localhost:5000/uploads/${livre.imageCouverture}`} 
                              alt={livre.titre} 
                              className="w-12 h-12 object-cover rounded" 
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                              <FiImage size={20} />
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          <button 
                            onClick={() => showDetails(livre)}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {livre.titre}
                          </button>
                        </td>
                        <td className="py-3 px-4">{livre.auteur}</td>
                        <td className="py-3 px-4">{livre.isbn || "-"}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {livre.categorie?.nom || "-"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${livre.quantite > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {livre.quantite || 0}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEdit(livre)} 
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                              aria-label="Modifier"
                              title="Modifier"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(livre._id)} 
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                              aria-label="Supprimer"
                              title="Supprimer"
                            >
                              <FiTrash2 size={18} />
                            </button>
                            <button 
                              onClick={() => showDetails(livre)} 
                              className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-50"
                              aria-label="Détails"
                              title="Détails"
                            >
                              <FiInfo size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-6 px-4 text-center text-gray-500">
                        {search ? "Aucun livre ne correspond à votre recherche" : "Aucun livre enregistré"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between">
                <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                  Affichage de <span className="font-medium">{(page - 1) * limit + 1}</span> à <span className="font-medium">{Math.min(page * limit, total)}</span> sur <span className="font-medium">{total}</span> livres
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    disabled={page === 1} 
                    onClick={() => setPage(1)} 
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronLeft className="inline" /> Début
                  </button>
                  <button 
                    disabled={page === 1} 
                    onClick={() => setPage(p => p - 1)} 
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronLeft className="inline" /> Précédent
                  </button>
                  
                  {pageNumbers.map(num => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${page === num ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {num}
                    </button>
                  ))}
                  
                  <button 
                    disabled={page >= totalPages} 
                    onClick={() => setPage(p => p + 1)} 
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant <FiChevronRight className="inline" />
                  </button>
                  <button 
                    disabled={page >= totalPages} 
                    onClick={() => setPage(totalPages)} 
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Fin <FiChevronRight className="inline" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer ce livre ? Cette action est irréversible.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détails */}
      {selectedLivre && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Détails du livre</h3>
              <button onClick={() => setSelectedLivre(null)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            
            <div className="flex flex-col items-center mb-4">
              {selectedLivre.imageCouverture ? (
                <img 
                  src={`http://localhost:5000/uploads/${selectedLivre.imageCouverture}`} 
                  alt={selectedLivre.titre} 
                  className="w-32 h-40 object-cover rounded-lg shadow-md mb-4" 
                />
              ) : (
                <div className="w-32 h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 mb-4">
                  <FiImage size={40} />
                </div>
              )}
              
              <h4 className="text-lg font-semibold">{selectedLivre.titre}</h4>
              <p className="text-gray-600">par {selectedLivre.auteur}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">ISBN:</span>
                <span>{selectedLivre.isbn || "Non renseigné"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Catégorie:</span>
                <span>{selectedLivre.categorie?.nom || "Non catégorisé"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantité:</span>
                <span className={selectedLivre.quantite > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                  {selectedLivre.quantite} {selectedLivre.quantite > 0 ? "disponible(s)" : "en rupture"}
                </span>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setSelectedLivre(null);
                  handleEdit(selectedLivre);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Modifier ce livre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Livres;