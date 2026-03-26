import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Eye, CheckCircle2, Award } from "lucide-react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  fetchWinnerClaims,
  updateWinnerClaim,
  type WinnerClaimRecord,
} from "../../../services/adminApi";
import { supabase } from "../../../services/supabaseClient";

export function Winners() {
  const [winners, setWinners] = useState<WinnerClaimRecord[]>([]);
  const [selectedWinner, setSelectedWinner] = useState<WinnerClaimRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const loadWinners = async () => {
      try {
        const nextWinners = await fetchWinnerClaims();
        setWinners(nextWinners);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load winner claims.";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadWinners();

    const channel: RealtimeChannel = supabase
      .channel("admin-winner-claims")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "winner_claims" },
        () => void loadWinners(),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const handleApproveProof = async (id: string) => {
    setUpdatingId(id);

    try {
      const updatedWinner = await updateWinnerClaim(id, {
        proof_status: "approved",
      });
      setWinners((current) =>
        current.map((winner) =>
          winner.id === id ? updatedWinner : winner,
        ),
      );
      toast.success("Proof approved successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to approve proof.";
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMarkPaid = async (id: string) => {
    setUpdatingId(id);

    try {
      const updatedWinner = await updateWinnerClaim(id, {
        payment_status: "paid",
      });
      setWinners((current) =>
        current.map((winner) =>
          winner.id === id ? updatedWinner : winner,
        ),
      );
      toast.success("Payment marked as completed.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update payment.";
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
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
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm font-medium text-gray-500">
                    Loading winner claims...
                  </td>
                </tr>
              ) : null}
              {!isLoading && winners.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm font-medium text-gray-500">
                    No winner claims have been submitted yet.
                  </td>
                </tr>
              ) : null}
              {winners.map((winner) => (
                <tr key={winner.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#FFD95A]" /> {winner.winner_name}
                    </div>
                    <div className="text-sm text-gray-500">{winner.winner_email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-gray-100 rounded-md text-xs font-bold text-gray-700">{winner.tier}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{winner.prize}</td>
                  <td className="px-6 py-4">
                    {winner.proof_status === "pending" ? (
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="h-8 text-xs font-bold border-gray-200" onClick={() => setSelectedWinner(winner)}>
                          <Eye className="w-3 h-3 mr-1" /> View
                        </Button>
                        <Button size="sm" onClick={() => void handleApproveProof(winner.id)} disabled={updatingId === winner.id} className="h-8 text-xs font-bold bg-green-600 hover:bg-green-700 text-white border-0">
                          {updatingId === winner.id ? "Saving..." : "Approve"}
                        </Button>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {winner.payment_status === "pending" ? (
                      <Button
                        size="sm"
                        onClick={() => void handleMarkPaid(winner.id)}
                        disabled={winner.proof_status === "pending" || updatingId === winner.id}
                        className={`h-8 text-xs font-bold ${winner.proof_status === "pending" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white border-0"}`}
                      >
                        {updatingId === winner.id ? "Saving..." : "Mark as Paid"}
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

      <Dialog open={Boolean(selectedWinner)} onOpenChange={(open) => !open && setSelectedWinner(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Score Proof Review</DialogTitle>
            <DialogDescription>Review the submitted details for {selectedWinner?.winner_name}.</DialogDescription>
          </DialogHeader>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700">
            {selectedWinner?.scorecard}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedWinner(null)}>Close</Button>
            {selectedWinner?.proof_status === "pending" ? (
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  void handleApproveProof(selectedWinner.id);
                  setSelectedWinner(null);
                }}
              >
                Approve Proof
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
