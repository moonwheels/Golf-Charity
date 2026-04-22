import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { useAuth } from "../../../hooks/useAuth";
import { useMemberScores } from "../../../hooks/useMemberScores";
import { useMemberCharityPreference } from "../../../hooks/useMemberCharityPreference";
import {
  Wallet,
  Heart,
  Clock,
  CheckCircle2,
  CreditCard,
  Ticket,
  ArrowUpRight,
  Activity,
  Plus,
  Target,
  Calendar,
  Loader2,
} from "lucide-react";

function formatScoreDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatPlanName(plan: "none" | "basic" | "premium" | undefined) {
  switch (plan) {
    case "basic":
      return "Basic";
    case "premium":
      return "Premium";
    default:
      return "No Plan";
  }
}

export function Overview() {
  const { user, profile } = useAuth();
  const { scores, isLoading: isScoresLoading, error: scoresError } = useMemberScores(user?.id);
  const {
    preference,
    isLoading: isCharityLoading,
    error: charityError,
  } = useMemberCharityPreference(user?.id);

  const winnings = [
    { id: 1, draw: "March 2026 Draw", date: "Mar 30, 2026", amount: "$500 Pro Shop Credit", status: "Pending" },
    { id: 2, draw: "February 2026 Draw", date: "Feb 28, 2026", amount: "Dozen Premium Balls", status: "Paid" },
    { id: 3, draw: "December 2025 Draw", date: "Dec 30, 2025", amount: "$150 Gift Card", status: "Paid" },
  ];

  const latestScore = scores[0] ?? null;
  const renewsAt = new Date(profile?.updated_at ?? profile?.created_at ?? Date.now());
  renewsAt.setMonth(renewsAt.getMonth() + 1);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
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
      </motion.div>

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
            <span
              className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                profile?.account_status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {profile?.account_status === "active" ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
            Subscription
          </div>
          <div className="text-2xl font-black text-gray-900">
            {formatPlanName(profile?.subscription_plan)}
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-sm rounded-3xl bg-white">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-[#145A41]/10 flex items-center justify-center text-[#145A41]">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
            Latest Score
          </div>
          <div className="text-2xl font-black text-gray-900">
            {isScoresLoading ? "..." : latestScore ? `${latestScore.score} pts` : "--"}
          </div>
          <div className="text-sm font-medium text-gray-500 mt-1">
            {latestScore ? formatScoreDate(latestScore.played_on) : "Add a round to begin"}
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-sm rounded-3xl bg-white">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-[#FFD95A]/20 flex items-center justify-center text-[#D4AF37]">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
            Contribution Rate
          </div>
          <div className="text-2xl font-black text-gray-900">
            {isCharityLoading
              ? "..."
              : preference
                ? `${preference.contribution_percentage}%`
                : "Not set"}
          </div>
          <div className="text-sm font-medium text-gray-500 mt-1 truncate">
            {preference?.charity?.name ?? "Choose your charity partner"}
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-sm rounded-3xl bg-white">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
            Scores Stored
          </div>
          <div className="text-2xl font-black text-gray-900">{scores.length}/5</div>
          <div className="text-sm font-medium text-gray-500 mt-1">
            Rolling history kept newest first
          </div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card className="p-8 border-0 shadow-sm rounded-3xl bg-white">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    Recent Scores
                  </h2>
                  <p className="text-gray-500 font-medium text-sm mt-1">
                    Your latest registered rounds from Supabase.
                  </p>
                </div>
                <Link to="/dashboard/scores">
                  <Button className="bg-[#145A41] hover:bg-[#0B3A2B] text-white font-bold rounded-xl shadow-md hidden sm:flex">
                    <Plus className="mr-2 w-4 h-4" /> Add Score
                  </Button>
                </Link>
              </div>

              {scoresError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
                  {scoresError}
                </div>
              ) : null}

              {isScoresLoading ? (
                <div className="flex items-center justify-center py-10 text-gray-500 font-medium">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Loading your score history...
                </div>
              ) : scores.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {scores.map((score, index) => (
                    <div
                      key={score.id}
                      className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                          {index + 1}
                        </div>
                        <div className="font-semibold text-gray-700">
                          {formatScoreDate(score.played_on)}
                        </div>
                      </div>
                      <div className="text-xl font-extrabold text-[#145A41]">
                        {score.score}{" "}
                        <span className="text-sm font-medium text-gray-400 ml-1">pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-gray-500 font-medium mb-6">
                  No scores saved yet. Add your first round to start your rolling 5-score history.
                </div>
              )}

              <Link to="/dashboard/scores" className="sm:hidden">
                <Button className="w-full bg-[#145A41] hover:bg-[#0B3A2B] text-white font-bold rounded-xl shadow-md h-12">
                  <Plus className="mr-2 w-4 h-4" /> Add Score
                </Button>
              </Link>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="p-8 border-0 shadow-sm rounded-3xl bg-white">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    Winnings Overview
                  </h2>
                  <p className="text-gray-500 font-medium text-sm mt-1">
                    Your recent rewards and payment status
                  </p>
                </div>
                <Link to="/dashboard/draws">
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
                      <div
                        className={`text-xs font-bold px-3 py-1 rounded-lg mt-1 inline-flex items-center ${
                          winning.status === "Paid"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        }`}
                      >
                        {winning.status === "Paid" ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : null}
                        {winning.status === "Pending" ? (
                          <Clock className="w-3 h-3 mr-1" />
                        ) : null}
                        {winning.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-8">
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
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </span>
                  <span
                    className={`flex items-center gap-1 text-sm font-bold ${
                      profile?.account_status === "active" ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    <Activity className="w-4 h-4" />
                    {profile?.account_status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Plan
                  </span>
                  <span className="text-base font-bold text-gray-900">
                    {formatPlanName(profile?.subscription_plan)}
                  </span>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Next Renewal
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {profile?.account_status === "active"
                      ? renewsAt.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "No active renewal"}
                  </div>
                </div>
              </div>
              <Link to="/dashboard/subscription">
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl h-12">
                  Manage Billing
                </Button>
              </Link>
            </Card>
          </motion.div>

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

                {charityError ? (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 mb-4 text-sm text-white">
                    {charityError}
                  </div>
                ) : isCharityLoading ? (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 mb-4 text-sm text-white flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading your charity preference...
                  </div>
                ) : (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 mb-4">
                    <div className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1">
                      Selected Cause
                    </div>
                    <div className="text-lg font-bold text-white">
                      {preference?.charity?.name ?? "No charity selected yet"}
                    </div>
                    <div className="flex justify-between items-end mt-3">
                      <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
                        Contribution Rate
                      </span>
                      <span className="text-2xl font-black text-[#FFD95A]">
                        {preference ? `${preference.contribution_percentage}%` : "--"}
                      </span>
                    </div>
                  </div>
                )}

                <Link to="/dashboard/charity">
                  <Button className="w-full bg-white text-[#145A41] hover:bg-gray-100 font-bold rounded-xl h-10 mt-2">
                    {preference ? "Change Charity" : "Choose Charity"}
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Card className="p-6 border-0 shadow-sm rounded-3xl bg-white">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#145A41]" />
                Upcoming Draw
              </h3>
              <div className="p-4 bg-[#FFD95A]/10 rounded-2xl border border-[#FFD95A]/30">
                <div className="flex items-center gap-2 text-sm font-bold text-[#145A41]/70 uppercase tracking-wider mb-2">
                  <Clock className="w-4 h-4" /> Next Draw
                </div>
                <div className="text-xl font-black text-[#145A41]">April 30, 2026</div>
                <div className="text-sm font-medium text-[#145A41]/80 mt-1">
                  Your latest 5 scores are locked in!
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
