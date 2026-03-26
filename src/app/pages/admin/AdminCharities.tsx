import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  createCharity,
  deleteCharity,
  fetchCharities,
  saveCharity,
  type CharityRecord,
} from "../../../services/adminApi";
import { supabase } from "../../../services/supabaseClient";

type CharityForm = {
  id: string;
  name: string;
  category: string;
  totalAllocated: string;
  featured: boolean;
  active: boolean;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function getEmptyCharity(): CharityForm {
  return {
    id: "",
    name: "",
    category: "",
    totalAllocated: "0",
    featured: false,
    active: true,
  };
}

function mapCharityToForm(charity: CharityRecord): CharityForm {
  return {
    id: charity.id,
    name: charity.name,
    category: charity.category,
    totalAllocated: String(charity.total_allocated),
    featured: charity.featured,
    active: charity.active,
  };
}

export function AdminCharities() {
  const [charities, setCharities] = useState<CharityRecord[]>([]);
  const [editingCharity, setEditingCharity] = useState<CharityForm | null>(null);
  const [deletingCharity, setDeletingCharity] = useState<CharityRecord | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadCharities = async () => {
      try {
        const nextCharities = await fetchCharities();
        setCharities(nextCharities);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load charities.";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadCharities();

    const channel: RealtimeChannel = supabase
      .channel("admin-charities")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "charities" },
        () => void loadCharities(),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const openCreateDialog = () => {
    setIsCreating(true);
    setEditingCharity(getEmptyCharity());
  };

  const updateEditingCharity = (
    field: keyof CharityForm,
    value: string | boolean,
  ) => {
    setEditingCharity((current) => (current ? { ...current, [field]: value } : current));
  };

  const persistCharity = async () => {
    if (!editingCharity) return;
    if (!editingCharity.name.trim() || !editingCharity.category.trim()) {
      toast.error("Name and category are required.");
      return;
    }

    const totalAllocated = Number(editingCharity.totalAllocated || 0);
    if (Number.isNaN(totalAllocated) || totalAllocated < 0) {
      toast.error("Total allocated must be a valid positive amount.");
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        name: editingCharity.name.trim(),
        category: editingCharity.category.trim(),
        total_allocated: totalAllocated,
        featured: editingCharity.featured,
        active: editingCharity.active,
      };

      const savedCharity = isCreating
        ? await createCharity(payload)
        : await saveCharity({
            id: editingCharity.id,
            ...payload,
          });

      setCharities((current) => {
        const exists = current.some((charity) => charity.id === savedCharity.id);
        if (exists) {
          return current.map((charity) =>
            charity.id === savedCharity.id ? savedCharity : charity,
          );
        }

        return [savedCharity, ...current];
      });

      toast.success(isCreating ? "Charity added." : "Charity updated.");
      setEditingCharity(null);
      setIsCreating(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save charity.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const removeCharity = async () => {
    if (!deletingCharity) return;

    setIsDeleting(true);

    try {
      await deleteCharity(deletingCharity.id);
      setCharities((current) =>
        current.filter((charity) => charity.id !== deletingCharity.id),
      );
      setDeletingCharity(null);
      toast.success("Charity removed.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete charity.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Charity Management</h1>
          <p className="text-gray-500 font-medium">Add, edit, or remove partner organizations.</p>
        </div>
        <Button className="bg-[#145A41] hover:bg-[#0B3D2E] text-white font-bold rounded-xl h-11 px-6 shadow-sm" onClick={openCreateDialog}>
          + Add New Charity
        </Button>
      </div>

      <Card className="border-0 shadow-sm rounded-3xl bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Organization</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total Allocated</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm font-medium text-gray-500">
                    Loading charities...
                  </td>
                </tr>
              ) : null}
              {!isLoading && charities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm font-medium text-gray-500">
                    No charities have been added yet.
                  </td>
                </tr>
              ) : null}
              {charities.map((charity) => (
                <tr key={charity.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 flex items-center gap-2">
                      {charity.name}
                      {charity.featured ? <span className="px-2 py-0.5 bg-[#FFD95A]/20 text-[#D4AF37] text-[10px] uppercase rounded-md font-bold">Featured</span> : null}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">{charity.category}</td>
                  <td className="px-6 py-4 font-bold text-[#145A41]">{currencyFormatter.format(charity.total_allocated)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${charity.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {charity.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#145A41]" onClick={() => { setIsCreating(false); setEditingCharity(mapCharityToForm(charity)); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500" onClick={() => setDeletingCharity(charity)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={Boolean(editingCharity)} onOpenChange={(open) => { if (!open) { setEditingCharity(null); setIsCreating(false); } }}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{isCreating ? "Add Charity" : "Edit Charity"}</DialogTitle>
            <DialogDescription>Manage organization details and visibility in the member portal.</DialogDescription>
          </DialogHeader>

          {editingCharity ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Organization Name</label>
                <Input value={editingCharity.name} onChange={(event) => updateEditingCharity("name", event.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Category</label>
                  <Input value={editingCharity.category} onChange={(event) => updateEditingCharity("category", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Total Allocated</label>
                  <Input type="number" min="0" value={editingCharity.totalAllocated} onChange={(event) => updateEditingCharity("totalAllocated", event.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700">
                  <input type="checkbox" checked={editingCharity.featured} onChange={(event) => updateEditingCharity("featured", event.target.checked)} />
                  Featured charity
                </label>
                <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700">
                  <input type="checkbox" checked={editingCharity.active} onChange={(event) => updateEditingCharity("active", event.target.checked)} />
                  Active listing
                </label>
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditingCharity(null); setIsCreating(false); }}>Cancel</Button>
            <Button className="bg-[#145A41] hover:bg-[#0B3D2E] text-white" onClick={() => void persistCharity()} disabled={isSaving}>
              {isSaving ? "Saving..." : isCreating ? "Add Charity" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deletingCharity)} onOpenChange={(open) => !open && setDeletingCharity(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Charity</DialogTitle>
            <DialogDescription>Remove {deletingCharity?.name} from the partner list?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingCharity(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => void removeCharity()} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Charity"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
