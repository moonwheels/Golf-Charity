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
        <Card className="p-8 bg-white rounded-3xl shadow-sm border-0 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#145A41]" /> Your Contribution Rate
              </h3>
              <span className="text-3xl font-black text-[#145A41]">
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

          <div className="hidden md:block w-px h-24 bg-gray-100"></div>

          <div className="flex-shrink-0 w-full md:w-auto text-center md:text-right">
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
              Currently Supporting
            </div>
            <div className="text-lg font-bold text-gray-900 mb-4 truncate max-w-[250px]">
              {selectedCharityRecord?.name || "Select a charity"}
            </div>
            <Button
              onClick={() => void handleSave()}
              disabled={isLoading || isSaving || charities.length === 0}
              className="w-full md:w-auto bg-[#FFD95A] hover:bg-[#F4C430] text-[#145A41] font-extrabold px-8 py-6 rounded-xl shadow-lg text-lg"
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
        </Card>
      </motion.div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
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

        <div className="relative w-full md:w-72">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        ? "border-2 border-[#145A41] ring-4 ring-[#145A41]/10 shadow-lg"
                        : "border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 bg-white"
                    }`}
                    onClick={() => setSelectedCharity(charity.id)}
                  >
                    <div className="h-32 relative overflow-hidden bg-gradient-to-br from-[#145A41] to-[#0B3D2E] p-6 text-white flex items-end">
                      <div className="absolute top-4 left-4">
                        <div className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-xs font-bold rounded-lg uppercase tracking-wider shadow-sm">
                          {charity.category}
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        {charity.featured ? (
                          <div className="bg-[#FFD95A] text-[#145A41] p-2 rounded-full shadow-lg">
                            <Star className="w-4 h-4 fill-current" />
                          </div>
                        ) : null}
                        {isSelected ? (
                          <div className="bg-white text-[#145A41] p-2 rounded-full shadow-lg">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        ) : null}
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-[#FFD95A]" />
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{charity.name}</h3>
                      <p className="text-gray-500 text-sm mb-6 flex-1">
                        Active GolfGive charity partner in the {charity.category.toLowerCase()} category.
                      </p>
                      <Button
                        variant={isSelected ? "default" : "outline"}
                        className={`w-full font-bold rounded-xl h-11 ${
                          isSelected
                            ? "bg-[#145A41] hover:bg-[#0B3D2E] text-white"
                            : "border-gray-200 text-gray-700"
                        }`}
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedCharity(charity.id);
                        }}
                      >
                        {isSelected ? "Selected" : "Select Charity"}
                      </Button>
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
