import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Card } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [charityContribution, setCharityContribution] = useState(20);

  const plans = [
    {
      name: "Starter",
      price: isYearly ? 99 : 9,
      description: "Perfect for casual golfers",
      features: [
        "Score tracking",
        "Monthly challenges",
        "Basic analytics",
        "1 charity selection",
        "Email support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: isYearly ? 249 : 25,
      description: "For dedicated players",
      features: [
        "Everything in Starter",
        "Advanced analytics",
        "Unlimited challenges",
        "3 charity selections",
        "Priority support",
        "Exclusive tournaments",
        "Merchandise discounts",
      ],
      cta: "Go Pro",
      popular: true,
    },
    {
      name: "Elite",
      price: isYearly ? 499 : 49,
      description: "For the serious competitor",
      features: [
        "Everything in Pro",
        "Personal coach access",
        "VIP tournament entry",
        "Unlimited charity selections",
        "24/7 concierge support",
        "Partner golf course access",
        "Premium merchandise",
        "Annual charity event invitation",
      ],
      cta: "Go Elite",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-br from-[#065f46] to-[#047857] relative">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Choose Your Impact
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Every plan helps support charities. The more you invest, the more impact you create.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Toggle */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex items-center justify-center gap-4 mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className={`text-lg ${!isYearly ? "font-bold text-[#065f46]" : "text-gray-500"}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-[#065f46]"
            />
            <span className={`text-lg ${isYearly ? "font-bold text-[#065f46]" : "text-gray-500"}`}>
              Yearly
            </span>
            <span className="bg-[#facc15] text-[#065f46] px-3 py-1 rounded-full text-sm font-semibold">
              Save 15%
            </span>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
              >
                <Card
                  className={`p-8 rounded-3xl relative overflow-hidden ${
                    plan.popular
                      ? "border-4 border-[#facc15] shadow-2xl"
                      : "border-2 border-gray-200 shadow-lg"
                  } hover:shadow-2xl transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-[#facc15] text-[#065f46] px-6 py-2 rounded-bl-2xl font-bold">
                      Best Value
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-3xl font-bold text-[#065f46] mb-2">{plan.name}</h3>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-[#065f46]">${plan.price}</span>
                      <span className="text-gray-600">/{isYearly ? "year" : "month"}</span>
                    </div>
                  </div>

                  <div className="mb-8">
                    <ul className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-[#065f46] flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link to="/auth">
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-[#065f46] hover:bg-[#047857] text-white"
                          : "bg-white border-2 border-[#065f46] text-[#065f46] hover:bg-[#065f46] hover:text-white"
                      } font-bold text-lg py-6 group`}
                    >
                      {plan.cta}{" "}
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charity Contribution Calculator */}
          <motion.div
            className="max-w-4xl mx-auto bg-[#facc15] rounded-3xl p-12"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold text-[#065f46] mb-6 text-center">
              Your Charity Impact
            </h3>
            <p className="text-[#065f46]/80 mb-8 text-center text-lg">
              Choose how much of your subscription goes to charity
            </p>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <Label className="text-[#065f46] text-xl font-semibold">
                  Charity Contribution
                </Label>
                <span className="text-4xl font-bold text-[#065f46]">{charityContribution}%</span>
              </div>
              <Slider
                value={[charityContribution]}
                onValueChange={(value) => setCharityContribution(value[0])}
                min={10}
                max={50}
                step={5}
                className="mb-6"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl font-bold text-[#065f46] mb-2">
                  ${((25 * charityContribution) / 100).toFixed(2)}
                </div>
                <div className="text-[#065f46]/80">Per month (Pro Plan)</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl font-bold text-[#065f46] mb-2">
                  ${(((25 * charityContribution) / 100) * 12).toFixed(2)}
                </div>
                <div className="text-[#065f46]/80">Per year</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl font-bold text-[#065f46] mb-2">
                  {Math.floor(((25 * charityContribution) / 100) * 12 / 5)}
                </div>
                <div className="text-[#065f46]/80">Lives impacted</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-bold text-[#065f46] mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                q: "Can I change my plan later?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
              },
              {
                q: "Which charities can I support?",
                a: "We partner with 50+ verified charities across education, healthcare, environment, and community development. You can change your charity selection anytime.",
              },
              {
                q: "How do I know my contribution is making an impact?",
                a: "We provide quarterly impact reports showing exactly where your contributions went and the outcomes achieved. Plus, you'll receive updates from your chosen charities.",
              },
              {
                q: "What happens if I cancel?",
                a: "You can cancel anytime. You'll continue to have access until the end of your billing period, and your final contribution will still go to your chosen charity.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <h4 className="text-xl font-bold text-[#065f46] mb-3">{faq.q}</h4>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}