import { useState, useCallback, useRef, useEffect } from "react";
import { api } from "../api/axios";
import Field from "../components/Field";

export default function Register() {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    role: "etudiant",
    filiere: "",
    niveauEtude: "",
    photo: null,
  });

  const [preview, setPreview] = useState("/default-avatar.png");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  // Options pour les listes déroulantes
  const filiereOptions = [
    "Informatique",
    "Mathématiques",
    "Physique",
    "Chimie",
    "Biologie",
    "Économie",
    "Droit",
    "Lettres",
    "Histoire",
    "Génie Civil",
    "Médecine",
    "Pharmacie"
  ];

  const niveauOptions = [
    "Licence 1",
    "Licence 2",
    "Licence 3",
    "Master 1",
    "Master 2",
    "Doctorat"
  ];

  // Calcul de la force du mot de passe
  const calculatePasswordStrength = useCallback((password) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    if (password.length >= 12) strength += 20;
    return Math.min(strength, 100);
  }, []);

  // Gestion des changements de formulaire
  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;
    
    if (name === "photo" && files.length > 0) {
      const file = files[0];
      // Validation du fichier
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, photo: "Veuillez sélectionner une image valide" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: "L'image ne doit pas dépasser 5MB" }));
        return;
      }
      
      setForm((prev) => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, photo: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      
      // Effacer l'erreur du champ lorsqu'il est modifié
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: "" }));
      }
      
      // Calculer la force du mot de passe en temps réel
      if (name === "motDePasse") {
        setPasswordStrength(calculatePasswordStrength(value));
      }
    }
  }, [errors, calculatePasswordStrength]);

  // Validation du formulaire
  const validate = useCallback(() => {
    const newErrors = {};
    
    if (!form.nom.trim()) newErrors.nom = "Nom est requis";
    else if (form.nom.trim().length < 2) newErrors.nom = "Le nom doit contenir au moins 2 caractères";
    
    if (!form.prenom.trim()) newErrors.prenom = "Prénom est requis";
    else if (form.prenom.trim().length < 2) newErrors.prenom = "Le prénom doit contenir au moins 2 caractères";
    
    if (!form.email.trim()) newErrors.email = "Email est requis";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email invalide";
    
    if (!form.motDePasse) newErrors.motDePasse = "Mot de passe est requis";
    else if (form.motDePasse.length < 8) newErrors.motDePasse = "Mot de passe doit avoir au moins 8 caractères";
    
    if (form.role !== "etudiant") newErrors.role = "Seuls les étudiants peuvent s'inscrire.";
    
    if (!form.filiere.trim()) newErrors.filiere = "Filière est requise";
    
    if (!form.niveauEtude.trim()) newErrors.niveauEtude = "Niveau d'étude est requis";
    
    if (!acceptedTerms) newErrors.terms = "Vous devez accepter les conditions d'utilisation";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form, acceptedTerms]);

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    
    if (!validate()) {
      // Faire défiler jusqu'au premier champ avec erreur
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });

      await api.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000 // 30 secondes timeout
      });

      setSuccessMsg("✅ Inscription réussie ! Vous allez être redirigé.");
      setForm({
        nom: "",
        prenom: "",
        email: "",
        motDePasse: "",
        role: "etudiant",
        filiere: "",
        niveauEtude: "",
        photo: null,
      });
      setPreview("/default-avatar.png");
      setErrors({});
      setPasswordStrength(0);
      
      // Réinitialiser l'input fichier
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Redirection après succès
      setTimeout(() => {
        // Ici vous pouvez rediriger vers la page de connexion ou tableau de bord
        // window.location.href = '/login';
      }, 3000);
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      let errorMessage = "Erreur lors de l'inscription";
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = "La requête a pris trop de temps. Veuillez réessayer.";
      } else if (error.response?.status === 409) {
        errorMessage = "Un compte avec cet email existe déjà.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setErrors({ api: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Gestion de la connexion sociale
  const handleSocialLogin = (provider) => {
    // Simulation de connexion sociale
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setErrors({ api: `Fonctionnalité ${provider} en cours de développement` });
    }, 1000);
  };

  // Effet de nettoyage pour l'URL de prévisualisation
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Fonction pour glisser-déposer une image
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const event = { target: { name: "photo", files: [file] } };
      handleChange(event);
    }
  };

  // Fonction pour empêcher le comportement par défaut du drag
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      {/* Left Image */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center rounded-l-lg shadow-lg"
        style={{ backgroundImage: "url('/images/registre.jpg')" }}
        aria-label="Étudiants heureux sur un campus universitaire"
      >
        <div className="bg-black bg-opacity-30 flex items-center justify-center w-full rounded-l-lg">
          <div className="text-center p-8">
            <h1 className="text-white text-4xl font-extrabold mb-6 drop-shadow-lg">
              Rejoignez-nous et commencez votre aventure aujourd'hui!
            </h1>
            <p className="text-indigo-200 text-lg max-w-md">
              Accédez à toutes les ressources pédagogiques, connectez-vous avec d'autres étudiants et profitez d'une expérience d'apprentissage enrichie.
            </p>
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-10 overflow-y-auto">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 md:p-10 space-y-6"
          encType="multipart/form-data"
          noValidate
        >
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-2 tracking-wide">
              Créer un compte étudiant
            </h2>
            <p className="text-gray-600">Rejoignez notre communauté académique</p>
          </div>

          {errors.api && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 font-semibold text-center">{errors.api}</p>
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600 font-semibold text-center">{successMsg}</p>
              <div className="w-full bg-green-200 rounded-full h-2.5 mt-2">
                <div className="bg-green-600 h-2.5 rounded-full animate-progress"></div>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <Field
              name="nom"
              label="Nom"
              value={form.nom}
              onChange={handleChange}
              error={errors.nom}
              className="flex-1"
              aria-invalid={!!errors.nom}
              required
              autoComplete="family-name"
            />
            <Field
              name="prenom"
              label="Prénom"
              value={form.prenom}
              onChange={handleChange}
              error={errors.prenom}
              className="flex-1"
              aria-invalid={!!errors.prenom}
              required
              autoComplete="given-name"
            />
          </div>

          <Field
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            aria-invalid={!!errors.email}
            required
            autoComplete="email"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />

          <div className="space-y-2">
            <div className="relative">
              <Field
                name="motDePasse"
                label="Mot de passe"
                type={showPassword ? "text" : "password"}
                value={form.motDePasse}
                onChange={handleChange}
                error={errors.motDePasse}
                autoComplete="new-password"
                aria-invalid={!!errors.motDePasse}
                required
                icon={
                  <button 
                    type="button" 
                    className="text-gray-400 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                }
              />
            </div>
            
            {form.motDePasse && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-500">Force du mot de passe</span>
                  <span className="text-xs font-medium">
                    {passwordStrength < 40 ? 'Faible' : passwordStrength < 70 ? 'Moyen' : 'Fort'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      passwordStrength < 40 ? 'bg-red-500' : 
                      passwordStrength < 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`} 
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
                <ul className="text-xs text-gray-500 mt-2 space-y-1">
                  <li className={form.motDePasse.length >= 8 ? "text-green-500" : ""}>
                    • Au moins 8 caractères
                  </li>
                  <li className={/[A-Z]/.test(form.motDePasse) ? "text-green-500" : ""}>
                    • Une lettre majuscule
                  </li>
                  <li className={/[0-9]/.test(form.motDePasse) ? "text-green-500" : ""}>
                    • Un chiffre
                  </li>
                  <li className={/[^A-Za-z0-9]/.test(form.motDePasse) ? "text-green-500" : ""}>
                    • Un caractère spécial
                  </li>
                </ul>
              </div>
            )}
          </div>

          <input type="hidden" name="role" value="etudiant" />

          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Niveau d'étude <span className="text-red-500">*</span>
              </label>
              <select
                name="niveauEtude"
                value={form.niveauEtude}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition ${
                  errors.niveauEtude ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={!!errors.niveauEtude}
                required
              >
                <option value="">Sélectionnez un niveau</option>
                {niveauOptions.map((niveau) => (
                  <option key={niveau} value={niveau}>{niveau}</option>
                ))}
              </select>
              {errors.niveauEtude && (
                <p className="mt-1 text-sm text-red-600">{errors.niveauEtude}</p>
              )}
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filière <span className="text-red-500">*</span>
              </label>
              <select
                name="filiere"
                value={form.filiere}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition ${
                  errors.filiere ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={!!errors.filiere}
                required
              >
                <option value="">Sélectionnez une filière</option>
                {filiereOptions.map((filiere) => (
                  <option key={filiere} value={filiere}>{filiere}</option>
                ))}
              </select>
              {errors.filiere && (
                <p className="mt-1 text-sm text-red-600">{errors.filiere}</p>
              )}
            </div>
          </div>

          {/* Photo Upload avec drag and drop */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo de profil (optionnel)
            </label>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                errors.photo ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-indigo-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                ref={fileInputRef}
                className="hidden"
                aria-describedby="photo-help"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                Glissez-déposez votre photo ici ou <span className="text-indigo-600 font-medium">cliquez pour parcourir</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG jusqu'à 5MB</p>
            </div>
            {errors.photo && (
              <p className="mt-1 text-sm text-red-600">{errors.photo}</p>
            )}
            
            {preview && (
              <div className="mt-4 flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={preview}
                    alt="Aperçu de la photo de profil"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreview("/default-avatar.png");
                      setForm(prev => ({ ...prev, photo: null }));
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    aria-label="Supprimer la photo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <span className="text-sm text-gray-600">Aperçu de votre photo de profil</span>
              </div>
            )}
          </div>

          {/* Conditions d'utilisation */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={() => setAcceptedTerms(!acceptedTerms)}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                aria-invalid={!!errors.terms}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700">
                J'accepte les <a href="/terms" className="text-indigo-600 hover:text-indigo-500">conditions d'utilisation</a> et la <a href="/privacy" className="text-indigo-600 hover:text-indigo-500">politique de confidentialité</a>
              </label>
              {errors.terms && (
                <p className="mt-1 text-red-600">{errors.terms}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-4 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Inscription en cours...
              </span>
            ) : (
              "Créer mon compte"
            )}
          </button>

          <div className="text-center text-sm text-gray-600">
            Déjà inscrit? <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Se connecter</a>
          </div>

          {/* Séparateur */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" width="24" height="24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('microsoft')}
              className="inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 23 23" width="23" height="23">
                <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                <path fill="#f1511b" d="M1 1h10v10H1z"/>
                <path fill="#80cc28" d="M12 1h10v10H12z"/>
                <path fill="#00adef" d="M1 12h10v10H1z"/>
                <path fill="#fbca00" d="M12 12h10v10H12z"/>
              </svg>
              Microsoft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}