import { motion } from "motion/react";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Search, Edit, Trash2, CheckCircle2, XCircle } from "lucide-react";

export function AdminUsers() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-500 font-medium">Manage subscribers, view details, and edit statuses.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input placeholder="Search users..." className="pl-10 w-full md:w-80 bg-white border-gray-200 rounded-xl" />
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
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
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
  );
}
