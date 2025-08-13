import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Accueil from './pages/Accueil';
import Accueil1 from './pages/Accueil1';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Commende from './pages/Commende';
import Employe from './pages/Employe';
import Layout from './components/Layout';
import Utilisateurs from './pages/Utilisateurs';
import Livres from './pages/Livres';
import Amendes from './pages/Amendes';
import Categories from './pages/Categories';
import Exemplaires from './pages/Exemplaires';
import LigneCommandeFournisseur from './pages/LigneCommandeFournisseur';
import Pret from './pages/Pret';
import Forunisseur from './pages/Forunisseur';
import Reservation from './pages/Reservation';
import Notification from './pages/Notification';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Accueil1 />} />   {/* الصفحة العامة عند الدخول */}
            <Route path="/accueil" element={<Accueil />} />  {/* صفحة المستخدم بعد تسجيل الدخول */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/employe/:onglet" element={<Employe />} />
            <Route path="/employe" element={<Employe />} />
            <Route path="/forunisseur" element={<Forunisseur />} />

            {/* Dashboard Admin with layout */}
            <Route path="/Admin" element={<Layout><Admin /></Layout>} />
            <Route path="/admin/utilisateurs" element={<Layout><Utilisateurs /></Layout>} />
            <Route path="/admin/livres" element={<Layout><Livres /></Layout>} />
            <Route path="/admin/commandes" element={<Layout><Commende /></Layout>} />
            <Route path="/admin/amendes" element={<Layout><Amendes /></Layout>} />
            <Route path="/admin/categories" element={<Layout><Categories /></Layout>} />
            <Route path="/admin/exemplaires" element={<Layout><Exemplaires /></Layout>} />
            <Route path="/admin/LigneCommandeFournisseur" element={<Layout><LigneCommandeFournisseur /></Layout>} />
            <Route path="/admin/Pret" element={<Layout><Pret /></Layout>} />
            <Route path="/admin/Reservation" element={<Layout><Reservation /></Layout>} />
            <Route path="/admin/Notification" element={<Layout><Notification /></Layout>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;