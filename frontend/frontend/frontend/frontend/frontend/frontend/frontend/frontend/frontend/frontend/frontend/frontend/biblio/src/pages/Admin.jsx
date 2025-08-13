import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  FaSignOutAlt
} from "react-icons/fa";

// Composants exemples pour chaque onglet (à remplacer par tes vrais composants)
function Utilisateurs() {
  return <div>Ici la liste des utilisateurs</div>;
}
function Livres() {
  return <div>Ici la liste des livres</div>;
}
function Commandes() {
  return <div>Ici la liste des commandes</div>;
}
function Amendes() {
  return <div>Ici la liste des amendes</div>;
}
function Categories() {
  return <div>Ici la liste des catégories</div>;
}
function Exemplaires() {
  return <div>Ici la liste des exemplaires</div>;
}
function LigneCommandeFournisseur() {
  return <div>Ici la liste des commandes fournisseurs</div>;
}
function Pret() {
  return <div>Ici la liste des prêts</div>;
}
function Reservation() {
  return <div>Ici la liste des réservations</div>;
}
function Notification() {
  return <div>Ici la liste des notifications</div>;
}

export default function Admin() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extraction de l'onglet actif depuis l'URL
  const ongletActif = location.pathname.split("/").pop();

  const onglets = [
    { name: "Utilisateurs", icon: <FaUsers />, component: <Utilisateurs /> },
    { name: "Livres", icon: <FaBook />, component: <Livres /> },
    { name: "Commandes", icon: <FaShoppingCart />, component: <Commandes /> },
    { name: "Amendes", icon: <FaMoneyBillWave />, component: <Amendes /> },
    { name: "Categories", icon: <FaTags />, component: <Categories /> },
    { name: "Exemplaires", icon: <FaCopy />, component: <Exemplaires /> },
    { name: "LigneCommandeFournisseur", icon: <FaFileInvoice />, component: <LigneCommandeFournisseur /> },
    { name: "Pret", icon: <FaClock />, component: <Pret /> },
    { name: "Reservation", icon: <FaCalendarCheck />, component: <Reservation /> },
    { name: "Notification", icon: <FaBell />, component: <Notification /> },
  ];

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Trouver l'onglet actif dans la liste ou prendre le premier par défaut
  const ongletSelectionne = onglets.find(tab => tab.name === ongletActif) || onglets[0];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{ongletSelectionne.name}</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          <FaSignOutAlt />
          Déconnexion
        </button>
      </div>

      <nav className="mb-6 flex flex-wrap gap-2">
        {onglets.map(({ name, icon }) => (
          <button
            key={name}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              ongletActif === name
                ? "bg-indigo-600 text-white"
                : "bg-white border border-gray-300"
            }`}
            onClick={() => navigate(`/admin/${name}`)}
          >
            {icon}
            <span>{name}</span>
          </button>
        ))}
      </nav>

      <div className="bg-white p-4 rounded shadow overflow-auto max-h-[500px]">
        {ongletSelectionne.component}
      </div>
    </div>
  );
}
