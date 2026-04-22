import { useState } from "react";
import { Calendar, Loader2, PencilLine, Plus, Target, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { useMemberScores } from "../../hooks/useMemberScores";
import type { MemberScore } from "../../services/memberDataApi";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function formatScoreDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ScoreEntry() {
  const { user } = useAuth();
  const { scores, isLoading, isMutating, error, createScore, updateScore } =
    useMemberScores(user?.id);
  const [scoreDate, setScoreDate] = useState(getTodayDate());
  const [scoreValue, setScoreValue] = useState("");
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);

  const resetForm = () => {
    setScoreDate(getTodayDate());
    setScoreValue("");
    setEditingScoreId(null);
  };

  const handleEdit = (score: MemberScore) => {
    setEditingScoreId(score.id);
    setScoreDate(score.played_on);
    setScoreValue(String(score.score));
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error("You need to be signed in to manage scores.");
      return;
    }

    const nextScoreValue = Number(scoreValue);

    if (!scoreDate || !Number.isInteger(nextScoreValue) || nextScoreValue < 1 || nextScoreValue > 45) {
      toast.error("Invalid score details.", {
        description: "Please enter a date and a whole-number Stableford score between 1 and 45.",
      });
      return;
    }

    try {
      if (editingScoreId) {
        await updateScore(editingScoreId, {
          score: nextScoreValue,
          played_on: scoreDate,
        });
        toast.success("Score updated successfully.");
      } else {
        await createScore({
          profile_id: user.id,
          score: nextScoreValue,
          played_on: scoreDate,
        });
        toast.success(
          scores.length >= 5
            ? "Score saved. GolfGive kept your 5 newest rounds."
            : "Score saved successfully.",
        );
      }

      resetForm();
    } catch (saveError) {
      toast.error(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save your score right now.",
      );
    }
  };

  return (
    <Card className="p-8 border-2 border-[#145A41] bg-white shadow-xl rounded-3xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#145A41] mb-2 tracking-tight">
            Last 5 Scores
          </h2>
          <p className="text-gray-500 font-medium">
            Stableford rounds are stored in Supabase and ordered newest first.
          </p>
        </div>
        <div className="w-14 h-14 bg-[#FFD95A] rounded-2xl flex items-center justify-center shadow-md">
          <Target className="w-7 h-7 text-[#145A41]" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <div className="flex-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
            Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="date"
              value={scoreDate}
              onChange={(event) => setScoreDate(event.target.value)}
              className="pl-9 bg-white border-gray-200 focus:border-[#145A41] focus:ring-[#145A41] font-medium"
            />
          </div>
        </div>

        <div className="flex-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
            Stableford Score
          </label>
          <Input
            type="number"
            min="1"
            max="45"
            step="1"
            placeholder="1-45"
            value={scoreValue}
            onChange={(event) => setScoreValue(event.target.value)}
            className="bg-white border-gray-200 focus:border-[#145A41] focus:ring-[#145A41] font-bold"
          />
        </div>

        <div className="flex items-end gap-3">
          <Button
            onClick={() => void handleSubmit()}
            disabled={isLoading || isMutating}
            className="w-full sm:w-auto bg-[#145A41] hover:bg-[#0B3A2B] text-white font-bold h-10 px-6 rounded-xl shadow-md"
          >
            {isMutating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : editingScoreId ? (
              <PencilLine className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {editingScoreId ? "Update" : "Add"}
          </Button>

          {editingScoreId ? (
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={isMutating}
              className="w-full sm:w-auto rounded-xl h-10 border-gray-200"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-[#FFD95A]/40 bg-[#FFD95A]/10 px-4 py-3 text-sm font-medium text-[#145A41] mb-6">
        GolfGive stores only your latest 5 scores. When a sixth round is added, the oldest stored round is removed automatically.
      </div>

      {error ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-gray-500 font-medium">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Loading your scores...
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between px-2">
            <span>Date</span>
            <span>Score</span>
          </div>

          {scores.map((score, index) => (
            <div
              key={score.id}
              className="flex items-center justify-between p-4 rounded-2xl border-2 border-gray-100 shadow-sm bg-white gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-gray-700">
                    {formatScoreDate(score.played_on)}
                  </div>
                  <div className="text-xs font-medium text-gray-400">
                    {editingScoreId === score.id ? "Editing this round" : "Stored round"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-2xl font-extrabold text-[#145A41]">
                  {score.score}{" "}
                  <span className="text-sm font-medium text-gray-400 ml-1">pts</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(score)}
                  disabled={isMutating}
                  className="rounded-xl border-gray-200"
                >
                  <PencilLine className="w-4 h-4" />
                  Edit
                </Button>
              </div>
            </div>
          ))}

          {Array.from({ length: Math.max(0, 5 - scores.length) }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="flex items-center justify-between p-4 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 opacity-60"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-400">
                  {scores.length + index + 1}
                </div>
                <div className="font-medium text-gray-400">Awaiting score...</div>
              </div>
              <div className="text-lg font-bold text-gray-300">--</div>
            </div>
          ))}

          {scores.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-gray-500 font-medium">
              No scores saved yet. Add your first round above to start your rolling 5-score history.
            </div>
          ) : null}
        </div>
      )}
    </Card>
  );
}
