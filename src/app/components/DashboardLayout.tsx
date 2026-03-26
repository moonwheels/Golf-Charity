import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  Target,
  Trophy,
  Heart,
  CreditCard,
  User,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Logo } from "./Logo";

const SIDEBAR_ITEMS = [
  { path: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { path: "/dashboard/scores", label: "Scores", icon: Target },
  { path: "/dashboard/draws", label: "Draws", icon: Trophy },
  { path: "/dashboard/charity", label: "Charity", icon: Heart },
  { path: "/dashboard/subscription", label: "Subscription", icon: CreditCard },
  { path: "/dashboard/profile", label: "Profile", icon: User },
];

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, user, profile } = useAuth();

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }

    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || "GolfGive Member";
  const initials = displayName
    ? String(displayName)
        .split(" ")
        .map((part: string) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "GG";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-30">
        <div className="p-6 border-b border-gray-100">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <Logo className="w-9 h-9" />
            <span className="font-extrabold text-xl tracking-tight">
              <span className="text-[#145A41]">Golf</span>
              <span className="text-[#D4AF37]">Give</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  active
                    ? "bg-[#145A41] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-[#FFD95A]" : "text-gray-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => void handleLogout()}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </aside>

      {sidebarOpen ? (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col z-50">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <Link to="/dashboard" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
                <Logo className="w-9 h-9" />
                <span className="font-extrabold text-xl tracking-tight">
                  <span className="text-[#145A41]">Golf</span>
                  <span className="text-[#D4AF37]">Give</span>
                </span>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
              {SIDEBAR_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path, item.exact);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                      active
                        ? "bg-[#145A41] text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? "text-[#FFD95A]" : "text-gray-400"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => void handleLogout()}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all w-full"
              >
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </div>
          </aside>
        </div>
      ) : null}

      <div className="flex-1 md:ml-64 lg:ml-72 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-gray-600 hover:text-gray-900 p-1"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:block text-sm font-bold text-gray-400 uppercase tracking-wider">
              Dashboard
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-gray-900">
                  {displayName}
                </p>
                <p className="text-xs font-medium text-gray-500">{user?.email}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#145A41] to-[#0B3D2E] flex items-center justify-center text-white text-sm font-bold">
                {initials}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
