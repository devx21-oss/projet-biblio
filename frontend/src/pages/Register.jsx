import { useState } from "react";
import { api } from "../api/axios";
import Field from "../components/Field"; // تأكد من مسار المكون

export default function Register() {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    role: "etudiant",
    filiere: "",
    niveauEtude: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nom.trim()) newErrors.nom = "Nom est requis";
    if (!form.prenom.trim()) newErrors.prenom = "Prénom est requis";
    if (!form.email.trim()) newErrors.email = "Email est requis";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email invalide";
    if (!form.motDePasse) newErrors.motDePasse = "Mot de passe est requis";
    else if (form.motDePasse.length < 6) newErrors.motDePasse = "Mot de passe doit avoir au moins 6 caractères";
    if (form.role !== "etudiant") newErrors.role = "Seuls les étudiants peuvent s'inscrire.";
    if (!form.filiere.trim()) newErrors.filiere = "Filière est requise";
    if (!form.niveauEtude.trim()) newErrors.niveauEtude = "Niveau d'étude est requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post("/users/register", form);
      setSuccessMsg("✅ Inscription réussie !");
      setForm({
        nom: "",
        prenom: "",
        email: "",
        motDePasse: "",
        role: "etudiant",
        filiere: "",
        niveauEtude: "",
      });
      setErrors({});
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (error) {
      setErrors({
        api: error.response?.data?.message || "Erreur lors de l'inscription",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      {/* Left Image */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center rounded-l-lg shadow-lg"
        style={{ backgroundImage: "url('/images/registre.jpg')" }}
      >
        <div className="bg-black bg-opacity-30 flex items-center justify-center w-full rounded-l-lg">
          <h1 className="text-white text-4xl font-extrabold p-8 drop-shadow-lg max-w-md text-center">
            Rejoignez-nous et commencez votre aventure aujourd'hui!
          </h1>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-10 space-y-6"
        >
          <h2 className="text-4xl font-bold text-indigo-700 text-center mb-6 tracking-wide">
            Créer un compte étudiant
          </h2>

          {errors.api && (
            <p className="text-red-600 font-semibold text-center">{errors.api}</p>
          )}
          {successMsg && (
            <p className="text-green-600 font-semibold text-center">{successMsg}</p>
          )}

          <div className="flex gap-6">
            <Field
              name="nom"
              label="Nom"
              value={form.nom}
              onChange={handleChange}
              error={errors.nom}
              className="flex-1"
            />
            <Field
              name="prenom"
              label="Prénom"
              value={form.prenom}
              onChange={handleChange}
              error={errors.prenom}
              className="flex-1"
            />
          </div>

          <div className="flex gap-6">
            <Field
              name="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              className="flex-1"
            />
            <Field
              name="motDePasse"
              label="Mot de passe"
              type="password"
              value={form.motDePasse}
              onChange={handleChange}
              error={errors.motDePasse}
              className="flex-1"
              autoComplete="new-password"
            />
          </div>

          <input type="hidden" name="role" value="etudiant" />

          <div className="flex gap-6">
            <Field
              name="niveauEtude"
              label="Niveau d'étude"
              value={form.niveauEtude}
              onChange={handleChange}
              error={errors.niveauEtude}
              className="flex-1"
            />
            <Field
              name="filiere"
              label="Filière"
              value={form.filiere}
              onChange={handleChange}
              error={errors.filiere}
              className="flex-1"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-4 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-50"
          >
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </button>

          {/* Social Login (اختياري) */}
          <div className="text-center mt-6">
            <p className="text-gray-600">Ou s'inscrire avec</p>
            <div className="flex justify-center mt-4 space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Facebook
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                Google
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
