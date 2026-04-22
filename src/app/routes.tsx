import { createBrowserRouter } from "react-router";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { PublicOnlyRoute } from "../components/auth/PublicOnlyRoute";
import { PublicLayout } from "./components/PublicLayout";
import { DashboardLayout } from "./components/DashboardLayout";
import { AdminLayout } from "./components/AdminLayout";
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import { NotFound } from "./pages/NotFound";

// Public pages
import { Pricing } from "./pages/Pricing";
import { Impact } from "./pages/Impact";
import { Rewards } from "./pages/Rewards";

// Dashboard pages
import { Overview } from "./pages/dashboard/Overview";
import { DashboardScores } from "./pages/dashboard/DashboardScores";
import { Draws } from "./pages/dashboard/Draws";
import { Charity } from "./pages/dashboard/Charity";
import { Subscription } from "./pages/dashboard/Subscription";
import { DashboardProfile } from "./pages/dashboard/DashboardProfile";

// Admin pages
import { Analytics } from "./pages/admin/Analytics";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { DrawManagement } from "./pages/admin/DrawManagement";
import { AdminCharities } from "./pages/admin/AdminCharities";
import { Winners } from "./pages/admin/Winners";
import { AdminScores } from "./pages/admin/AdminScores";

function ProtectedDashboard() {
  return (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  );
}

function ProtectedAdmin() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout />
    </ProtectedRoute>
  );
}

function ProtectedSubscribedScores() {
  return (
    <ProtectedRoute requireActiveSubscription>
      <DashboardScores />
    </ProtectedRoute>
  );
}

function ProtectedSubscribedDraws() {
  return (
    <ProtectedRoute requireActiveSubscription>
      <Draws />
    </ProtectedRoute>
  );
}

function ProtectedSubscribedCharity() {
  return (
    <ProtectedRoute requireActiveSubscription>
      <Charity />
    </ProtectedRoute>
  );
}

function PublicAuthPage() {
  return (
    <PublicOnlyRoute>
      <Auth />
    </PublicOnlyRoute>
  );
}

export const router = createBrowserRouter([
  {
    Component: PublicLayout,
    children: [
      { path: "/", Component: Home },
      { path: "/pricing", Component: Pricing },
      { path: "/impact", Component: Impact },
      { path: "/rewards", Component: Rewards },
    ],
  },
  {
    path: "/auth",
    Component: PublicAuthPage,
  },
  {
    path: "/dashboard",
    Component: ProtectedDashboard,
    children: [
      { index: true, Component: Overview },
      { path: "scores", Component: ProtectedSubscribedScores },
      { path: "draws", Component: ProtectedSubscribedDraws },
      { path: "charity", Component: ProtectedSubscribedCharity },
      { path: "subscription", Component: Subscription },
      { path: "profile", Component: DashboardProfile },
    ],
  },
  {
    path: "/admin",
    Component: ProtectedAdmin,
    children: [
      { index: true, Component: Analytics },
      { path: "users", Component: AdminUsers },
      { path: "scores", Component: AdminScores },
      { path: "draws", Component: DrawManagement },
      { path: "charities", Component: AdminCharities },
      { path: "winners", Component: Winners },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
