// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Accueil from "./pages/Accueil";
import Accueil1 from "./pages/Accueil1";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Commende from "./pages/Commende";
import Employe from "./pages/Employe";
import Utilisateurs from "./pages/Utilisateurs";
import Livres from "./pages/Livres";
import Amendes from "./pages/Amendes";
import Categories from "./pages/Categories";
import Exemplaires from "./pages/Exemplaires";
import LigneCommandeFournisseur from "./pages/LigneCommandeFournisseur";
import Pret from "./pages/Pret";
import Forunisseur from "./pages/Forunisseur";
import Reservation from "./pages/Reservation";
import Notification from "./pages/Notification";
import MesReservations from "./pages/MesReservations";
import Profile from "./pages/Profile";

// Wrapper
import DashboardLayoutRoute from "./components/DashboardLayoutRoute";

// Chatbot (optionnel global)
import Chatbot from "./components/chatbot";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Accueil1 />} />
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<h1>⛔ Unauthorized</h1>} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <DashboardLayoutRoute allowedRoles={["admin"]}>
              <Admin />
            </DashboardLayoutRoute>
          }
        />
        <Route
          path="/admin/utilisateurs"
          element={
            <DashboardLayoutRoute allowedRoles={["admin"]}>
              <Utilisateurs />
            </DashboardLayoutRoute>
          }
        />
        <Route
          path="/admin/livres"
          element={
            <DashboardLayoutRoute allowedRoles={["admin"]}>
              <Livres />
            </DashboardLayoutRoute>
          }
        />
        <Route
          path="/admin/commandes"
          element={
            <DashboardLayoutRoute allowedRoles={["admin", "supplier"]}>
              <Commende />
            </DashboardLayoutRoute>
          }
        />
        <Route
          path="/admin/amendes"
          element={
            <DashboardLayoutRoute allowedRoles={["admin", "employe"]}>
              <Amendes />
            </DashboardLayoutRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <DashboardLayoutRoute allowedRoles={["admin", "employe"]}>
              <Categories />
            </DashboardLayoutRoute>
          }
        />
        <Route
          path="/admin/exemplaires"
          element={
            <DashboardLayoutRoute allowedRoles={["admin", "employe"]}>
              <Exemplaires />
            </DashboardLayoutRoute>
          }
        />
        <Route
          path="/admin/lignecommandefournisseur"
          element={
            <DashboardLayoutRoute allowedRoles={["admin", "employe"]}>
              <LigneCommandeFournisseur />
            </DashboardLayoutRoute>
          }
        />
        <Route
          path="/admin/pret"
          element={
            <DashboardLayoutRoute allowedRoles={["admin", "employe"]}>
              <Pret />
            </DashboardLayoutRoute>
          }
        />
        <Route
          path="/admin/reservation"
          element={
            <DashboardLayoutRoute allowedRoles={["admin", "employe"]}>
              <Reservation />
            </DashboardLayoutRoute>
          }
        />
        <Route
          path="/admin/notification"
          element={
            <DashboardLayoutRoute allowedRoles={["admin", "employe"]}>
              <Notification />
            </DashboardLayoutRoute>
          }
        />
        <Route
          path="/admin/profil"
          element={
            <DashboardLayoutRoute
              allowedRoles={["admin", "employe", "etudiant", "supplier"]}
            >
              <Profile />
            </DashboardLayoutRoute>
          }
        />

        {/* Employé routes */}
        <Route
          path="/employe"
          element={
            <DashboardLayoutRoute allowedRoles={["employe", "admin"]}>
              <Employe />
            </DashboardLayoutRoute>
          }
        />
        <Route
          path="/employe/livres"
          element={
            <DashboardLayoutRoute allowedRoles={["employe", "admin"]}>
              <Livres />
            </DashboardLayoutRoute>
          }
        />
        <Route
          path="/employe/amendes"
          element={
            <DashboardLayoutRoute allowedRoles={["employe", "admin"]}>
              <Amendes />
            </DashboardLayoutRoute>
          }
        />
        <Route
          path="/employe/categories"
          element={
            <DashboardLayoutRoute allowedRoles={["employe", "admin"]}>
              <Categories />
            </DashboardLayoutRoute>
          }
        />
        <Route
          path="/employe/exemplaires"
          element={
            <DashboardLayoutRoute allowedRoles={["employe", "admin"]}>
              <Exemplaires />
            </DashboardLayoutRoute>
          }
        />
        <Route
          path="/employe/lignecommandefournisseur"
          element={
            <DashboardLayoutRoute allowedRoles={["employe", "admin"]}>
              <LigneCommandeFournisseur />
            </DashboardLayoutRoute>
          }
        />
        <Route
          path="/employe/notification"
          element={
            <DashboardLayoutRoute allowedRoles={["employe", "admin"]}>
              <Notification />
            </DashboardLayoutRoute>
          }
        />
        <Route
          path="/employe/pret"
          element={
            <DashboardLayoutRoute allowedRoles={["employe", "admin"]}>
              <Pret />
            </DashboardLayoutRoute>
          }
        />
        <Route
          path="/employe/reservation"
          element={
            <DashboardLayoutRoute allowedRoles={["employe", "admin"]}>
              <Reservation />
            </DashboardLayoutRoute>
          }
        />
        <Route
          path="/employe/profil"
          element={
            <DashboardLayoutRoute allowedRoles={["employe", "admin", "etudiant"]}>
              <Profile />
            </DashboardLayoutRoute>
          }
        />

        {/* Fournisseur */}
        <Route
          path="/forunisseur"
          element={
            <DashboardLayoutRoute allowedRoles={["supplier", "admin"]}>
              <Forunisseur />
            </DashboardLayoutRoute>
          }
        />

        {/* Étudiant */}
        <Route
          path="/MesReservations"
          element={
            <DashboardLayoutRoute allowedRoles={["etudiant"]}>
              <MesReservations />
            </DashboardLayoutRoute>
          }
        />

        {/* Common profile */}
        <Route
          path="/profil"
          element={
            <DashboardLayoutRoute
              allowedRoles={["admin", "employe", "etudiant", "supplier"]}
            >
              <Profile />
            </DashboardLayoutRoute>
          }
        />
      </Routes>

      {/* 👇 Chatbot global sur toutes les pages */}
      <Chatbot />
    </Router>
  );
}

export default App;
