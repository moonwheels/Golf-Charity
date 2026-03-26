import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { Card } from "../../components/ui/card";
import { Users, Activity, DollarSign, Heart } from "lucide-react";
import {
  fetchAdminAnalytics,
  type AdminAnalytics,
} from "../../../services/adminApi";
import { supabase } from "../../../services/supabaseClient";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function Analytics() {
  const [analytics, setAnalytics] = useState<AdminAnalytics>({
    totalUsers: 0,
    activeSubscriptions: 0,
    prizePool: 0,
    charityContributions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const nextAnalytics = await fetchAdminAnalytics();
        setAnalytics(nextAnalytics);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load analytics.";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadAnalytics();

    const channels: RealtimeChannel[] = [
      supabase
        .channel("admin-analytics-profiles")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "profiles" },
          () => void loadAnalytics(),
        )
        .subscribe(),
      supabase
        .channel("admin-analytics-charities")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "charities" },
          () => void loadAnalytics(),
        )
        .subscribe(),
      supabase
        .channel("admin-analytics-draw-configurations")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "draw_configurations" },
          () => void loadAnalytics(),
        )
        .subscribe(),
    ];

    return () => {
      channels.forEach((channel) => {
        void supabase.removeChannel(channel);
      });
    };
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Platform Analytics</h1>
        <p className="text-gray-500 font-medium">Real-time overview of platform health and contributions.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Users",
            value: analytics.totalUsers.toLocaleString(),
            change: isLoading ? "Loading" : "Live",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Active Subscriptions",
            value: analytics.activeSubscriptions.toLocaleString(),
            change: isLoading ? "Loading" : "Live",
            icon: Activity,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Total Prize Pool",
            value: currencyFormatter.format(analytics.prizePool),
            change: "Current Draw",
            icon: DollarSign,
            color: "text-[#D4AF37]",
            bg: "bg-[#FFD95A]/20",
          },
          {
            label: "Charity Contributions",
            value: currencyFormatter.format(analytics.charityContributions),
            change: "All Time",
            icon: Heart,
            color: "text-red-500",
            bg: "bg-red-50",
          },
        ].map((stat, i) => (
          <Card key={i} className="p-6 border-0 shadow-sm rounded-3xl bg-white">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">{stat.change}</span>
            </div>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</div>
            <div className="text-3xl font-black text-gray-900">{stat.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-6 border-0 shadow-sm rounded-3xl bg-white">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent User Growth</h3>
          <div className="h-64 flex items-end justify-between gap-2 border-b border-gray-100 pb-4">
            {[40, 55, 45, 70, 65, 85, 100].map((h, i) => (
              <div key={i} className="w-full bg-[#145A41]/10 rounded-t-lg relative group hover:bg-[#145A41] transition-colors" style={{ height: `${h}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h * 10}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider pt-4">
            <span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-sm rounded-3xl bg-white">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Charity Distribution</h3>
          <div className="space-y-4">
            {[
              { name: "Global Education Initiative", value: 45, color: "bg-[#145A41]" },
              { name: "Clean Water Access", value: 25, color: "bg-[#2563EB]" },
              { name: "Community Food Network", value: 20, color: "bg-[#F59E0B]" },
              { name: "Others", value: 10, color: "bg-gray-300" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                  <span>{item.name}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
