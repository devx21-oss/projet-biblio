import React from "react";
import { useLocation } from "react-router-dom";

// 👇 كل Component خاص بتبويب
function Livres() {
  return <div>📚 Liste des livres</div>;
}
function Commandes() {
  return <div>🛒 Liste des commandes</div>;
}
function Amendes() {
  return <div>💰 Liste des amendes</div>;
}
function Categories() {
  return <div>🏷️ Liste des catégories</div>;
}
function Exemplaires() {
  return <div>📄 Liste des exemplaires</div>;
}
function Prets() {
  return <div>⏳ Liste des prêts</div>;
}
function Reservations() {
  return <div>📅 Liste des réservations</div>;
}
function Notifications() {
  return <div>🔔 Liste des notifications</div>;
}

// 👇 tabs avec leurs paths
const onglets = [
  { name: "Livres", path: "livres", component: <Livres /> },
  { name: "Commandes", path: "commandes", component: <Commandes /> },
  { name: "Amendes", path: "amendes", component: <Amendes /> },
  { name: "Categories", path: "categories", component: <Categories /> },
  { name: "Exemplaires", path: "exemplaires", component: <Exemplaires /> },
  { name: "Prets", path: "prets", component: <Prets /> },
  { name: "Reservations", path: "reservations", component: <Reservations /> },
  { name: "Notifications", path: "notifications", component: <Notifications /> },
];

export default function Employe() {
  const location = useLocation();

  // 🟢 نجيبو آخر جزء من path (ex: /employe/livres → "livres")
  const currentPath = location.pathname.split("/").pop();

  // 🔎 نلقاو التبويب المناسب
  const ongletSelectionne =
    onglets.find((t) => t.path === currentPath) || onglets[0];

  return (
    <div className="p-4">
      {/* العنوان متغير حسب التبويب */}
      <h2 className="text-2xl font-bold mb-4">{ongletSelectionne.name}</h2>
      {/* نعرض الكومبونون */}
      {ongletSelectionne.component}
    </div>
  );
}
