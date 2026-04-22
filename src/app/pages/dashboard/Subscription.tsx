import { useState } from "react";
import { motion } from "motion/react";
import { Check, CreditCard, Activity, ArrowRight, Shield, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../../hooks/useAuth";
import { updateProfile } from "../../../services/profileApi";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Switch } from "../../components/ui/switch";

type PlanId = "none" | "basic" | "premium";

const MONTHLY_PLANS = {
  none: 9,
  basic: 25,
  premium: 49,
} satisfies Record<PlanId, number>;

const YEARLY_PLANS = {
  none: 99,
  basic: 249,
  premium: 499,
} satisfies Record<PlanId, number>;

export function Subscription() {
  const { user, profile, refreshProfile } = useAuth();
  const [isYearly, setIsYearly] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const plans: Array<{
    id: PlanId;
    name: string;
    price: number;
    features: string[];
    popular?: boolean;
  }> = [
    {
      id: "none",
      name: "Starter",
      price: isYearly ? YEARLY_PLANS.none : MONTHLY_PLANS.none,
      features: ["Score tracking", "Monthly challenges", "Basic analytics", "1 charity selection"],
    },
    {
      id: "basic",
      name: "Pro",
      price: isYearly ? YEARLY_PLANS.basic : MONTHLY_PLANS.basic,
      features: ["Everything in Starter", "Advanced analytics", "Unlimited challenges", "3 charity selections", "Exclusive tournaments"],
      popular: true,
    },
    {
      id: "premium",
      name: "Elite",
      price: isYearly ? YEARLY_PLANS.premium : MONTHLY_PLANS.premium,
      features: ["Everything in Pro", "Personal coach", "VIP tournaments", "Unlimited charities", "24/7 support"],
    },
  ];

  const currentPlan = plans.find((plan) => plan.id === profile?.subscription_plan) ?? plans[0];
  const renewsAt = new Date(profile?.updated_at ?? profile?.created_at ?? Date.now());
  renewsAt.setMonth(renewsAt.getMonth() + 1);

  const handlePlanChange = async (planId: PlanId) => {
    if (!user?.id) {
      toast.error("You need to be signed in to manage your subscription.");
      return;
    }

    setIsSaving(true);

    try {
      await updateProfile(user.id, {
        subscription_plan: planId,
        account_status: planId === "none" ? "inactive" : "active",
      });
      await refreshProfile();
      toast.success(
        planId === "none"
          ? "Subscription cancelled successfully."
          : "Subscription updated successfully.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update your subscription.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Subscription</h1>
        <p className="text-lg text-gray-500 font-medium">Manage your plan and billing details.</p>
      </motion.div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
        <Card className="p-8 border-0 shadow-sm rounded-3xl bg-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#145A41] flex items-center justify-center">
                <CreditCard className="w-7 h-7 text-[#FFD95A]" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Current Plan</div>
                <div className="text-2xl font-black text-gray-900">
                  {currentPlan.name} - ${currentPlan.price}/{isYearly ? "year" : "month"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className={`flex items-center gap-1 text-sm font-bold ${profile?.account_status === "active" ? "text-green-600" : "text-gray-500"}`}>
                  <Activity className="w-4 h-4" /> {profile?.account_status === "active" ? "Active" : "Inactive"}
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  {profile?.account_status === "active"
                    ? `Renews ${renewsAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                    : "No active renewal"}
                </div>
              </div>
              <Button
                variant="outline"
                disabled={isSaving || profile?.subscription_plan === "none"}
                className="border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl"
                onClick={() => void handlePlanChange("none")}
              >
                Cancel Plan
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="flex items-center justify-center gap-4">
        <span className={`text-lg ${!isYearly ? "font-bold text-[#145A41]" : "text-gray-500"}`}>Monthly</span>
        <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-[#145A41]" />
        <span className={`text-lg ${isYearly ? "font-bold text-[#145A41]" : "text-gray-500"}`}>Yearly</span>
        <span className="bg-[#FFD95A] text-[#145A41] px-3 py-1 rounded-full text-sm font-semibold">Save 15%</span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => {
          const isCurrent = profile?.subscription_plan === plan.id;

          return (
            <motion.div key={plan.id} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}>
              <Card className={`p-6 rounded-3xl relative overflow-hidden ${isCurrent ? "border-2 border-[#145A41] shadow-xl ring-4 ring-[#145A41]/10" : plan.popular ? "border-2 border-[#FFD95A] shadow-lg" : "border border-gray-200 shadow-sm"}`}>
                {isCurrent && (
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
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-[#145A41] mt-0.5 flex-shrink-0" /> {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  disabled={isCurrent || isSaving}
                  className={`w-full font-bold rounded-xl ${isCurrent ? "bg-gray-100 text-gray-400" : "bg-[#145A41] hover:bg-[#0B3D2E] text-white"}`}
                  onClick={() => void handlePlanChange(plan.id)}
                >
                  {isCurrent ? "Current Plan" : `Switch to ${plan.name}`}
                  {!isCurrent && <ArrowRight className="ml-2 w-4 h-4" />}
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
