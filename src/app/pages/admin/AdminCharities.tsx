import { motion } from "motion/react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export function AdminCharities() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Charity Management</h1>
          <p className="text-gray-500 font-medium">Add, edit, or remove partner organizations.</p>
        </div>
        <Button className="bg-[#145A41] hover:bg-[#0B3D2E] text-white font-bold rounded-xl h-11 px-6 shadow-sm">+ Add New Charity</Button>
      </div>

      <Card className="border-0 shadow-sm rounded-3xl bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Organization</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total Allocated</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { name: "Global Education Initiative", cat: "Education", allocated: "$45,200", featured: true },
                { name: "Clean Water Access", cat: "Environment", allocated: "$28,500", featured: false },
                { name: "Community Food Network", cat: "Community", allocated: "$20,100", featured: false },
              ].map((charity, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 flex items-center gap-2">
                      {charity.name}
                      {charity.featured && <span className="px-2 py-0.5 bg-[#FFD95A]/20 text-[#D4AF37] text-[10px] uppercase rounded-md font-bold">Featured</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">{charity.cat}</td>
                  <td className="px-6 py-4 font-bold text-[#145A41]">{charity.allocated}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Active</span>
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
  );
}
