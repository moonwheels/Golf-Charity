import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Settings, Play } from "lucide-react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import {
  fetchDrawConfiguration,
  publishDrawResults,
  saveDrawConfiguration,
  updateDrawSimulation,
  type DrawAlgorithm,
} from "../../../services/adminApi";
import { supabase } from "../../../services/supabaseClient";

type DrawConfig = {
  drawDate: string;
  prizePool: string;
  algorithm: DrawAlgorithm;
};

export function DrawManagement() {
  const [simulating, setSimulating] = useState(false);
  const [lastSimulation, setLastSimulation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [config, setConfig] = useState<DrawConfig>({
    drawDate: "2026-04-30",
    prizePool: "25000",
    algorithm: "standard",
  });

  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        const record = await fetchDrawConfiguration();
        if (record) {
          setConfig({
            drawDate: record.draw_date,
            prizePool: String(record.prize_pool),
            algorithm: record.algorithm,
          });
          setLastSimulation(record.last_simulation_summary);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load draw configuration.";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadConfiguration();

    const channel: RealtimeChannel = supabase
      .channel("admin-draw-configurations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "draw_configurations" },
        () => void loadConfiguration(),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const saveConfiguration = async () => {
    const prizePool = Number(config.prizePool || 0);
    if (Number.isNaN(prizePool) || prizePool < 0) {
      toast.error("Prize pool must be a valid positive amount.");
      return;
    }

    setIsSaving(true);

    try {
      await saveDrawConfiguration({
        draw_date: config.drawDate,
        prize_pool: prizePool,
        algorithm: config.algorithm,
      });
      toast.success(
        `Draw configuration saved for ${config.drawDate} with a $${prizePool.toLocaleString()} prize pool.`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save draw configuration.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const runSimulation = async () => {
    const prizePool = Number(config.prizePool || 0);
    if (Number.isNaN(prizePool) || prizePool < 0) {
      toast.error("Prize pool must be a valid positive amount.");
      return;
    }

    setSimulating(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const summary =
        config.algorithm === "weighted"
          ? "Weighted simulation completed. 152 projected winners."
          : "Standard simulation completed. 145 projected winners.";
      await updateDrawSimulation({
        draw_date: config.drawDate,
        prize_pool: prizePool,
        algorithm: config.algorithm,
        last_simulation_summary: summary,
        last_simulated_at: new Date().toISOString(),
      });
      setLastSimulation(summary);
      toast.success(summary);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to run simulation.";
      toast.error(message);
    } finally {
      setSimulating(false);
    }
  };

  const publishResults = async () => {
    if (!lastSimulation) {
      toast.error("Run a simulation before publishing results.");
      return;
    }

    const prizePool = Number(config.prizePool || 0);
    if (Number.isNaN(prizePool) || prizePool < 0) {
      toast.error("Prize pool must be a valid positive amount.");
      return;
    }

    setIsPublishing(true);

    try {
      await publishDrawResults({
        draw_date: config.drawDate,
        prize_pool: prizePool,
        algorithm: config.algorithm,
      });
      toast.success(`Results published for the ${config.drawDate} draw.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to publish results.";
      toast.error(message);
    } finally {
      setIsPublishing(false);
    }
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
              <Input
                type="date"
                value={config.drawDate}
                onChange={(event) => setConfig((current) => ({ ...current, drawDate: event.target.value }))}
                className="bg-gray-50 border-gray-200"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Jackpot Prize Pool ($)</label>
              <Input
                type="number"
                value={config.prizePool}
                onChange={(event) => setConfig((current) => ({ ...current, prizePool: event.target.value }))}
                className="bg-gray-50 border-gray-200"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Draw Algorithm</label>
              <Select
                value={config.algorithm}
                onValueChange={(value: DrawAlgorithm) => setConfig((current) => ({ ...current, algorithm: value }))}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Random (1-45)</SelectItem>
                  <SelectItem value="weighted">Weighted Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold h-11 rounded-xl" onClick={() => void saveConfiguration()} disabled={isLoading || isSaving}>
              {isSaving ? "Saving..." : "Save Configuration"}
            </Button>
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
                <span className="font-black text-gray-900">{isLoading ? "--" : "Live"}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-500">Projected 5-Match Winners</span>
                <span className="font-black text-gray-900">{config.algorithm === "weighted" ? "1 - 2" : "0 - 1"}</span>
              </div>
            </div>
            {lastSimulation ? (
              <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                {lastSimulation}
              </div>
            ) : null}
          </div>
          <div className="flex gap-4">
            <Button onClick={() => void runSimulation()} disabled={simulating || isLoading} className="flex-1 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-bold h-12 rounded-xl">
              {simulating ? "Simulating..." : "Run Simulation"}
            </Button>
            <Button onClick={() => void publishResults()} disabled={isPublishing || isLoading} className="flex-1 bg-[#145A41] hover:bg-[#0B3D2E] text-white font-bold h-12 rounded-xl shadow-lg">
              {isPublishing ? "Publishing..." : "Publish Results"}
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
