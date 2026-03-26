import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Target, Calendar, Plus, Trophy, Save } from "lucide-react";
import { toast } from "sonner";

interface Score {
  id: string;
  date: string;
  score: string;
  isNew?: boolean;
  isReplacing?: boolean;
}

export function ScoreEntry({ onSave }: { onSave?: () => void }) {
  const [scores, setScores] = useState<Score[]>([
    { id: "1", date: "2026-03-24", score: "36" },
    { id: "2", date: "2026-03-20", score: "34" },
    { id: "3", date: "2026-03-15", score: "38" },
  ]);

  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newScore, setNewScore] = useState("");

  const handleAddScore = () => {
    const scoreVal = parseInt(newScore);
    if (!newDate || isNaN(scoreVal) || scoreVal < 1 || scoreVal > 45) {
      toast.error("Invalid input", {
        description: "Please enter a valid date and Stableford score (1-45).",
      });
      return;
    }

    setScores((prev) => {
      const newScoreObj = {
        id: Math.random().toString(36).substr(2, 9),
        date: newDate,
        score: newScore,
        isNew: true,
      };

      // If we already have 5, we replace the oldest (last one)
      let updated = [newScoreObj, ...prev];
      if (updated.length > 5) {
        // Mark the 5th element for visual replacement animation before removing the 6th
        updated = updated.slice(0, 5);
        toast("Oldest score replaced", {
          description: "Kept the most recent 5 scores.",
        });
      }

      // Sort by date descending (latest first)
      updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      return updated;
    });

    setNewScore("");
  };

  useEffect(() => {
    // Clear the isNew flag after animation
    const timeout = setTimeout(() => {
      setScores((prev) => prev.map((s) => ({ ...s, isNew: false })));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [scores]);

  const handleSaveAll = () => {
    toast.success("Scores updated successfully!");
    if (onSave) onSave();
  };

  return (
    <Card className="p-8 border-2 border-[#145A41] bg-white shadow-xl rounded-3xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#145A41] mb-2 tracking-tight">
            Last 5 Scores
          </h2>
          <p className="text-gray-500 font-medium">
            Enter your recent Stableford scores (1–45)
          </p>
        </div>
        <div className="w-14 h-14 bg-[#FFD95A] rounded-2xl flex items-center justify-center shadow-md">
          <Target className="w-7 h-7 text-[#145A41]" />
        </div>
      </div>

      {/* Add New Score Form */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <div className="flex-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="pl-9 bg-white border-gray-200 focus:border-[#145A41] focus:ring-[#145A41] font-medium"
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Stableford Score</label>
          <Input
            type="number"
            min="1"
            max="45"
            placeholder="1-45"
            value={newScore}
            onChange={(e) => setNewScore(e.target.value)}
            className="bg-white border-gray-200 focus:border-[#145A41] focus:ring-[#145A41] font-bold"
          />
        </div>
        <div className="flex items-end">
          <Button 
            onClick={handleAddScore}
            className="w-full sm:w-auto bg-[#145A41] hover:bg-[#0B3A2B] text-white font-bold h-10 px-6 rounded-xl shadow-md"
          >
            Add <Plus className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Slots / Cards */}
      <div className="space-y-3 mb-8">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between px-2">
          <span>Date</span>
          <span>Score</span>
        </div>
        
        <div className="space-y-3 relative">
          <AnimatePresence mode="popLayout">
            {scores.map((score, index) => (
              <motion.div
                key={score.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  backgroundColor: score.isNew ? "#f0fdf4" : "#ffffff" 
                }}
                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-4 rounded-2xl border-2 border-gray-100 shadow-sm relative overflow-hidden"
              >
                {score.isNew && (
                  <motion.div 
                    className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"
                    initial={{ height: 0 }}
                    animate={{ height: "100%" }}
                  />
                )}
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400">
                    {index + 1}
                  </div>
                  <div className="font-semibold text-gray-700">
                    {new Date(score.date).toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                
                <div className="text-2xl font-extrabold text-[#145A41]">
                  {score.score} <span className="text-sm font-medium text-gray-400 ml-1">pts</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty Slots */}
          {Array.from({ length: Math.max(0, 5 - scores.length) }).map((_, i) => (
            <div 
              key={`empty-${i}`} 
              className="flex items-center justify-between p-4 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-400">
                  {scores.length + i + 1}
                </div>
                <div className="font-medium text-gray-400">Awaiting score...</div>
              </div>
              <div className="text-lg font-bold text-gray-300">--</div>
            </div>
          ))}
        </div>
      </div>

      <Button 
        onClick={handleSaveAll}
        size="lg" 
        className="w-full bg-[#FFD95A] hover:bg-[#F4C430] text-[#145A41] font-bold text-lg py-6 rounded-xl shadow-[0_8px_30px_rgba(255,217,90,0.3)] transition-all hover:-translate-y-1"
      >
        <Save className="mr-2 w-5 h-5" /> Save Scores
      </Button>
    </Card>
  );
}
