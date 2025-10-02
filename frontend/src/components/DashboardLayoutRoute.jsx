import React from "react";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";

export default function DashboardLayoutRoute({ children, allowedRoles }) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}
