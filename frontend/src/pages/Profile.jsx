import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Configuration axios pour les requêtes API
const API_BASE_URL = "http://localhost:5000/api";
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Hook personnalisé pour la gestion des appels API
const useApi = () => {
  const execute = useCallback(async (config) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance({
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        },
      });
      return { data: response.data, error: null };
    } catch (error) {
      console.error("API Error:", error);
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || "Une erreur est survenue" 
      };
    }
  }, []);

  return { execute };
};

// Composant de chargement personnalisé
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
  </div>
);

// Composant réutilisable pour les champs de formulaire avec validation
const Field = React.memo(({ 
  label, 
  name, 
  value, 
  onChange, 
  type = "text", 
  placeholder = "", 
  disabled = false,
  error = null 
}) => {
  const id = useRef(`field-${name}-${Math.random().toString(36).substr(2, 9)}`);
  
  return (
    <div className="mb-4">
      <label 
        htmlFor={id.current} 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id={id.current}
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
          disabled ? "bg-gray-100 text-gray-500" : "bg-white"
        } ${error ? "border-red-500" : "border-gray-300"}`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id.current}-error` : undefined}
      />
      {error && (
        <p id={`${id.current}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

Field.displayName = "Field";

// Composant pour l'upload de photo
const PhotoUpload = React.memo(({ previewUrl, onFileChange, existingPhoto }) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      onFileChange({ target: { files: [files[0]] } });
    } else {
      toast.error("Veuillez déposer une image valide.");
    }
  }, [onFileChange]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="flex flex-col items-center mb-6">
      <div 
        className={`relative w-32 h-32 rounded-full overflow-hidden border-2 ${
          dragOver ? "border-indigo-500" : "border-gray-300"
        } transition-colors duration-200 cursor-pointer group`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        aria-label="Changer la photo de profil"
        tabIndex={0}
      >
        <img
          src={previewUrl}
          alt="Photo de profil"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        name="photo"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
        aria-hidden="true"
      />
      
      <button
        type="button"
        onClick={handleClick}
        className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
      >
        Changer la photo
      </button>
      
      <p className="mt-1 text-xs text-gray-500 text-center">
        Glissez-déposez une image ou cliquez pour télécharger
      </p>
    </div>
  );
});

PhotoUpload.displayName = "PhotoUpload";

// Configuration des champs par rôle
const getRoleSpecificFields = (role) => {
  const fieldsConfig = {
    etudiant: [
      { name: "numeroEtudiant", label: "Numéro étudiant", type: "text" },
      { name: "filiere", label: "Filière", type: "text" },
      { name: "niveauEtude", label: "Niveau d'étude", type: "text" },
    ],
    employe: [
      { name: "matricule", label: "Matricule", type: "text" },
      { name: "departement", label: "Département", type: "text" },
      { name: "roleEmploye", label: "Rôle Employé", type: "text" },
    ],
    supplier: [
      { name: "nomEntreprise", label: "Nom Entreprise", type: "text" },
      { name: "siret", label: "SIRET", type: "text" },
      { name: "adresseEntreprise", label: "Adresse Entreprise", type: "text" },
      { name: "contactPrincipal", label: "Contact Principal", type: "text" },
    ],
  };

  return fieldsConfig[role] || [];
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const { execute: apiExecute } = useApi();

  // Validation simple des champs
  const validateField = useCallback((name, value) => {
    const validations = {
      email: (val) => {
        if (!val) return "L'email est requis";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) return "Format d'email invalide";
        return null;
      },
      nom: (val) => !val ? "Le nom est requis" : null,
      prenom: (val) => !val ? "Le prénom est requis" : null,
      motDePasse: (val) => {
        if (val && val.length < 6) return "Le mot de passe doit contenir au moins 6 caractères";
        return null;
      },
    };

    return validations[name] ? validations[name](value) : null;
  }, []);

  // Chargement du profil
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const { data, error } = await apiExecute({
      url: "/users/me",
      method: "GET",
    });

    if (error) {
      toast.error(error);
    } else if (data) {
      setUser(data);
      setFormData(data);
    }
    setLoading(false);
  }, [apiExecute]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchProfile();
    } else {
      toast.error("Token d'authentification manquant");
      setLoading(false);
    }
  }, [fetchProfile]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validation en temps réel après que l'utilisateur a modifié le champ
    if (touchedFields[name]) {
      const error = validateField(name, value);
      setFormErrors((prev) => ({ ...prev, [name]: error }));
    }
  }, [touchedFields, validateField]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    
    // Marquer le champ comme "touché" et valider
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  }, [validateField]);

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validation du type et de la taille du fichier
      if (!selectedFile.type.startsWith('image/')) {
        toast.error("Veuillez sélectionner une image valide (JPEG, PNG, etc.).");
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB max
        toast.error("L'image ne doit pas dépasser 5 Mo.");
        return;
      }
      
      setFile(selectedFile);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Valider tous les champs avant soumission
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== "motDePasse" || formData[key]) { // Valider le mot de passe seulement s'il est fourni
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });
    
    setFormErrors(newErrors);
    setTouchedFields(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    if (Object.keys(newErrors).length > 0) {
      toast.error("Veuillez corriger les erreurs dans le formulaire.");
      setIsSubmitting(false);
      return;
    }

    try {
      const data = new FormData();

      // Ajouter tous les champs sauf motDePasse vide
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (key === "motDePasse" && !formData[key]) return;
          data.append(key, formData[key]);
        }
      });

      if (file) data.append("photo", file);

      const { data: responseData, error } = await apiExecute({
        url: "/users/me",
        method: "PUT",
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (error) {
        toast.error(error);
      } else {
        setUser(responseData.user);
        setFile(null);
        toast.success("✅ Profil mis à jour avec succès !");
      }
    } catch (error) {
      console.error("❌ Erreur update:", error);
      toast.error("Une erreur inattendue s'est produite.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const photoUrl = useMemo(() => {
    if (user?.photo && user.photo !== "default.png") {
      return `${API_BASE_URL.replace('/api', '')}/uploads/${user.photo}?${new Date().getTime()}`;
    }
    return "/default-avatar.png";
  }, [user]);

  const previewUrl = useMemo(() => {
    return file ? URL.createObjectURL(file) : photoUrl;
  }, [file, photoUrl]);

  // Nettoyer l'URL de prévisualisation
  useEffect(() => {
    return () => {
      if (file) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [file, previewUrl]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6 mt-8 mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Mon Profil</h2>

      {user && (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <PhotoUpload 
            previewUrl={previewUrl} 
            onFileChange={handleFileChange} 
            existingPhoto={user.photo}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Nom"
              name="nom"
              value={formData.nom || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              error={formErrors.nom}
            />

            <Field
              label="Prénom"
              name="prenom"
              value={formData.prenom || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              error={formErrors.prenom}
            />
          </div>

          <Field
            label="Email"
            name="email"
            type="email"
            value={formData.email || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled
            error={formErrors.email}
          />

          <Field
            label="Mot de passe (nouveau)"
            name="motDePasse"
            type="password"
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Laisser vide pour ne pas changer"
            error={formErrors.motDePasse}
          />

          {/* Champs spécifiques au rôle */}
          {getRoleSpecificFields(user.role).map((field) => (
            <Field
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type}
              value={formData[field.name] || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              error={formErrors[field.name]}
            />
          ))}

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={fetchProfile}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isSubmitting && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isSubmitting ? 'Enregistrement...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      )}

      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}