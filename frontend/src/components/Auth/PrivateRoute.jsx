import React from "react";
import { Navigate } from "react-router-dom";

// allowedRoles: array of allowed roles, e.g. ['admin'] or ['student']
const PrivateRoute = ({ allowedRoles, children }) => {
  const role = localStorage.getItem("role");
  if (!role || (allowedRoles && !allowedRoles.includes(role))) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default PrivateRoute;
