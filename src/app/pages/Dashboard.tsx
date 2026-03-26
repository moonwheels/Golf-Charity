import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import { Navigation } from "../components/Navigation";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { 
  Wallet, 
  Heart, 
  Clock, 
  CheckCircle2, 
  CreditCard, 
  Ticket, 
  ArrowUpRight, 
  Activity,
  Download,
  Plus
} from "lucide-react";
import { useState } from "react";

export function Dashboard() {
  const [selectedCharity, setSelectedCharity] = useState("education");

  const winnings = [
    { id: 1, draw: "March 2026 Draw", date: "Mar 30, 2026", amount: "$500 Pro Shop Credit", status: "Pending" },
    { id: 2, draw: "February 2026 Draw", date: "Feb 28, 2026", amount: "Dozen Premium Balls", status: "Paid" },
    { id: 3, draw: "December 2025 Draw", date: "Dec 30, 2025", amount: "$150 Gift Card", status: "Paid" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navigation />

      <div className="pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Section */}
          <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
                Overview
              </h1>
              <p className="text-lg text-gray-500 font-medium">
                Manage your scores, subscriptions, and rewards.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/profile">
                <Button variant="outline" className="bg-white border-gray-200 text-gray-700 shadow-sm rounded-xl font-bold">
                  Profile Settings
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Key Metrics Row */}
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="p-6 border-0 shadow-sm rounded-3xl bg-white">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active</span>
              </div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Subscription</div>
              <div className="text-2xl font-black text-gray-900">Premium</div>
            </Card>

            <Card className="p-6 border-0 shadow-sm rounded-3xl bg-white">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-[#145A41]/10 flex items-center justify-center text-[#145A41]">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Winnings</div>
              <div className="text-2xl font-black text-gray-900">$1,250<span className="text-lg text-gray-400 font-bold">.00</span></div>
            </Card>

            <Card className="p-6 border-0 shadow-sm rounded-3xl bg-white">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-[#FFD95A]/20 flex items-center justify-center text-[#D4AF37]">
                  <Heart className="w-5 h-5" />
                </div>
              </div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Contributed</div>
              <div className="text-2xl font-black text-gray-900">$340<span className="text-lg text-gray-400 font-bold">.00</span></div>
            </Card>

            <Card className="p-6 border-0 shadow-sm rounded-3xl bg-white">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Ticket className="w-5 h-5" />
                </div>
              </div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Draws Entered</div>
              <div className="text-2xl font-black text-gray-900">24</div>
            </Card>
          </motion.div>

          {/* Main Grid Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column (Main Content) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Score Management Section */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Card className="p-8 border-0 shadow-sm rounded-3xl bg-white">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Recent Scores</h2>
                      <p className="text-gray-500 font-medium text-sm mt-1">Your latest registered rounds</p>
                    </div>
                    <Link to="/scores">
                      <Button className="bg-[#145A41] hover:bg-[#0B3A2B] text-white font-bold rounded-xl shadow-md hidden sm:flex">
                        <Plus className="mr-2 w-4 h-4" /> Add Score
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {[
                      { id: "1", date: "2026-03-24", score: "36" },
                      { id: "2", date: "2026-03-20", score: "34" },
                      { id: "3", date: "2026-03-15", score: "38" },
                    ].map((s, i) => (
                      <div key={s.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                            {i + 1}
                          </div>
                          <div className="font-semibold text-gray-700">
                            {new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                        <div className="text-xl font-extrabold text-[#145A41]">
                          {s.score} <span className="text-sm font-medium text-gray-400 ml-1">pts</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link to="/scores" className="sm:hidden">
                    <Button className="w-full bg-[#145A41] hover:bg-[#0B3A2B] text-white font-bold rounded-xl shadow-md h-12">
                      <Plus className="mr-2 w-4 h-4" /> Add Score
                    </Button>
                  </Link>
                </Card>
              </motion.div>

              {/* Winnings Overview */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Card className="p-8 border-0 shadow-sm rounded-3xl bg-white">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Winnings Overview</h2>
                      <p className="text-gray-500 font-medium text-sm mt-1">Your recent rewards and payment status</p>
                    </div>
                    <Link to="/rewards">
                      <Button variant="outline" className="border-gray-200 text-gray-700 font-bold rounded-xl hidden sm:flex">
                        View Details <ArrowUpRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {winnings.map((winning) => (
                      <div 
                        key={winning.id} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-gray-50/50 group"
                      >
                        <div className="flex items-center gap-4 mb-4 sm:mb-0">
                          <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#145A41] group-hover:scale-105 transition-transform">
                            <Wallet className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-lg">{winning.draw}</div>
                            <div className="text-sm font-medium text-gray-500">{winning.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center">
                          <div className="font-extrabold text-gray-900 text-lg">{winning.amount}</div>
                          <div className={`text-xs font-bold px-3 py-1 rounded-lg mt-1 inline-flex items-center ${
                            winning.status === 'Paid' 
                              ? 'bg-green-100 text-green-700 border border-green-200' 
                              : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                          }`}>
                            {winning.status === 'Paid' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {winning.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                            {winning.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Right Column (Sidebar) */}
            <div className="space-y-8">
              
              {/* Subscription Details */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Card className="p-6 border-0 shadow-sm rounded-3xl bg-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#145A41]" />
                    Subscription
                  </h3>
                  
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Status</span>
                      <span className="flex items-center gap-1 text-sm font-bold text-green-600">
                        <Activity className="w-4 h-4" /> Active
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Plan</span>
                      <span className="text-base font-bold text-gray-900">Premium Tier</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Next Renewal</div>
                      <div className="text-lg font-bold text-gray-900">April 30, 2026</div>
                      <div className="text-sm font-medium text-gray-500 mt-1">$50.00 / month</div>
                    </div>
                  </div>

                  <Link to="/pricing">
                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl h-12">
                      Manage Billing
                    </Button>
                  </Link>
                </Card>
              </motion.div>

              {/* Charity Section */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Card className="p-6 bg-gradient-to-br from-[#145A41] to-[#0B3D2E] text-white rounded-3xl shadow-lg border-0 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Heart className="w-24 h-24" />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-[#FFD95A]" />
                      Charity Preferences
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2 block">
                          Selected Cause
                        </label>
                        <Select value={selectedCharity} onValueChange={setSelectedCharity}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white focus:ring-[#FFD95A] rounded-xl h-12 font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="education">Children's Education Fund</SelectItem>
                            <SelectItem value="healthcare">Healthcare for All</SelectItem>
                            <SelectItem value="food">Community Food Program</SelectItem>
                            <SelectItem value="environment">Green Earth Initiative</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 mb-4">
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Contribution Rate</span>
                          <span className="text-2xl font-black text-[#FFD95A]">15%</span>
                        </div>
                        <div className="text-sm font-medium text-white/80">
                          of your monthly subscription is donated directly to your selected cause.
                        </div>
                      </div>

                      <Link to="/impact">
                        <Button className="w-full bg-white text-[#145A41] hover:bg-gray-100 font-bold rounded-xl h-10 mt-2">
                          Change Charity
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Participation Summary */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <Card className="p-6 border-0 shadow-sm rounded-3xl bg-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-[#145A41]" />
                    Participation
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div>
                        <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Draws Entered</div>
                        <div className="text-2xl font-black text-gray-900">24</div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="p-4 bg-[#FFD95A]/10 rounded-2xl border border-[#FFD95A]/30">
                      <div className="flex items-center gap-2 text-sm font-bold text-[#145A41]/70 uppercase tracking-wider mb-2">
                        <Clock className="w-4 h-4" /> Upcoming Draw
                      </div>
                      <div className="text-xl font-black text-[#145A41]">April 30, 2026</div>
                      <div className="text-sm font-medium text-[#145A41]/80 mt-1">
                        Your latest 5 scores are locked in!
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
