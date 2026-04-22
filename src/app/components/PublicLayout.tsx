import { Outlet, Link } from "react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Logo } from "./Logo";
import { AuthModal } from "./auth/AuthModal";

export function PublicLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <AuthModal />
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B3D2E]/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.15)] border-b border-white/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 lg:py-5">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <Logo className="w-10 h-10 sm:w-12 sm:h-12 group-hover:scale-110 transition-transform" />
              <span className="font-extrabold text-2xl sm:text-3xl tracking-tight">
                <span className="text-white">Golf</span>
                <span className="text-[#FFD95A]">Give</span>
              </span>
            </Link>

            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-white hover:text-[#FFD95A] transition-colors text-base lg:text-lg font-medium">
                Home
              </Link>
              <Link to="/impact" className="text-white hover:text-[#FFD95A] transition-colors text-base lg:text-lg font-medium">
                Impact
              </Link>
              <Link to="/pricing" className="text-white hover:text-[#FFD95A] transition-colors text-base lg:text-lg font-medium">
                Pricing
              </Link>
              <Link to="/rewards" className="text-white hover:text-[#FFD95A] transition-colors text-base lg:text-lg font-medium">
                Rewards
              </Link>
              <div className="flex items-center gap-4 border-l border-white/20 pl-8 ml-2">
                <Link to="/?auth=login" className="text-white hover:text-[#FFD95A] transition-colors text-base lg:text-lg font-bold">
                  Log In
                </Link>
                <Link to="/?auth=login">
                  <Button
                    size="default"
                    className="bg-[#FFD95A] text-[#0B3D2E] hover:bg-[#F4C430] font-bold text-base px-6 py-5 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
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
                <Link to="/?auth=login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full font-bold border-white/20 text-white hover:bg-white/10">Log In</Button>
                </Link>
                <Link to="/?auth=login" onClick={() => setIsOpen(false)}>
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
