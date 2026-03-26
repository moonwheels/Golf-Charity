import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Navigation } from "../components/Navigation";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";
import { 
  Users, 
  Trophy, 
  Heart, 
  Settings, 
  BarChart3, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Eye,
  Play,
  Upload,
  DollarSign,
  Activity,
  Award
} from "lucide-react";

type TabType = "analytics" | "users" | "draws" | "charities" | "winners";

export function Admin() {
  const [activeTab, setActiveTab] = useState<TabType>("analytics");

  // Mock states for interactivity
  const [winners, setWinners] = useState([
    { id: 1, user: "Alex Thompson", prize: "$500 Pro Shop", tier: "4 Matches", proof: "Pending", payment: "Pending" },
    { id: 2, user: "Sarah Davis", prize: "Pebble Beach Trip", tier: "5 Matches", proof: "Approved", payment: "Pending" },
    { id: 3, user: "Michael Chen", prize: "Premium Balls", tier: "3 Matches", proof: "Approved", payment: "Paid" },
  ]);

  const [simulating, setSimulating] = useState(false);

  const handleApproveProof = (id: number) => {
    setWinners(winners.map(w => w.id === id ? { ...w, proof: "Approved" } : w));
    toast.success("Proof approved successfully");
  };

  const handleMarkPaid = (id: number) => {
    setWinners(winners.map(w => w.id === id ? { ...w, payment: "Paid" } : w));
    toast.success("Payment marked as completed");
  };

  const runSimulation = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      toast.success("Draw simulation completed! 145 projected winners.");
    }, 2000);
  };

  const TABS = [
    { id: "analytics", label: "Overview", icon: BarChart3 },
    { id: "users", label: "User Management", icon: Users },
    { id: "draws", label: "Draw Management", icon: Settings },
    { id: "charities", label: "Charities", icon: Heart },
    { id: "winners", label: "Winner Verification", icon: Trophy },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <div className="pt-20 flex-1 flex flex-col md:flex-row max-w-[1600px] w-full mx-auto">
        
        {/* Admin Sidebar */}
        <aside className="w-full md:w-64 lg:w-72 bg-white border-r border-gray-200 flex-shrink-0 pt-8 px-4 pb-8 flex flex-col md:min-h-[calc(100vh-5rem)] shadow-sm z-10">
          <div className="mb-8 px-4 hidden md:block">
            <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-1">Admin Portal</h2>
            <div className="text-xl font-black text-[#145A41]">Command Center</div>
          </div>

          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all whitespace-nowrap md:whitespace-normal ${
                    isActive 
                      ? "bg-[#145A41] text-white shadow-md" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-[#FFD95A]" : "text-gray-400"}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          
          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Platform Analytics</h1>
                <p className="text-gray-500 font-medium">Real-time overview of platform health and contributions.</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Total Users", value: "4,250", change: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Active Subscriptions", value: "3,890", change: "+8%", icon: Activity, color: "text-green-600", bg: "bg-green-50" },
                  { label: "Total Prize Pool", value: "$45,000", change: "Next Draw", icon: DollarSign, color: "text-[#D4AF37]", bg: "bg-[#FFD95A]/20" },
                  { label: "Charity Contributions", value: "$128,500", change: "YTD", icon: Heart, color: "text-red-500", bg: "bg-red-50" },
                ].map((stat, i) => (
                  <Card key={i} className="p-6 border-0 shadow-sm rounded-3xl bg-white">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">{stat.change}</span>
                    </div>
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</div>
                    <div className="text-3xl font-black text-gray-900">{stat.value}</div>
                  </Card>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="p-6 border-0 shadow-sm rounded-3xl bg-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Recent User Growth</h3>
                  <div className="h-64 flex items-end justify-between gap-2 border-b border-gray-100 pb-4">
                    {/* Mock Bar Chart */}
                    {[40, 55, 45, 70, 65, 85, 100].map((h, i) => (
                      <div key={i} className="w-full bg-[#145A41]/10 rounded-t-lg relative group hover:bg-[#145A41] transition-colors" style={{ height: `${h}%` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {h * 10}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider pt-4">
                    <span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
                  </div>
                </Card>

                <Card className="p-6 border-0 shadow-sm rounded-3xl bg-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Charity Distribution</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Global Education Initiative", value: 45, color: "bg-[#145A41]" },
                      { name: "Clean Water Access", value: 25, color: "bg-[#2563EB]" },
                      { name: "Community Food Network", value: 20, color: "bg-[#F59E0B]" },
                      { name: "Others", value: 10, color: "bg-gray-300" },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                          <span>{item.name}</span>
                          <span>{item.value}%</span>
                        </div>
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* User Management Tab */}
          {activeTab === "users" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-2">User Management</h1>
                  <p className="text-gray-500 font-medium">Manage subscribers, view details, and edit statuses.</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input placeholder="Search users by name or email..." className="pl-10 w-full md:w-80 bg-white border-gray-200 rounded-xl" />
                </div>
              </div>

              <Card className="border-0 shadow-sm rounded-3xl bg-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Plan</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { name: "Alex Thompson", email: "alex@example.com", status: "Active", plan: "Premium", date: "Mar 1, 2026" },
                        { name: "Sarah Davis", email: "sarah.d@example.com", status: "Active", plan: "Basic", date: "Feb 15, 2026" },
                        { name: "Michael Chen", email: "m.chen@example.com", status: "Inactive", plan: "None", date: "Jan 10, 2026" },
                        { name: "Emma Wilson", email: "emma@example.com", status: "Active", plan: "Premium", date: "Mar 12, 2026" },
                      ].map((user, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {user.status === 'Active' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">{user.plan}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{user.date}</td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#145A41]"><Edit className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Draw Management Tab */}
          {activeTab === "draws" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Draw Management</h1>
                <p className="text-gray-500 font-medium">Configure rules, simulate outcomes, and publish official results.</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Configuration */}
                <Card className="p-8 border-0 shadow-sm rounded-3xl bg-white space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Settings className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Current Draw Config</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Target Draw Date</label>
                      <Input type="date" defaultValue="2026-04-30" className="bg-gray-50 border-gray-200" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Jackpot Prize Pool ($)</label>
                      <Input type="number" defaultValue="25000" className="bg-gray-50 border-gray-200" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Draw Algorithm</label>
                      <Select defaultValue="standard">
                        <SelectTrigger className="bg-gray-50 border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Random (1-45)</SelectItem>
                          <SelectItem value="weighted">Weighted Activity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold h-11 rounded-xl">
                      Save Configuration
                    </Button>
                  </div>
                </Card>

                {/* Simulation & Actions */}
                <Card className="p-8 border-0 shadow-sm rounded-3xl bg-white space-y-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                        <Play className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Execute Draw</h2>
                    </div>
                    
                    <p className="text-gray-600 mb-6 font-medium">
                      Run a simulation to verify prize distributions before officially publishing the results to all users.
                    </p>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 mb-6">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-gray-500">Eligible Participants</span>
                        <span className="font-black text-gray-900">3,890</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-gray-500">Projected 5-Match Winners</span>
                        <span className="font-black text-gray-900">0 - 1</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      onClick={runSimulation}
                      disabled={simulating}
                      className="flex-1 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-bold h-12 rounded-xl"
                    >
                      {simulating ? "Simulating..." : "Run Simulation"}
                    </Button>
                    <Button 
                      onClick={() => toast.success("Results officially published to platform!")}
                      className="flex-1 bg-[#145A41] hover:bg-[#0B3D2E] text-white font-bold h-12 rounded-xl shadow-lg shadow-[#145A41]/20"
                    >
                      Publish Results
                    </Button>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Charity Management Tab */}
          {activeTab === "charities" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Charity Management</h1>
                  <p className="text-gray-500 font-medium">Add, edit, or remove partner organizations.</p>
                </div>
                <Button className="bg-[#145A41] hover:bg-[#0B3D2E] text-white font-bold rounded-xl h-11 px-6 shadow-sm">
                  + Add New Charity
                </Button>
              </div>

              <Card className="border-0 shadow-sm rounded-3xl bg-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Organization Name</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total Allocated</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { name: "Global Education Initiative", cat: "Education", allocated: "$45,200", status: "Active", featured: true },
                        { name: "Clean Water Access", cat: "Environment", allocated: "$28,500", status: "Active", featured: false },
                        { name: "Community Food Network", cat: "Community", allocated: "$20,100", status: "Active", featured: false },
                      ].map((charity, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-900 flex items-center gap-2">
                              {charity.name}
                              {charity.featured && <span className="px-2 py-0.5 bg-[#FFD95A]/20 text-[#D4AF37] text-[10px] uppercase rounded-md">Featured</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-500">{charity.cat}</td>
                          <td className="px-6 py-4 font-bold text-[#145A41]">{charity.allocated}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#145A41]"><Edit className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Winner Verification Tab */}
          {activeTab === "winners" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Winner Verification</h1>
                <p className="text-gray-500 font-medium">Verify scorecards and process prize payouts.</p>
              </div>

              <Card className="border-0 shadow-sm rounded-3xl bg-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Winner</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Match Tier</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Prize</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Score Proof</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {winners.map((winner) => (
                        <tr key={winner.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-900 flex items-center gap-2">
                              <Award className="w-4 h-4 text-[#FFD95A]" />
                              {winner.user}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-gray-100 rounded-md text-xs font-bold text-gray-700">{winner.tier}</span>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900">{winner.prize}</td>
                          <td className="px-6 py-4">
                            {winner.proof === "Pending" ? (
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" className="h-8 text-xs font-bold border-gray-200">
                                  <Eye className="w-3 h-3 mr-1" /> View
                                </Button>
                                <Button size="sm" onClick={() => handleApproveProof(winner.id)} className="h-8 text-xs font-bold bg-green-600 hover:bg-green-700 text-white border-0">
                                  Approve
                                </Button>
                              </div>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {winner.payment === "Pending" ? (
                              <Button 
                                size="sm" 
                                onClick={() => handleMarkPaid(winner.id)} 
                                disabled={winner.proof === "Pending"}
                                className={`h-8 text-xs font-bold ${
                                  winner.proof === "Pending" 
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                    : "bg-blue-600 hover:bg-blue-700 text-white border-0"
                                }`}
                              >
                                Mark as Paid
                              </Button>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Paid
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
