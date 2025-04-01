
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import React, { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireTeam?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireTeam = false }) => {
  const { isAuthenticated } = useAuth();
  const selectedTeam = localStorage.getItem("selectedTeam");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireTeam && !selectedTeam) {
    return <Navigate to="/team-selection" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
