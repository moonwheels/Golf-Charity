import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { toast } from "sonner";
import { Settings, Play } from "lucide-react";

export function DrawManagement() {
  const [simulating, setSimulating] = useState(false);

  const runSimulation = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      toast.success("Draw simulation completed! 145 projected winners.");
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Draw Management</h1>
        <p className="text-gray-500 font-medium">Configure rules, simulate outcomes, and publish results.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
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
                <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Random (1-45)</SelectItem>
                  <SelectItem value="weighted">Weighted Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold h-11 rounded-xl">Save Configuration</Button>
          </div>
        </Card>

        <Card className="p-8 border-0 shadow-sm rounded-3xl bg-white space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Play className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Execute Draw</h2>
            </div>
            <p className="text-gray-600 mb-6 font-medium">Run a simulation before publishing results.</p>
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
            <Button onClick={runSimulation} disabled={simulating} className="flex-1 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-bold h-12 rounded-xl">
              {simulating ? "Simulating..." : "Run Simulation"}
            </Button>
            <Button onClick={() => toast.success("Results published!")} className="flex-1 bg-[#145A41] hover:bg-[#0B3D2E] text-white font-bold h-12 rounded-xl shadow-lg">
              Publish Results
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
