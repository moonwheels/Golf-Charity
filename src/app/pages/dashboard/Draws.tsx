import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Trophy, Calendar, Gift, ChevronRight, AlertCircle, Clock, Star, Sparkles, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { fetchMemberDrawData, type MemberDrawData } from "../../../services/memberDataApi";

export function Draws() {
  const { user } = useAuth();
  const [data, setData] = useState<MemberDrawData | null>(null);

  useEffect(() => {
    if (user?.id) fetchMemberDrawData(user.id).then(setData);
  }, [user?.id]);

  const drawNumbers = data?.drawResult?.winning_scores || [];
  const userNumbers = data?.entryScores || [];
  
  const matchCount = userNumbers.filter(num => drawNumbers.includes(num)).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
          Monthly Rewards Draw
        </h1>
        <p className="text-lg text-gray-500 font-medium">
          Match your Stableford scores to win exclusive prizes.
        </p>
      </motion.div>

      {/* Main Draw Results */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
        <Card className="relative overflow-hidden border-0 shadow-2xl rounded-[2rem]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B3D2E] to-[#145A41] z-0"></div>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="relative z-10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-white/90 text-sm font-semibold mb-3 border border-white/20 backdrop-blur-md">
                  <Calendar className="w-4 h-4" /> March 2026 Results
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">The Winning Scores</h2>
              </div>
              <div className="bg-[#FFD95A] rounded-2xl p-4 shadow-lg text-center flex-shrink-0 w-full md:w-auto transform rotate-1 hover:rotate-0 transition-transform">
                <div className="text-[#145A41] font-bold uppercase tracking-wider text-sm mb-1 flex items-center justify-center gap-1">
                  <AlertCircle className="w-4 h-4" /> No 5-Match Winner
                </div>
                <div className="text-2xl font-black text-[#0B3D2E]">Jackpot Rolls Over!</div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {drawNumbers.map((num, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-b from-[#FFD95A] to-[#F4C430] flex items-center justify-center shadow-[0_0_30px_rgba(255,217,90,0.4)] border-4 border-white relative"
                >
                  <div className="absolute top-1 left-2 right-2 h-4 bg-white/40 rounded-full blur-[1px]"></div>
                  <span className="text-2xl md:text-3xl font-black text-[#145A41]">{num}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Prize Tiers */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
            <h3 className="text-2xl font-bold text-[#145A41] mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-[#FFD95A]" /> Prize Tiers
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6 border-2 border-[#FFD95A] bg-[#FFD95A]/5 relative overflow-hidden group hover:shadow-lg transition-all">
                <div className="absolute top-0 right-0 p-3">
                  <Sparkles className="w-6 h-6 text-[#F4C430] opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-[#145A41] font-black text-xl mb-1">5 Matches</div>
                <div className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Jackpot</div>
                <div className="text-gray-700 font-medium mb-3">Win the ultimate golf trip for two to Pebble Beach + Full Bag Fitting.</div>
                <div className="text-sm font-bold text-[#145A41] bg-white rounded-lg px-3 py-2 inline-block border border-[#FFD95A]/30">0 Winners this month</div>
              </Card>
              <Card className="p-6 border border-gray-200 hover:border-[#145A41]/30 hover:shadow-md transition-all">
                <div className="text-[#145A41] font-black text-xl mb-1">4 Matches</div>
                <div className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Tier 2</div>
                <div className="text-gray-700 font-medium mb-3">New Driver of your choice or $500 Pro Shop Credit.</div>
                <div className="text-sm font-bold text-gray-600 bg-gray-50 rounded-lg px-3 py-2 inline-block">12 Winners</div>
              </Card>
              <Card className="p-6 border border-gray-200 hover:border-[#145A41]/30 hover:shadow-md transition-all">
                <div className="text-[#145A41] font-black text-xl mb-1">3 Matches</div>
                <div className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Tier 3</div>
                <div className="text-gray-700 font-medium mb-3">Premium dozen golf balls & branded polo shirt.</div>
                <div className="text-sm font-bold text-gray-600 bg-gray-50 rounded-lg px-3 py-2 inline-block">145 Winners</div>
              </Card>
            </div>
          </motion.div>

          {/* Your Participation */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }}>
            <Card className="p-8 border-2 border-gray-100 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#145A41] mb-1">Your Participation</h3>
                  <p className="text-gray-500 font-medium">Based on your last 5 submitted scores.</p>
                </div>
                <div className="px-4 py-2 bg-green-50 rounded-xl border border-green-100 flex items-center gap-2 text-green-700 font-bold">
                  <CheckCircle2 className="w-5 h-5" /> {matchCount} Matches Found!
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Your Scores</div>
                <div className="flex flex-wrap gap-4">
                  {userNumbers.map((num, i) => {
                    const isMatch = drawNumbers.includes(num);
                    return (
                      <div
                        key={i}
                        className={`flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl font-bold text-xl md:text-2xl transition-all ${
                          isMatch
                            ? 'bg-[#145A41] text-white shadow-md ring-2 ring-offset-2 ring-[#145A41] scale-110 z-10'
                            : 'bg-white text-gray-400 border-2 border-gray-200'
                        }`}
                      >
                        {num}
                        {isMatch && <Star className="w-3 h-3 text-[#FFD95A] absolute -top-1 -right-1 fill-current" />}
                      </div>
                    );
                  })}
                </div>
                {matchCount >= 3 ? (
                  <div className="mt-6 p-4 bg-[#FFD95A]/20 border border-[#FFD95A] rounded-xl text-[#145A41] font-bold flex items-center gap-3">
                    <Gift className="w-6 h-6 text-[#F4C430]" />
                    Congratulations! You've won a Tier {5 - matchCount + 1} prize.
                  </div>
                ) : (
                  <div className="mt-6 text-gray-500 font-medium text-sm">
                    You need at least 3 matches to win. Keep submitting scores!
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div>
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }}>
            <Card className="p-6 bg-[#145A41] text-white relative overflow-hidden shadow-xl">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#FFD95A]" /> Upcoming Draw
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-2">Draw Date</div>
                  <div className="text-2xl font-bold">April 30, 2026</div>
                </div>
                <div>
                  <div className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-2">Projected Jackpot</div>
                  <div className="text-4xl font-black text-[#FFD95A] drop-shadow-md">$25,000</div>
                  <div className="text-sm text-white/60 mt-1">+ St. Andrews Golf Trip</div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <div className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-3">Time Remaining</div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[{ v: "14", l: "Days" }, { v: "08", l: "Hrs" }, { v: "45", l: "Min" }, { v: "12", l: "Sec" }].map((t) => (
                      <div key={t.l} className="bg-white/10 rounded-lg py-2 backdrop-blur-sm">
                        <div className="text-xl font-bold">{t.v}</div>
                        <div className="text-[10px] uppercase text-white/60">{t.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <Link to="/dashboard/scores">
                  <Button className="w-full bg-[#FFD95A] hover:bg-[#F4C430] text-[#145A41] font-bold mt-4 shadow-lg hover:-translate-y-0.5 transition-transform h-12">
                    Enter New Scores <ChevronRight className="ml-1 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
