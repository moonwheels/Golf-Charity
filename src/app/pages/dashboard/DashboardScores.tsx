import { useNavigate } from "react-router";
import { ScoreEntry } from "../../components/ScoreEntry";
import { motion } from "motion/react";

export function DashboardScores() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Score Entry
        </h1>
        <p className="text-gray-500 font-medium mt-2">Enter and manage your Stableford scores.</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <ScoreEntry onSave={() => navigate('/dashboard')} />
      </motion.div>
    </div>
  );
}
