import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { Eye, CheckCircle2, Award } from "lucide-react";

export function Winners() {
  const [winners, setWinners] = useState([
    { id: 1, user: "Alex Thompson", prize: "$500 Pro Shop", tier: "4 Matches", proof: "Pending", payment: "Pending" },
    { id: 2, user: "Sarah Davis", prize: "Pebble Beach Trip", tier: "5 Matches", proof: "Approved", payment: "Pending" },
    { id: 3, user: "Michael Chen", prize: "Premium Balls", tier: "3 Matches", proof: "Approved", payment: "Paid" },
  ]);

  const handleApproveProof = (id: number) => {
    setWinners(winners.map(w => w.id === id ? { ...w, proof: "Approved" } : w));
    toast.success("Proof approved successfully");
  };

  const handleMarkPaid = (id: number) => {
    setWinners(winners.map(w => w.id === id ? { ...w, payment: "Paid" } : w));
    toast.success("Payment marked as completed");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl mx-auto">
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
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {winners.map((winner) => (
                <tr key={winner.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#FFD95A]" /> {winner.user}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-gray-100 rounded-md text-xs font-bold text-gray-700">{winner.tier}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{winner.prize}</td>
                  <td className="px-6 py-4">
                    {winner.proof === "Pending" ? (
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="h-8 text-xs font-bold border-gray-200"><Eye className="w-3 h-3 mr-1" /> View</Button>
                        <Button size="sm" onClick={() => handleApproveProof(winner.id)} className="h-8 text-xs font-bold bg-green-600 hover:bg-green-700 text-white border-0">Approve</Button>
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
                        className={`h-8 text-xs font-bold ${winner.proof === "Pending" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white border-0"}`}
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
  );
}
