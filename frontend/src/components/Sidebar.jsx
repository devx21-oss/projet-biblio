import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
} from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.split("/").pop();

  const tabs = [
    { name: "Utilisateurs", icon: <FaUsers /> },
    { name: "Livres", icon: <FaBook /> },
    { name: "Commandes", icon: <FaShoppingCart /> },
    { name: "Amendes", icon: <FaMoneyBillWave /> },
    { name: "Categories", icon: <FaTags /> },
    { name: "Exemplaires", icon: <FaCopy /> },
    { name: "LigneCommandeFournisseur", icon: <FaFileInvoice /> },
    { name: "Pret", icon: <FaClock /> },
    { name: "Reservation", icon: <FaCalendarCheck /> },
    { name: "Notification", icon: <FaBell /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="bg-gray-900 text-gray-100 w-64 flex flex-col min-h-screen">
      <div className="text-center text-2xl font-bold py-6 border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="flex flex-col flex-grow p-4 space-y-2">
        {tabs.map(({ name, icon }) => (
          <button
            key={name}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              currentTab === name
                ? "bg-indigo-600 text-white"
                : "hover:bg-gray-700 text-gray-300"
            }`}
            onClick={() => navigate(`/admin/${name}`)}
          >
            <span className="text-lg">{icon}</span>
            <span className="font-medium">{name}</span>
          </button>
        ))}

        {/* زر تسجيل الخروج */}
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
  );
}
