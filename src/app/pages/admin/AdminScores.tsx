import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  fetchAdminScores,
  deleteAdminScore,
  type AdminScoreRecord,
} from "../../../services/adminApi";
import { supabase } from "../../../services/supabaseClient";

export function AdminScores() {
  const [scores, setScores] = useState<AdminScoreRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const loadScores = async () => {
      try {
        const data = await fetchAdminScores();
        setScores(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load scores.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadScores();

    const channel: RealtimeChannel = supabase
      .channel("admin-scores-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "scores" },
        () => void loadScores()
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this score?")) return;
    setDeletingId(id);
    try {
      await deleteAdminScore(id);
      setScores(cur => cur.filter(s => s.id !== id));
      toast.success("Score deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete score.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Member Scores</h1>
        <p className="text-gray-500 font-medium">Manage and review all submitted golf scores.</p>
      </div>

      <Card className="border-0 shadow-sm rounded-3xl bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-sm font-medium text-gray-500">Loading scores...</td></tr>
              )}
              {!isLoading && scores.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-sm font-medium text-gray-500">No scores submitted yet.</td></tr>
              )}
              {scores.map((score) => (
                <tr key={score.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{score.member_name}</div>
                    <div className="text-sm text-gray-500">{score.member_email}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900 text-lg">{score.score} pts</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{score.course_name || "Unknown"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(score.played_on).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(score.id)}
                      disabled={deletingId === score.id}
                      className="text-red-500 hover:bg-red-50 hover:border-red-100 border-gray-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
