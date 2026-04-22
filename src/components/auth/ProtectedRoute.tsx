import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { AlertTriangle, Loader2, LogOut, RefreshCcw } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../app/components/ui/button";

type ProtectedRouteProps = {
  children: ReactNode;
  requireAdmin?: boolean;
  requireActiveSubscription?: boolean;
};

function LoadingState({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-sm">
        <Loader2 className="h-5 w-5 animate-spin text-[#145A41]" />
        <span className="text-sm font-semibold text-gray-600">{message}</span>
      </div>
    </div>
  );
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
  requireActiveSubscription = false,
}: ProtectedRouteProps) {
  const {
    isLoading,
    isAuthenticated,
    isAdmin,
    hasActiveSubscription,
    profile,
    profileError,
    refreshProfile,
    signOut,
  } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingState message="Restoring your session..." />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  if (!profile && profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
        <div className="max-w-lg w-full rounded-3xl bg-white shadow-sm border border-red-100 p-8">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-3">
            We could not load your account profile
          </h1>
          <p className="text-gray-600 font-medium mb-6">{profileError}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => void refreshProfile()}
              className="bg-[#145A41] hover:bg-[#0B3D2E] text-white font-bold"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Retry profile load
            </Button>
            <Button
              variant="outline"
              onClick={() => void signOut()}
              className="font-bold"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <LoadingState message="Loading your account..." />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <Navigate
        to={hasActiveSubscription ? "/dashboard" : "/dashboard/subscription"}
        replace
      />
    );
  }

  if (requireActiveSubscription && !isAdmin && !hasActiveSubscription) {
    return (
      <Navigate
        to="/dashboard/subscription"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <>{children}</>;
}
