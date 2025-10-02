import React, { useEffect, useState, useCallback, useMemo } from "react";
import { api } from "../api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  FunnelIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

// 🔹 Modal amélioré avec animations
function Modal({ title, children, onClose, size = "lg" }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl"
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleOverlayClick}
    >
      <div className={`bg-gray-800 p-6 rounded-lg w-full ${sizeClasses[size]} text-white transform transition-transform duration-300 ${isVisible ? 'scale-100' : 'scale-95'} max-h-[90vh] overflow-y-auto shadow-2xl`}>
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// 🔹 Composant de chargement amélioré
function LoadingSpinner({ text = "Chargement..." }) {
  return (
    <div className="flex flex-col justify-center items-center h-64 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="text-gray-400">{text}</p>
    </div>
  );
}

// 🔹 Composant de statut avec icônes
function StatusBadge({ status }) {
  const statusConfig = {
    "En attente": { 
      color: "bg-yellow-100 text-yellow-800", 
      icon: "⏳" 
    },
    "Livrée": { 
      color: "bg-green-100 text-green-800", 
      icon: "✅" 
    },
    "Annulée": { 
      color: "bg-red-100 text-red-800", 
      icon: "❌" 
    },
  };

  const config = statusConfig[status] || statusConfig["En attente"];

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${config.color}`}>
      <span>{config.icon}</span>
      <span>{status}</span>
    </span>
  );
}

// 🔹 Composant de recherche et filtres
function SearchAndFilters({ onSearch, onFilter, filters }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (filterType, value) => {
    onFilter(filterType, value);
  };

  return (
    <div className="mb-6 bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher une commande..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-full bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
        >
          <FunnelIcon className="h-5 w-5" />
          <span>Filtres</span>
          {showFilters ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Statut</label>
            <select
              value={filters.status || ""}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="En attente">En attente</option>
              <option value="Livrée">Livrée</option>
              <option value="Annulée">Annulée</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Montant min</label>
            <input
              type="number"
              value={filters.minAmount || ""}
              onChange={(e) => handleFilterChange("minAmount", e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Montant max</label>
            <input
              type="number"
              value={filters.maxAmount || ""}
              onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="10000"
              min="0"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// 🔹 Composant de pagination
function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
      >
        Précédent
      </button>
      
      {pages[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-1 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            1
          </button>
          {pages[0] > 2 && <span className="px-2">...</span>}
        </>
      )}
      
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'} transition-colors`}
        >
          {page}
        </button>
      ))}
      
      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="px-2">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
      >
        Suivant
      </button>
    </div>
  );
}

export default function Commande() {
  const [commandes, setCommandes] = useState([]);
  const [filteredCommandes, setFilteredCommandes] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCommande, setEditCommande] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // 🔹 Charger commandes + utilisateurs avec useCallback
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [commandesRes, usersRes] = await Promise.all([
        api.get("/commandes"),
        api.get("/users?page=1&limit=100")
      ]);
      
      setCommandes(Array.isArray(commandesRes.data) ? commandesRes.data : []);
      setFilteredCommandes(Array.isArray(commandesRes.data) ? commandesRes.data : []);

      const allUsers = Array.isArray(usersRes.data) ? usersRes.data : [];
      setFournisseurs(allUsers.filter(u => u.role === "fournisseur"));
      setEmployes(allUsers.filter(u => u.role === "employe"));
    } catch (err) {
      toast.error("Erreur chargement données");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 🔹 Filtrage et recherche
  useEffect(() => {
    let result = [...commandes];
    
    // Appliquer la recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(commande => 
        (commande.fournisseurId?.nom?.toLowerCase().includes(term) || 
         commande.fournisseurId?.prenom?.toLowerCase().includes(term) ||
         commande.employeId?.nom?.toLowerCase().includes(term) ||
         commande.employeId?.prenom?.toLowerCase().includes(term) ||
         commande.montantTotal?.toString().includes(term) ||
         commande.statut?.toLowerCase().includes(term))
      );
    }
    
    // Appliquer les filtres
    if (filters.status) {
      result = result.filter(commande => commande.statut === filters.status);
    }
    
    if (filters.minAmount) {
      result = result.filter(commande => commande.montantTotal >= Number(filters.minAmount));
    }
    
    if (filters.maxAmount) {
      result = result.filter(commande => commande.montantTotal <= Number(filters.maxAmount));
    }
    
    // Appliquer le tri
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Pour les champs imbriqués (fournisseurId.nom, etc.)
        if (sortConfig.key === 'fournisseurId') {
          aValue = a.fournisseurId ? `${a.fournisseurId.nom} ${a.fournisseurId.prenom || ''}` : '';
          bValue = b.fournisseurId ? `${b.fournisseurId.nom} ${b.fournisseurId.prenom || ''}` : '';
        } else if (sortConfig.key === 'employeId') {
          aValue = a.employeId ? `${a.employeId.nom} ${a.employeId.prenom || ''}` : '';
          bValue = b.employeId ? `${b.employeId.nom} ${b.employeId.prenom || ''}` : '';
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    setFilteredCommandes(result);
    setCurrentPage(1); // Reset à la première page après filtrage
  }, [commandes, searchTerm, filters, sortConfig]);

  // 🔹 Pagination
  const totalPages = Math.ceil(filteredCommandes.length / itemsPerPage);
  const paginatedCommandes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCommandes.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCommandes, currentPage, itemsPerPage]);

  // 🔹 Gestion du tri
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // 🔹 Gestion de la recherche
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // 🔹 Gestion des filtres
  const handleFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value || undefined
    }));
  };

  // 🔹 Supprimer commande
  const deleteCommande = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) return;
    try {
      setIsProcessing(true);
      await api.delete(`/commandes/${id}`);
      setCommandes(commandes.filter(c => c._id !== id));
      if (editCommande?._id === id) setEditCommande(null);
      toast.success("Commande supprimée avec succès");
    } catch {
      toast.error("Erreur lors de la suppression de la commande");
    } finally {
      setIsProcessing(false);
    }
  };

  // 🔹 Formik
  const commandeSchema = Yup.object({
    fournisseurId: Yup.string().required("Fournisseur requis"),
    employeId: Yup.string().required("Employé requis"),
    montantTotal: Yup.number()
      .typeError("Le montant doit être un nombre")
      .required("Montant requis")
      .min(0, "Doit être supérieur ou égal à 0")
      .max(1000000, "Le montant ne peut pas dépasser 1 000 000"),
    statut: Yup.string().required("Statut requis"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fournisseurId: editCommande?.fournisseurId?._id || editCommande?.fournisseurId || "",
      employeId: editCommande?.employeId?._id || editCommande?.employeId || "",
      montantTotal: editCommande?.montantTotal || "",
      statut: editCommande?.statut || "En attente",
    },
    validationSchema: commandeSchema,
    onSubmit: async (values) => {
      try {
        setIsProcessing(true);
        const payload = {
          fournisseurId: values.fournisseurId,
          employeId: values.employeId,
          montantTotal: values.montantTotal,
          statut: values.statut,
        };
        let res;
        if (editCommande?._id) {
          res = await api.put(`/commandes/${editCommande._id}`, payload);
          setCommandes(
            commandes.map(c => (c._id === editCommande._id ? res.data.commande : c))
          );
          toast.success("Commande mise à jour avec succès");
        } else {
          res = await api.post("/commandes", payload);
          setCommandes(prev => [...prev, res.data.commande]);
          toast.success("Commande ajoutée avec succès");
        }
        setEditCommande(null);
      } catch (err) {
        toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement de la commande");
      } finally {
        setIsProcessing(false);
      }
    },
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto p-6 text-white">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            🛒 Gestion des Commandes Fournisseurs
          </h2>
          <p className="text-gray-400 mt-2">
            {filteredCommandes.length} commande{filteredCommandes.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          onClick={() =>
            setEditCommande({
              _id: null,
              fournisseurId: "",
              employeId: "",
              montantTotal: "",
              statut: "En attente",
            })
          }
          disabled={isProcessing}
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-5 py-2.5 rounded-lg shadow-md transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Ajouter une commande</span>
        </button>
      </div>

      {/* Recherche et Filtres */}
      <SearchAndFilters 
        onSearch={handleSearch} 
        onFilter={handleFilter}
        filters={filters}
      />

      {/* Table */}
      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-750">
            <tr>
              <th 
                className="p-3 text-left font-medium cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => handleSort('fournisseurId')}
              >
                <div className="flex items-center">
                  Fournisseur
                  {sortConfig.key === 'fournisseurId' && (
                    sortConfig.direction === 'asc' ? 
                    <ChevronUpIcon className="h-4 w-4 ml-1" /> : 
                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="p-3 text-left font-medium cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => handleSort('employeId')}
              >
                <div className="flex items-center">
                  Employé
                  {sortConfig.key === 'employeId' && (
                    sortConfig.direction === 'asc' ? 
                    <ChevronUpIcon className="h-4 w-4 ml-1" /> : 
                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="p-3 text-left font-medium cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => handleSort('montantTotal')}
              >
                <div className="flex items-center">
                  Montant Total
                  {sortConfig.key === 'montantTotal' && (
                    sortConfig.direction === 'asc' ? 
                    <ChevronUpIcon className="h-4 w-4 ml-1" /> : 
                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="p-3 text-left font-medium cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => handleSort('statut')}
              >
                <div className="flex items-center">
                  Statut
                  {sortConfig.key === 'statut' && (
                    sortConfig.direction === 'asc' ? 
                    <ChevronUpIcon className="h-4 w-4 ml-1" /> : 
                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                  )}
                </div>
              </th>
              <th className="p-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCommandes.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-8 text-gray-400">
                  {commandes.length === 0 
                    ? "Aucune commande trouvée. Commencez par ajouter une nouvelle commande." 
                    : "Aucune commande ne correspond à vos critères de recherche."}
                </td>
              </tr>
            ) : (
              paginatedCommandes.map(c => (
                <tr key={c._id} className="border-t border-gray-700 hover:bg-gray-750 transition-colors group">
                  <td className="p-3">
                    {c.fournisseurId ? (
                      <div>
                        <div className="font-medium">{c.fournisseurId.nom} {c.fournisseurId.prenom || ""}</div>
                        <div className="text-sm text-gray-400">{c.fournisseurId.email}</div>
                      </div>
                    ) : "-"}
                  </td>
                  <td className="p-3">
                    {c.employeId ? (
                      <div>
                        <div className="font-medium">{c.employeId.nom} {c.employeId.prenom || ""}</div>
                        <div className="text-sm text-gray-400">{c.employeId.email}</div>
                      </div>
                    ) : "-"}
                  </td>
                  <td className="p-3 font-mono">{c.montantTotal?.toLocaleString('fr-FR')} TND</td>
                  <td className="p-3">
                    <StatusBadge status={c.statut} />
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditCommande(c)} 
                        className="text-blue-400 hover:text-blue-300 p-1.5 rounded-md bg-blue-900/20 hover:bg-blue-900/40 transition-colors"
                        disabled={isProcessing}
                        title="Modifier la commande"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => deleteCommande(c._id)} 
                        className="text-red-400 hover:text-red-300 p-1.5 rounded-md bg-red-900/20 hover:bg-red-900/40 transition-colors"
                        disabled={isProcessing}
                        title="Supprimer la commande"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />

      {/* Modal */}
      {editCommande && (
        <Modal 
          title={editCommande._id ? "Modifier la Commande" : "Ajouter une Commande"} 
          onClose={() => !isProcessing && setEditCommande(null)}
          size="lg"
        >
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Fournisseur *</label>
              <select 
                name="fournisseurId" 
                value={formik.values.fournisseurId} 
                onChange={formik.handleChange} 
                className="w-full border border-gray-600 p-2.5 rounded-md mt-1 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                disabled={isProcessing}
              >
                <option value="">-- Sélectionner un fournisseur --</option>
                {fournisseurs.map(f => (
                  <option key={f._id} value={f._id}>
                    {f.nom} {f.prenom} {f.email ? `(${f.email})` : ''}
                  </option>
                ))}
              </select>
              {formik.touched.fournisseurId && formik.errors.fournisseurId && (
                <div className="text-red-400 text-sm mt-1">{formik.errors.fournisseurId}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Employé *</label>
              <select 
                name="employeId" 
                value={formik.values.employeId} 
                onChange={formik.handleChange} 
                className="w-full border border-gray-600 p-2.5 rounded-md mt-1 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                disabled={isProcessing}
              >
                <option value="">-- Sélectionner un employé --</option>
                {employes.map(e => (
                  <option key={e._id} value={e._id}>
                    {e.nom} {e.prenom} {e.email ? `(${e.email})` : ''}
                  </option>
                ))}
              </select>
              {formik.touched.employeId && formik.errors.employeId && (
                <div className="text-red-400 text-sm mt-1">{formik.errors.employeId}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Montant Total (TND) *</label>
              <input 
                type="number" 
                name="montantTotal" 
                value={formik.values.montantTotal} 
                onChange={formik.handleChange} 
                className="w-full border border-gray-600 p-2.5 rounded-md mt-1 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                disabled={isProcessing}
                step="0.01"
                min="0"
                placeholder="0.00"
              />
              {formik.touched.montantTotal && formik.errors.montantTotal && (
                <div className="text-red-400 text-sm mt-1">{formik.errors.montantTotal}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Statut *</label>
              <select 
                name="statut" 
                value={formik.values.statut} 
                onChange={formik.handleChange} 
                className="w-full border border-gray-600 p-2.5 rounded-md mt-1 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                disabled={isProcessing}
              >
                <option value="En attente">En attente</option>
                <option value="Livrée">Livrée</option>
                <option value="Annulée">Annulée</option>
              </select>
              {formik.touched.statut && formik.errors.statut && (
                <div className="text-red-400 text-sm mt-1">{formik.errors.statut}</div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700 mt-6">
              <button 
                type="button" 
                onClick={() => setEditCommande(null)} 
                className="px-4 py-2.5 rounded-md border border-gray-600 text-white hover:bg-gray-700 transition-colors disabled:opacity-50" 
                disabled={isProcessing}
              >
                Annuler
              </button>
              <button 
                type="submit" 
                disabled={isProcessing || !formik.isValid} 
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2.5 rounded-md shadow-md transition-all duration-300 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Enregistrement...
                  </div>
                ) : (
                  editCommande._id ? "Mettre à jour" : "Créer la commande"
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}