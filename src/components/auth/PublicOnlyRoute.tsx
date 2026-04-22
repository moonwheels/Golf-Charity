import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated, defaultAuthenticatedPath } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-[#145A41]" />
          <span className="text-sm font-semibold text-gray-600">
            Restoring your session...
          </span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={defaultAuthenticatedPath} replace />;
  }

  return <>{children}</>;
}
