import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import {
  BarChart3,
  Users,
  Settings,
  Heart,
  Trophy,
  LogOut,
  Menu,
  X,
  Shield,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Logo } from "./Logo";

const ADMIN_ITEMS = [
  { path: "/admin", label: "Analytics", icon: BarChart3, exact: true },
  { path: "/admin/users", label: "Users", icon: Users },
  { path: "/admin/scores", label: "Scores", icon: ClipboardList },
  { path: "/admin/draws", label: "Draw Management", icon: Settings },
  { path: "/admin/charities", label: "Charities", icon: Heart },
  { path: "/admin/winners", label: "Winners", icon: Trophy },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, user, profile } = useAuth();

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }

    return location.pathname === path;
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || "Admin";
  const initials = displayName
    ? String(displayName)
        .split(" ")
        .map((part: string) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "AD";

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-gray-800">
        <Link to="/admin" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
          <Logo className="w-9 h-9" />
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white block leading-tight">
              Golf<span className="text-[#FFD95A]">Give</span>
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
              <Shield className="w-3 h-3" /> Admin Portal
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {ADMIN_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path, item.exact);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                active
                  ? "bg-[#FFD95A] text-[#0B3D2E] shadow-md"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "text-[#0B3D2E]" : ""}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => void handleLogout()}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#0B1A14] fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {sidebarOpen ? (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#0B1A14] shadow-2xl flex flex-col z-50">
            <div className="absolute top-4 right-4">
              <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      ) : null}

      <div className="flex-1 md:ml-64 lg:ml-72 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-gray-600 hover:text-gray-900 p-1"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#145A41]" /> Admin Panel
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-gray-900">
                {displayName}
              </p>
              <p className="text-xs font-medium text-gray-500">{user?.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white text-sm font-bold">
              {initials}
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
