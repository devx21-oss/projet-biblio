import React, { useEffect, useState, useRef, useCallback } from "react";
import { api } from "../api/axios";
import { Bell, AlertCircle, Info } from "lucide-react";
import { Link } from "react-router-dom";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const itemsPerPage = 5;

  // Infinite scroll
  const lastNotificationRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) setPage((prev) => prev + 1);
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(
          `/notifications/me?page=${page}&limit=${itemsPerPage}`
        );

        // Normaliser la réponse
        const newNotifications = response.data.notifications || [];
        const totalPages = response.data.totalPages || 1;

        // Empêcher les doublons
        setNotifications((prev) => {
          const merged = [...prev, ...newNotifications];
          return merged.filter(
            (notif, idx, arr) =>
              arr.findIndex((n) => n._id === notif._id) === idx
          );
        });

        setHasMore(page < totalPages);
      } catch (err) {
        setError("Erreur lors du chargement des notifications");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [page]);

  // Choisir l'icône
  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "rappel retour":
        return <AlertCircle className="text-red-500" />;
      case "amende":
        return <AlertCircle className="text-orange-500" />;
      case "réservation disponible":
        return <Info className="text-blue-500" />;
      case "prolongation":
        return <Info className="text-teal-500" />;
      case "général":
        return <Bell className="text-gray-500" />;
      default:
        return <Bell className="text-gray-500" />;
    }
  };

  // Badge par type
  const getBadge = (type) => {
    const base = "px-2 py-0.5 text-xs rounded-full font-medium";
    switch (type?.toLowerCase()) {
      case "amende":
        return <span className={`${base} bg-orange-100 text-orange-700`}>{type}</span>;
      case "rappel retour":
        return <span className={`${base} bg-red-100 text-red-700`}>{type}</span>;
      case "réservation disponible":
        return <span className={`${base} bg-blue-100 text-blue-700`}>{type}</span>;
      case "prolongation":
        return <span className={`${base} bg-teal-100 text-teal-700`}>{type}</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-700`}>{type || "Général"}</span>;
    }
  };

  // UI rendering
  if (notifications.length === 0 && loading)
    return <div className="text-center py-6">Chargement...</div>;

  if (error)
    return (
      <div className="text-center py-6 text-red-500">
        {error}
        <button
          onClick={() => {
            setPage(1);
            setNotifications([]);
          }}
          className="ml-3 text-blue-600 underline"
        >
          Réessayer
        </button>
      </div>
    );

  if (notifications.length === 0)
    return <div className="text-center py-6 text-gray-500">Aucune notification</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Mes Notifications</h2>
      <div className="bg-white shadow-md rounded-xl divide-y">
        {notifications.map((notif, index) => {
          const isLast = index === notifications.length - 1;
          return (
            <div
              key={notif._id}
              ref={isLast ? lastNotificationRef : null}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 hover:bg-gray-50 transition"
            >
              <div className="mt-1">{getIcon(notif.typeNotification)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm sm:text-base">
                    {notif.utilisateur?.nom} {notif.utilisateur?.prenom}
                  </p>
                  {getBadge(notif.typeNotification)}
                </div>
                <p className="text-gray-700 text-sm">
                  {notif.message || notif.contenu || "Pas de message"}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
                {notif.lienEntite && (
                  <Link
                    to={`/details/${notif.typeEntite?.toLowerCase()}/${
                      notif.lienEntite._id || notif.lienEntite
                    }`}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Voir les détails
                  </Link>
                )}
              </div>
            </div>
          );
        })}
        {loading && <div className="text-center py-4 text-gray-500">Chargement...</div>}
        {!hasMore && (
          <div className="text-center py-4 text-gray-400">
            Fin des notifications
          </div>
        )}
      </div>
    </div>
  );
}
