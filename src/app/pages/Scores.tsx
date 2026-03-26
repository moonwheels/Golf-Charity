import { useNavigate } from "react-router";
import { Navigation } from "../components/Navigation";
import { ScoreEntry } from "../components/ScoreEntry";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export function Scores() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navigation />
      <div className="pt-24 px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="text-gray-500 hover:text-gray-900 font-bold mb-4 -ml-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Return to Dashboard
            </Button>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Score Entry
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <ScoreEntry onSave={() => navigate('/dashboard')} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}