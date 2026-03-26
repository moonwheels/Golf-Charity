import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Switch } from "../../components/ui/switch";
import { toast } from "sonner";
import { Check, CreditCard, Activity, ArrowRight, Shield, Calendar } from "lucide-react";

export function Subscription() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    { name: "Starter", price: isYearly ? 99 : 9, features: ["Score tracking", "Monthly challenges", "Basic analytics", "1 charity selection"], current: false },
    { name: "Pro", price: isYearly ? 249 : 25, features: ["Everything in Starter", "Advanced analytics", "Unlimited challenges", "3 charity selections", "Exclusive tournaments"], current: false, popular: true },
    { name: "Elite", price: isYearly ? 499 : 49, features: ["Everything in Pro", "Personal coach", "VIP tournaments", "Unlimited charities", "24/7 support"], current: true },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Subscription</h1>
        <p className="text-lg text-gray-500 font-medium">Manage your plan and billing details.</p>
      </motion.div>

      {/* Current Plan */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
        <Card className="p-8 border-0 shadow-sm rounded-3xl bg-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#145A41] flex items-center justify-center">
                <CreditCard className="w-7 h-7 text-[#FFD95A]" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Current Plan</div>
                <div className="text-2xl font-black text-gray-900">Elite - $49/month</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm font-bold text-green-600"><Activity className="w-4 h-4" /> Active</div>
                <div className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Calendar className="w-3 h-3" /> Renews Apr 30, 2026</div>
              </div>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl" onClick={() => toast.info("Cancellation flow would appear here.")}>
                Cancel Plan
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-lg ${!isYearly ? "font-bold text-[#145A41]" : "text-gray-500"}`}>Monthly</span>
        <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-[#145A41]" />
        <span className={`text-lg ${isYearly ? "font-bold text-[#145A41]" : "text-gray-500"}`}>Yearly</span>
        <span className="bg-[#FFD95A] text-[#145A41] px-3 py-1 rounded-full text-sm font-semibold">Save 15%</span>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <motion.div key={i} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}>
            <Card className={`p-6 rounded-3xl relative overflow-hidden ${plan.current ? 'border-2 border-[#145A41] shadow-xl ring-4 ring-[#145A41]/10' : plan.popular ? 'border-2 border-[#FFD95A] shadow-lg' : 'border border-gray-200 shadow-sm'}`}>
              {plan.current && (
                <div className="absolute top-0 right-0 bg-[#145A41] text-white px-4 py-1 rounded-bl-xl font-bold text-xs flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Current
                </div>
              )}
              <h3 className="text-2xl font-bold text-[#145A41] mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-gray-900">${plan.price}</span>
                <span className="text-gray-500">/{isYearly ? "year" : "month"}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-[#145A41] mt-0.5 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                disabled={plan.current}
                className={`w-full font-bold rounded-xl ${plan.current ? 'bg-gray-100 text-gray-400' : 'bg-[#145A41] hover:bg-[#0B3D2E] text-white'}`}
                onClick={() => toast.success(`Switched to ${plan.name} plan!`)}
              >
                {plan.current ? "Current Plan" : `Switch to ${plan.name}`}
                {!plan.current && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
