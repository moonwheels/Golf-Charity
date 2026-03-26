import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Slider } from "../../components/ui/slider";
import { toast } from "sonner";
import { Search, Heart, Globe, BookOpen, Activity, CheckCircle2, Users, ShieldCheck } from "lucide-react";

const CHARITIES = [
  { id: "featured-1", name: "Global Education Initiative", description: "Bringing quality education and safe learning environments to children in rural communities worldwide.", category: "Education", image: "https://images.unsplash.com/photo-1759143103540-78298031a86a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWlsaW5nJTIwY2hpbGRyZW4lMjBzY2hvb2wlMjBydXJhbHxlbnwxfHx8fDE3NzQ1MjI1NTR8MA&ixlib=rb-4.1.0&q=80&w=1080", featured: true },
  { id: "charity-2", name: "Clean Water Access", description: "Providing sustainable, clean drinking water to remote villages across Africa.", category: "Environment", image: "https://images.unsplash.com/photo-1524581855427-4f2d2026a0f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMHdhdGVyJTIwdmlsbGFnZSUyMGFmcmljYXxlbnwxfHx8fDE3NzQ1MjI1NTR8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "charity-3", name: "Forest Restoration Fund", description: "Combating climate change by planting millions of native trees.", category: "Environment", image: "https://images.unsplash.com/photo-1760624683181-7570791efd52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudGluZyUyMHRyZWVzJTIwZm9yZXN0JTIwY29uc2VydmF0aW9ufGVufDF8fHx8MTc3NDUyMjU1NHww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "charity-4", name: "Community Food Network", description: "Distributing nutritious meals to families facing food insecurity.", category: "Community", image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwYmFuayUyMGRpc3RyaWJ1dGlvbiUyMHZvbHVudGVlcnxlbnwxfHx8fDE3NzQ1MjI1NTR8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "charity-5", name: "Mobile Health Clinics", description: "Delivering essential healthcare to underserved areas.", category: "Healthcare", image: "https://images.unsplash.com/photo-1589104759909-e355f8999f7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdm9sdW50ZWVycyUyMGNsaW5pY3xlbnwxfHx8fDE3NzQ1MjI1NTV8MA&ixlib=rb-4.1.0&q=80&w=1080" },
];

const CATEGORIES = [
  { id: "All", icon: Globe },
  { id: "Education", icon: BookOpen },
  { id: "Environment", icon: Globe },
  { id: "Community", icon: Users },
  { id: "Healthcare", icon: Activity },
];

export function Charity() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCharity, setSelectedCharity] = useState<string>("featured-1");
  const [contributionPercent, setContributionPercent] = useState<number[]>([15]);

  const filteredCharities = CHARITIES.filter(charity => {
    const matchesSearch = charity.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || charity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSave = () => {
    toast.success("Charity preferences saved!", {
      description: `Directing ${contributionPercent[0]}% to ${CHARITIES.find(c => c.id === selectedCharity)?.name}.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
          Charity Selection
        </h1>
        <p className="text-lg text-gray-500 font-medium">
          Choose a cause and set your contribution rate.
        </p>
      </motion.div>

      {/* Contribution Settings */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
        <Card className="p-8 bg-white rounded-3xl shadow-sm border-0 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#145A41]" /> Your Contribution Rate
              </h3>
              <span className="text-3xl font-black text-[#145A41]">{contributionPercent[0]}%</span>
            </div>
            <p className="text-gray-500 text-sm mb-6 font-medium">Minimum 10% of your monthly fee goes to charity.</p>
            <Slider value={contributionPercent} onValueChange={(v) => setContributionPercent(v[0] < 10 ? [10] : v)} max={100} step={1} className="py-4" />
          </div>
          <div className="hidden md:block w-px h-24 bg-gray-100"></div>
          <div className="flex-shrink-0 w-full md:w-auto text-center md:text-right">
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Currently Supporting</div>
            <div className="text-lg font-bold text-gray-900 mb-4 truncate max-w-[250px]">
              {CHARITIES.find(c => c.id === selectedCharity)?.name || "Select a charity"}
            </div>
            <Button onClick={handleSave} className="w-full md:w-auto bg-[#FFD95A] hover:bg-[#F4C430] text-[#145A41] font-extrabold px-8 py-6 rounded-xl shadow-lg text-lg">
              Save Preferences
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  selectedCategory === cat.id ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" /> {cat.id}
              </button>
            );
          })}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input placeholder="Search charities..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-white border-gray-200 rounded-xl h-11" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCharities.map((charity) => (
            <motion.div key={charity.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}>
              <Card
                className={`h-full flex flex-col overflow-hidden rounded-3xl cursor-pointer group transition-all duration-300 ${
                  selectedCharity === charity.id
                    ? 'border-2 border-[#145A41] ring-4 ring-[#145A41]/10 shadow-lg'
                    : 'border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 bg-white'
                }`}
                onClick={() => setSelectedCharity(charity.id)}
              >
                <div className="h-48 relative overflow-hidden">
                  <img src={charity.image} alt={charity.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold rounded-lg uppercase tracking-wider shadow-sm">{charity.category}</div>
                  </div>
                  {selectedCharity === charity.id && (
                    <div className="absolute top-4 right-4 bg-[#145A41] text-white p-2 rounded-full shadow-lg">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{charity.name}</h3>
                  <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-3">{charity.description}</p>
                  <Button
                    variant={selectedCharity === charity.id ? "default" : "outline"}
                    className={`w-full font-bold rounded-xl h-11 ${
                      selectedCharity === charity.id ? 'bg-[#145A41] hover:bg-[#0B3D2E] text-white' : 'border-gray-200 text-gray-700'
                    }`}
                    onClick={(e) => { e.stopPropagation(); setSelectedCharity(charity.id); }}
                  >
                    {selectedCharity === charity.id ? "Selected" : "Select Charity"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredCharities.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-500 font-medium bg-white rounded-3xl border border-gray-200">
            <Globe className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            No charities found.
          </div>
        )}
      </div>
    </div>
  );
}
