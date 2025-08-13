import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from '../api/axios';
import { jwtDecode } from 'jwt-decode';


export default function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [errors, setErrors] = useState({ email: "", motDePasse: "" });
  const [generalError, setGeneralError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = { email: "", motDePasse: "" };
    let valid = true;

    if (!email.trim()) {
      newErrors.email = "Veuillez entrer votre email.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email invalide.";
      valid = false;
    }

    if (!motDePasse) {
      newErrors.motDePasse = "Veuillez entrer votre mot de passe.";
      valid = false;
    } else if (motDePasse.length < 6) {
      newErrors.motDePasse = "Le mot de passe doit contenir au moins 6 caractères.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setGeneralError("");

  if (!validate()) return;

  try {
    const res = await api.post("/users/login", { email, motDePasse });
    const token = res.data.token;
    localStorage.setItem("token", token);

    const decoded = jwtDecode(token);
    console.log("Utilisateur connecté :", decoded);

    switch (decoded.role) {
      case "admin":
        navigate("/admin");
        break;
      case "etudiant":
        navigate("/accueil"); 
        break;
      case "employe":
        navigate("/employe");
        break;
      case "supplier":
        navigate("/forunisseur"); 
        break;
      default:
        navigate("/");
    }
  } catch (err) {
    if (err.response?.status === 401) {
      setGeneralError("Email ou mot de passe incorrect.");
    } else {
      setGeneralError("Erreur lors de la connexion. Veuillez réessayer.");
      console.error(err);
    }
  }
};

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm brightness-75"
        style={{ backgroundImage: "url('/images/login.jpg')" }}
      ></div>

      <div className="relative z-10 bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md text-white">
        <h2 className="text-3xl font-bold text-center mb-6">Connexion</h2>

        {generalError && (
          <p className="text-red-300 text-center mb-4">{generalError}</p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Votre email"
              className={`w-full p-3 rounded bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border border-red-500 focus:ring-red-400"
                  : "focus:ring-blue-400"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-300 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Mot de passe */}
          <div className="mb-4">
            <label htmlFor="motDePasse" className="block mb-1 font-medium">
              Mot de passe
            </label>
            <input
              id="motDePasse"
              type="password"
              placeholder="Votre mot de passe"
              className={`w-full p-3 rounded bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 ${
                errors.motDePasse
                  ? "border border-red-500 focus:ring-red-400"
                  : "focus:ring-blue-400"
              }`}
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
            />
            {errors.motDePasse && (
              <p className="text-red-300 text-sm mt-1">{errors.motDePasse}</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={!email || !motDePasse}
            className={`w-full py-2 mt-2 rounded text-white font-semibold transition ${
              email && motDePasse
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            Se connecter
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-200 hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </div>
      </div>
    </div>
  );
}