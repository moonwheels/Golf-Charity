import { Outlet, Link } from "react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Logo } from "./Logo";

export function PublicLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'linear-gradient(135deg, #0B3D2E 0%, #145A41 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <Logo className="w-8 h-8 sm:w-10 sm:h-10 group-hover:scale-110 transition-transform" />
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight">
                <span className="text-white">Golf</span>
                <span className="text-[#FFD95A]">Give</span>
              </span>
            </Link>

            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-white hover:text-[#FFD95A] transition-colors text-sm lg:text-base">
                Home
              </Link>
              <Link to="/impact" className="text-white hover:text-[#FFD95A] transition-colors text-sm lg:text-base">
                Impact
              </Link>
              <Link to="/pricing" className="text-white hover:text-[#FFD95A] transition-colors text-sm lg:text-base">
                Pricing
              </Link>
              <Link to="/rewards" className="text-white hover:text-[#FFD95A] transition-colors text-sm lg:text-base">
                Rewards
              </Link>
              <div className="flex items-center gap-3 border-l border-white/20 pl-6 ml-2">
                <Link to="/auth" className="text-white hover:text-[#FFD95A] transition-colors text-sm lg:text-base font-bold">
                  Log In
                </Link>
                <Link to="/auth">
                  <Button
                    size="sm"
                    className="bg-[#FFD95A] text-[#0B3D2E] hover:bg-[#F4C430] font-bold shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
                    style={{ boxShadow: '0 4px 14px 0 rgba(255, 217, 90, 0.39)' }}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {isOpen && (
            <div className="md:hidden py-4 space-y-3 border-t border-white/10 mt-2">
              <Link to="/" className="block text-white hover:text-[#FFD95A] transition-colors py-2" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/impact" className="block text-white hover:text-[#FFD95A] transition-colors py-2" onClick={() => setIsOpen(false)}>Impact</Link>
              <Link to="/pricing" className="block text-white hover:text-[#FFD95A] transition-colors py-2" onClick={() => setIsOpen(false)}>Pricing</Link>
              <Link to="/rewards" className="block text-white hover:text-[#FFD95A] transition-colors py-2" onClick={() => setIsOpen(false)}>Rewards</Link>
              <div className="pt-2 flex flex-col gap-2">
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full font-bold border-white/20 text-white hover:bg-white/10">Log In</Button>
                </Link>
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button size="sm" className="bg-[#FFD95A] text-[#145A41] hover:bg-[#F4C430] font-bold w-full shadow-lg">Get Started</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
