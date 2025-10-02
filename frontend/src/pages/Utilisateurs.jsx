import React, { useEffect, useState, useCallback, useMemo } from "react";
import { api } from "../api/axios";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaSort, FaUser, FaEnvelope, FaKey, FaUserTag, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileUpdateForm from "../components/ProfileUpdateForm";

// 🔑 Change this to your backend URL
const API_URL = "http://localhost:5000";

// Skeleton loader component
const UserRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10 bg-gray-300 rounded-full"></div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-300 rounded w-4/5"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-6 bg-gray-300 rounded w-16"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex space-x-2">
        <div className="h-8 w-8 bg-gray-300 rounded"></div>
        <div className="h-8 w-8 bg-gray-300 rounded"></div>
      </div>
    </td>
  </tr>
);

// Empty state component
const EmptyState = ({ onAddUser }) => (
  <div className="text-center py-12">
    <div className="mx-auto h-24 w-24 text-gray-400">
      <FaUser className="w-full h-full" />
    </div>
    <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun utilisateur</h3>
    <p className="mt-1 text-gray-500">Commencez par ajouter votre premier utilisateur.</p>
    <div className="mt-6">
      <button
        onClick={onAddUser}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <FaPlus className="mr-2" />
        Ajouter un utilisateur
      </button>
    </div>
  </div>
);

// Role badge with different colors for each role
const RoleBadge = ({ role }) => {
  const roleColors = {
    admin: "bg-red-100 text-red-800",
    user: "bg-blue-100 text-blue-800",
    editor: "bg-green-100 text-green-800",
    manager: "bg-purple-100 text-purple-800",
    guest: "bg-yellow-100 text-yellow-800"
  };

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColors[role] || "bg-gray-100 text-gray-800"}`}>
      {role}
    </span>
  );
};

export default function Utilisateurs() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Fetch users with useCallback to prevent unnecessary recreations
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter and sort users when search term, role filter or sort config changes
  useEffect(() => {
    let result = users;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.nom?.toLowerCase().includes(term) || 
        user.prenom?.toLowerCase().includes(term) || 
        user.email?.toLowerCase().includes(term)
      );
    }
    
    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, sortConfig]);

  // Get unique roles for filter dropdown
  const uniqueRoles = useMemo(() => {
    const roles = [...new Set(users.map(user => user.role))];
    return roles.sort();
  }, [users]);

  // Request sort
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Add or update user
  const handleSubmit = async (formData) => {
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });

      if (editingUser) {
        await api.put(`/users/${editingUser._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Utilisateur modifié avec succès");
      } else {
        await api.post("/users", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Utilisateur ajouté avec succès");
      }

      setShowModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(
        "Erreur lors de l’enregistrement : " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous supprimer cet utilisateur ?")) return;
    
    setDeletingId(id);
    try {
      await api.delete(`/users/${id}`);
      toast.success("Utilisateur supprimé avec succès");
      fetchUsers();
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  // Function to handle opening modal for adding new user
  const openAddUserModal = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  // Function to handle opening modal for editing user
  const openEditUserModal = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  // Function to close modal and reset editing user
  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  // Function to view user details
  const viewUserDetails = (user) => {
    setSelectedUser(user);
  };

  // Function to close user details
  const closeUserDetails = () => {
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer position="top-right" autoClose={3000} closeOnClick pauseOnHover />

      {/* Header Section */}
      <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
            <p className="mt-2 text-gray-600">Gérez tous les utilisateurs de votre application</p>
          </div>
          <button
            onClick={openAddUserModal}
            className="mt-4 md:mt-0 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Ajouter un utilisateur"
          >
            <FaPlus className="text-sm" /> Nouvel utilisateur
          </button>
        </div>

        {/* Filters and Search Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
            >
              <option value="all">Tous les rôles</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('table')}
              className={`flex-1 py-3 px-4 rounded-xl border transition-colors ${viewMode === 'table' ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              Vue tableau
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex-1 py-3 px-4 rounded-xl border transition-colors ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              Vue grille
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          {filteredUsers.length} {filteredUsers.length === 1 ? 'utilisateur' : 'utilisateurs'} trouvés
        </p>
        {(searchTerm || roleFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setRoleFilter('all');
            }}
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            <FaTimes className="mr-1" /> Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prénom
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <UserRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState onAddUser={openAddUserModal} />
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('nom')}
                >
                  <div className="flex items-center">
                    Nom
                    <FaSort className="ml-1 text-gray-400" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('prenom')}
                >
                  <div className="flex items-center">
                    Prénom
                    <FaSort className="ml-1 text-gray-400" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('email')}
                >
                  <div className="flex items-center">
                    Email
                    <FaSort className="ml-1 text-gray-400" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('role')}
                >
                  <div className="flex items-center">
                    Rôle
                    <FaSort className="ml-1 text-gray-400" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const photoUrl =
                  user.photo && user.photo !== "default.png"
                    ? `${API_URL}/uploads/${user.photo}`
                    : "/default-avatar.png";

                return (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => viewUserDetails(user)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            src={photoUrl}
                            alt={`${user.prenom || ''} ${user.nom || ''}`.trim() || "Utilisateur"}
                            className="h-10 w-10 rounded-full object-cover border-2 border-white shadow"
                            onError={(e) => {
                              e.target.src = "/default-avatar.png";
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.nom || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.prenom || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditUserModal(user);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          aria-label={`Modifier ${user.prenom} ${user.nom}`}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(user._id);
                          }}
                          disabled={deletingId === user._id}
                          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={`Supprimer ${user.prenom} ${user.nom}`}
                        >
                          {deletingId === user._id ? (
                            <div className="w-4 h-4 border-t-2 border-red-600 border-solid rounded-full animate-spin"></div>
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => {
            const photoUrl =
              user.photo && user.photo !== "default.png"
                ? `${API_URL}/uploads/${user.photo}`
                : "/default-avatar.png";

            return (
              <div 
                key={user._id} 
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                onClick={() => viewUserDetails(user)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <img
                        src={photoUrl}
                        alt={`${user.prenom || ''} ${user.nom || ''}`.trim() || "Utilisateur"}
                        className="h-16 w-16 rounded-full object-cover border-2 border-white shadow"
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                    </div>
                    <RoleBadge role={user.role} />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.prenom} {user.nom}
                    </h3>
                    <p className="text-gray-600 mt-1 flex items-center">
                      <FaEnvelope className="mr-2 text-indigo-500" /> {user.email}
                    </p>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditUserModal(user);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium"
                    >
                      <FaEdit className="mr-1" /> Modifier
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(user._id);
                      }}
                      disabled={deletingId === user._id}
                      className="text-red-600 hover:text-red-800 flex items-center text-sm font-medium disabled:opacity-50"
                    >
                      {deletingId === user._id ? (
                        <>
                          <div className="w-3 h-3 border-t-2 border-red-600 border-solid rounded-full animate-spin mr-1"></div>
                          Suppression...
                        </>
                      ) : (
                        <>
                          <FaTrash className="mr-1" /> Supprimer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Détails de l'utilisateur</h3>
                <button
                  onClick={closeUserDetails}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex flex-col items-center mb-6">
                <img
                  src={selectedUser.photo && selectedUser.photo !== "default.png" 
                    ? `${API_URL}/uploads/${selectedUser.photo}` 
                    : "/default-avatar.png"}
                  alt={`${selectedUser.prenom || ''} ${selectedUser.nom || ''}`.trim() || "Utilisateur"}
                  className="h-24 w-24 rounded-full object-cover border-2 border-white shadow-md"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  {selectedUser.prenom} {selectedUser.nom}
                </h2>
                <div className="mt-2">
                  <RoleBadge role={selectedUser.role} />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaEnvelope className="text-indigo-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{selectedUser.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FaUserTag className="text-indigo-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Rôle</p>
                    <p className="text-gray-900 capitalize">{selectedUser.role}</p>
                  </div>
                </div>
                
                {selectedUser.createdAt && (
                  <div className="flex items-center">
                    <FaKey className="text-indigo-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Membre depuis</p>
                      <p className="text-gray-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8 flex space-x-3">
                <button
                  onClick={() => {
                    closeUserDetails();
                    openEditUserModal(selectedUser);
                  }}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <FaEdit className="mr-2" /> Modifier
                </button>
                <button
                  onClick={closeUserDetails}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <ProfileUpdateForm
          editingUser={editingUser}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      )}
    </div>
  );
}