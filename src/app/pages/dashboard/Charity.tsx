import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Slider } from "../../components/ui/slider";
import { toast } from "sonner";
import { useAuth } from "../../../hooks/useAuth";
import { useMemberCharityPreference } from "../../../hooks/useMemberCharityPreference";
import {
  Search,
  Heart,
  Globe,
  BookOpen,
  Activity,
  CheckCircle2,
  Users,
  ShieldCheck,
  Loader2,
  Star,
} from "lucide-react";

function getCategoryIcon(category: string) {
  switch (category.toLowerCase()) {
    case "education":
      return BookOpen;
    case "community":
      return Users;
    case "healthcare":
      return Activity;
    case "environment":
      return Globe;
    default:
      return Heart;
  }
}

export function Charity() {
  const { user } = useAuth();
  const { charities, preference, isLoading, isSaving, error, savePreference } =
    useMemberCharityPreference(user?.id);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCharity, setSelectedCharity] = useState("");
  const [contributionPercent, setContributionPercent] = useState<number[]>([15]);

  useEffect(() => {
    if (preference) {
      setSelectedCharity(preference.charity_id);
      setContributionPercent([preference.contribution_percentage]);
      return;
    }

    if (!selectedCharity && charities.length > 0) {
      const defaultCharity = charities.find((charity) => charity.featured) ?? charities[0];
      setSelectedCharity(defaultCharity.id);
    }
  }, [charities, preference, selectedCharity]);

  const categories = [
    { id: "All", icon: Globe },
    ...Array.from(new Set(charities.map((charity) => charity.category))).map((category) => ({
      id: category,
      icon: getCategoryIcon(category),
    })),
  ];

  const filteredCharities = charities.filter((charity) => {
    const matchesSearch = charity.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || charity.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const selectedCharityRecord =
    charities.find((charity) => charity.id === selectedCharity) ??
    preference?.charity ??
    null;

  const handleSave = async () => {
    if (!user?.id) {
      toast.error("You need to be signed in to save charity preferences.");
      return;
    }

    if (!selectedCharity) {
      toast.error("Choose a charity before saving.");
      return;
    }

    const nextContributionPercentage = Math.max(10, contributionPercent[0] ?? 10);

    try {
      const savedPreference = await savePreference({
        profile_id: user.id,
        charity_id: selectedCharity,
        contribution_percentage: nextContributionPercentage,
      });

      setSelectedCharity(savedPreference.charity_id);
      setContributionPercent([savedPreference.contribution_percentage]);

      toast.success("Charity preferences saved.", {
        description: `Directing ${savedPreference.contribution_percentage}% to ${savedPreference.charity?.name ?? "your selected charity"}.`,
      });
    } catch (saveError) {
      toast.error(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save your charity preferences.",
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
          Charity Selection
        </h1>
        <p className="text-lg text-gray-500 font-medium">
          Choose your active charity partner and the percentage of your membership that goes to them.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Card className="rounded-3xl border-0 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#145A41]" /> Your Contribution Rate
              </h3>
              <span className="text-2xl sm:text-3xl font-black text-[#145A41]">
                {contributionPercent[0]}%
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-6 font-medium">
              GolfGive enforces a minimum 10% contribution rate for every member.
            </p>
            <Slider
              value={contributionPercent}
              onValueChange={(value) => setContributionPercent([Math.max(10, value[0] ?? 10)])}
              min={10}
              max={100}
              step={1}
              className="py-4"
            />
            </div>

            <div className="hidden lg:block w-px h-24 bg-gray-100"></div>

            <div className="w-full rounded-2xl bg-[#F7F8F7] px-4 py-4 text-left sm:px-5 lg:max-w-sm lg:min-w-[280px]">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-[0.18em] mb-2">
                Currently Supporting
              </div>
              <div className="text-base sm:text-lg font-bold text-gray-900 leading-snug break-words">
                {selectedCharityRecord?.name || "Select a charity"}
              </div>
              {selectedCharityRecord ? (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#145A41]/10 px-3 py-1.5 text-xs font-bold text-[#145A41]">
                  <CheckCircle2 className="h-4 w-4" />
                  Selected charity
                </div>
              ) : null}
              <Button
                onClick={() => void handleSave()}
                disabled={isLoading || isSaving || charities.length === 0}
                className="mt-4 w-full bg-[#FFD95A] hover:bg-[#F4C430] text-[#145A41] font-extrabold rounded-xl h-12 text-sm sm:text-base"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Preferences"
                )}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all sm:px-5 ${
                  selectedCategory === category.id
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" /> {category.id}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search charities..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="pl-10 bg-white border-gray-200 rounded-xl h-11"
          />
        </div>
      </div>

      {isLoading ? (
        <Card className="p-10 text-center rounded-3xl border border-gray-200">
          <div className="inline-flex items-center text-gray-500 font-medium">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Loading active charity partners...
          </div>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredCharities.map((charity) => {
              const Icon = getCategoryIcon(charity.category);
              const isSelected = selectedCharity === charity.id;

              return (
                <motion.div
                  key={charity.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className={`h-full flex flex-col overflow-hidden rounded-3xl cursor-pointer group transition-all duration-300 ${
                      isSelected
                        ? "border-2 border-[#145A41] ring-2 ring-[#145A41]/10 shadow-lg bg-[#FCFDFB]"
                        : "border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 bg-white"
                    }`}
                    onClick={() => setSelectedCharity(charity.id)}
                  >
                    <div className="relative flex h-32 items-end overflow-hidden bg-gradient-to-br from-[#145A41] to-[#0B3D2E] p-5 sm:p-6 text-white">
                      <div className="absolute left-4 top-4">
                        <div className="rounded-lg bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md shadow-sm">
                          {charity.category}
                        </div>
                      </div>
                      <div className="absolute right-4 top-4 flex items-center gap-2">
                        {charity.featured ? (
                          <div className="bg-[#FFD95A] text-[#145A41] p-2 rounded-full shadow-lg">
                            <Star className="w-4 h-4 fill-current" />
                          </div>
                        ) : null}
                        {isSelected ? (
                          <div className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-[#145A41] shadow-sm">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Selected
                          </div>
                        ) : null}
                      </div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                        <Icon className="w-7 h-7 text-[#FFD95A]" />
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <h3 className="mb-3 text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                        {charity.name}
                      </h3>
                      <p className="mb-5 flex-1 text-sm leading-6 text-gray-500">
                        Active GolfGive charity partner in the {charity.category.toLowerCase()} category.
                      </p>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                          {charity.featured ? "Featured partner" : "Charity partner"}
                        </span>
                        <Button
                          variant={isSelected ? "default" : "outline"}
                          className={`h-10 rounded-xl px-4 text-sm font-bold ${
                            isSelected
                              ? "bg-[#145A41] hover:bg-[#0B3D2E] text-white"
                              : "border-gray-200 text-gray-700"
                          }`}
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedCharity(charity.id);
                          }}
                        >
                          {isSelected ? "Currently Selected" : "Select"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredCharities.length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-500 font-medium bg-white rounded-3xl border border-gray-200">
              <Globe className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              No active charities matched your filters.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
