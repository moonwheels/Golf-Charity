import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated, role } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to={role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return <>{children}</>;
}
