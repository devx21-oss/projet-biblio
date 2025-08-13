import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Bell, AlertCircle, Info, CheckCircle } from "lucide-react";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/notifications/me');

        setNotifications(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des notifications");
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "alerte":
        return <AlertCircle className="text-red-500" />;
      case "info":
        return <Info className="text-blue-500" />;
      case "succès":
        return <CheckCircle className="text-green-500" />;
      default:
        return <Bell className="text-gray-500" />;
    }
  };

  if (loading) return <div className="text-center py-6">Chargement...</div>;
  if (error) return <div className="text-red-500 text-center py-6">{error}</div>;

  if (notifications.length === 0) {
    return <div className="text-center py-6 text-gray-500">Aucune notification</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Mes Notifications</h2>
      <div className="bg-white shadow-md rounded-xl divide-y">
        {notifications.map((notif) => (
          <div key={notif._id} className="flex items-start gap-3 p-4 hover:bg-gray-50 transition">
            <div className="mt-1">{getIcon(notif.typeNotification)}</div>
            <div className="flex-1">
              <p className="font-medium">
                {notif.utilisateur?.nom} {notif.utilisateur?.prenom}
              </p>
              <p className="text-gray-700">{notif.message || notif.contenu || "Pas de message"}</p>
              <p className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleString()}</p>
              {notif.lienEntite && (
                <a
                  href={`/details/${notif.typeEntite?.toLowerCase()}/${notif.lienEntite._id || notif.lienEntite}`}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Voir les détails
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
