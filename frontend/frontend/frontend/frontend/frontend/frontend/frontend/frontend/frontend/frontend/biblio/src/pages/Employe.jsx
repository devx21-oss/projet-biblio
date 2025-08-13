import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  FaBook, FaShoppingCart, FaMoneyBillWave, FaTags,
  FaCopy, FaClock, FaCalendarCheck, FaBell, FaSignOutAlt
} from "react-icons/fa";

// --- Composants de chaque onglet ---
function Livres() {
  return (
    <table className="min-w-full border">
      <thead className="bg-gray-200">
        <tr>
          <th className="border p-2">Titre</th>
          <th className="border p-2">Auteur</th>
          <th className="border p-2">ISBN</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border p-2">Le Petit Prince</td>
          <td className="border p-2">Antoine de Saint-Exupéry</td>
          <td className="border p-2">123456789</td>
        </tr>
        <tr>
          <td className="border p-2">1984</td>
          <td className="border p-2">George Orwell</td>
          <td className="border p-2">987654321</td>
        </tr>
      </tbody>
    </table>
  );
}

function Commandes() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-white shadow rounded">
        <h3 className="font-bold">Commande #1</h3>
        <p>3 livres achetés</p>
      </div>
      <div className="p-4 bg-white shadow rounded">
        <h3 className="font-bold">Commande #2</h3>
        <p>2 livres achetés</p>
      </div>
    </div>
  );
}

function Amendes() {
  return (
    <ul className="list-disc pl-5">
      <li>Retard livre "1984" - 5€</li>
      <li>Retard livre "Le Petit Prince" - 2€</li>
    </ul>
  );
}

function Categories() {
  return (
    <div className="flex gap-2 flex-wrap">
      <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded">Science</span>
      <span className="bg-green-100 text-green-800 px-3 py-1 rounded">Roman</span>
      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded">Histoire</span>
    </div>
  );
}

function Exemplaires() {
  return <div>Liste des exemplaires avec leur état.</div>;
}

function Prets() {
  return <div>Liste des prêts en cours.</div>;
}

function Reservations() {
  return <div>Liste des réservations effectuées.</div>;
}

function Notifications() {
  return <div>Vous avez 3 nouvelles notifications.</div>;
}

export default function Employe() {
  const { onglet } = useParams();
  const navigate = useNavigate();

  const onglets = [
    { name: "livres", icon: <FaBook />, component: <Livres /> },
    { name: "commandes", icon: <FaShoppingCart />, component: <Commandes /> },
    { name: "amendes", icon: <FaMoneyBillWave />, component: <Amendes /> },
    { name: "categories", icon: <FaTags />, component: <Categories /> },
    { name: "exemplaires", icon: <FaCopy />, component: <Exemplaires /> },
    { name: "prets", icon: <FaClock />, component: <Prets /> },
    { name: "reservations", icon: <FaCalendarCheck />, component: <Reservations /> },
    { name: "notifications", icon: <FaBell />, component: <Notifications /> },
  ];

  useEffect(() => {
    if (!onglet || !onglets.some(tab => tab.name === onglet.toLowerCase())) {
      navigate(`/employe/${onglets[0].name}`, { replace: true });
    }
  }, [onglet, navigate]);

  const ongletSelectionne = onglets.find(tab => tab.name === onglet?.toLowerCase()) || onglets[0];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-6 text-indigo-600">📚 Espace Employé</h2>
        <nav className="flex flex-col gap-2">
          {onglets.map(({ name, icon }) => (
            <button
              key={name}
              className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                ongletSelectionne.name === name
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
              }`}
              onClick={() => navigate(`/employe/${name}`)}
            >
              {icon}
              <span className="capitalize">{name}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 w-full"
          >
            <FaSignOutAlt />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4 capitalize">{ongletSelectionne.name}</h1>
        <div className="bg-white shadow rounded p-4 min-h-[300px]">
          {ongletSelectionne.component}
        </div>
      </main>
    </div>
  );
}
