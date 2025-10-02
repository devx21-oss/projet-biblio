// src/components/Sidebar.jsx
import React from "react";
import {
  FaUsers,
  FaBook,
  FaShoppingCart,
  FaMoneyBillWave,
  FaTags,
  FaCopy,
  FaFileInvoice,
  FaClock,
  FaCalendarCheck,
  FaBell,
  FaSignOutAlt,
  FaUserCircle,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ activeTab, onChangeTab, isOpen, setIsOpen, role }) {
  const navigate = useNavigate();

  // 🎯 Tabs مقسمة حسب الدور
  const allTabs = [
    // 👑 Admin
    { name: "Utilisateurs", icon: <FaUsers />, path: "/admin/utilisateurs", allowedRoles: ["admin"] },
    { name: "Livres", icon: <FaBook />, path: "/admin/livres", allowedRoles: ["admin"] },
    { name: "Amendes", icon: <FaMoneyBillWave />, path: "/admin/amendes", allowedRoles: ["admin"] },
    { name: "Categories", icon: <FaTags />, path: "/admin/categories", allowedRoles: ["admin"] },
    { name: "Exemplaires", icon: <FaCopy />, path: "/admin/exemplaires", allowedRoles: ["admin"] },
    { name: "LigneCommandeFournisseur", icon: <FaFileInvoice />, path: "/admin/lignecommandefournisseur", allowedRoles: ["admin"] },
    { name: "Pret", icon: <FaClock />, path: "/admin/pret", allowedRoles: ["admin"] },
    { name: "Reservation", icon: <FaCalendarCheck />, path: "/admin/reservation", allowedRoles: ["admin"] },
    { name: "Notification", icon: <FaBell />, path: "/admin/notification", allowedRoles: ["admin"] },

    // 👨‍💼 Employé
    { name: "Livres", icon: <FaBook />, path: "/employe/livres", allowedRoles: ["employe"] },
    { name: "Amendes", icon: <FaMoneyBillWave />, path: "/employe/amendes", allowedRoles: ["employe"] },
    { name: "Categories", icon: <FaTags />, path: "/employe/categories", allowedRoles: ["employe"] },
    { name: "Exemplaires", icon: <FaCopy />, path: "/employe/exemplaires", allowedRoles: ["employe"] },
    { name: "LigneCommandeFournisseur", icon: <FaFileInvoice />, path: "/employe/lignecommandefournisseur", allowedRoles: ["employe"] },
    { name: "Pret", icon: <FaClock />, path: "/employe/pret", allowedRoles: ["employe"] },
    { name: "Reservation", icon: <FaCalendarCheck />, path: "/employe/reservation", allowedRoles: ["employe"] },
    { name: "Notification", icon: <FaBell />, path: "/employe/notification", allowedRoles: ["employe"] },

    // 👩‍🎓 Étudiant
    { name: "Mes Réservations", icon: <FaCalendarCheck />, path: "/MesReservations", allowedRoles: ["etudiant"] },
    { name: "Notifications", icon: <FaBell />, path: "/etudiant/notifications", allowedRoles: ["etudiant"] },

    // 🛒 Fournisseur
    { name: "CommandesFournisseur", icon: <FaShoppingCart />, path: "/fournisseur/commandes", allowedRoles: ["supplier"] },

    // 👤 Profil (لكل الأدوار)
    { name: "Profil", icon: <FaUserCircle />, path: "/profil", allowedRoles: ["admin","employe","etudiant","supplier"] },
  ];

  const roleTitles = {
    admin: "Admin Panel",
    employe: "Employé Dashboard",
    etudiant: "Étudiant Dashboard",
    supplier: "Fournisseur Dashboard",
  };

  const visibleTabs = allTabs.filter((tab) => role && tab.allowedRoles.includes(role));
  const title = role ? roleTitles[role] : "Dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <aside
        className={`bg-gray-900 text-gray-100 w-64 flex flex-col min-h-screen fixed top-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-50`}
      >
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setIsOpen(false)} className="text-2xl">
            <FaTimes />
          </button>
        </div>

        <div className="text-center text-2xl font-bold py-6 border-b border-gray-700 md:block hidden">
          {title}
        </div>

        <nav className="flex flex-col flex-grow p-4 space-y-2">
          {visibleTabs.map(({ name, icon, path }) => (
            <button
              key={name}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === name
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
              onClick={() => {
                onChangeTab(name);
                navigate(path);
                setIsOpen(false);
              }}
            >
              <span className="text-lg">{icon}</span>
              <span className="font-medium">{name}</span>
            </button>
          ))}

          <div className="mt-auto pt-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors w-full"
            >
              <FaSignOutAlt className="text-lg" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
