// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'; 

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role;

    // normalize allowedRoles
    const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (allowed.length > 0 && !allowed.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  } catch (err) {
    return <Navigate to="/login" replace />;
  }
}
