import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, Edit, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  deleteAdminUser,
  fetchAdminUsers,
  updateAdminUser,
  type AdminUserRecord,
} from "../../../services/adminApi";
import { supabase } from "../../../services/supabaseClient";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function AdminUsers() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<AdminUserRecord | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUserRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const nextUsers = await fetchAdminUsers();
        setUsers(nextUsers);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load users.";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadUsers();

    const channel: RealtimeChannel = supabase
      .channel("admin-users")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => void loadUsers(),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;

    return users.filter(
      (user) =>
        (user.full_name || "").toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.subscription_plan.toLowerCase().includes(term),
    );
  }, [search, users]);

  const updateEditingUser = (
    field: keyof Pick<AdminUserRecord, "full_name" | "email" | "account_status" | "subscription_plan">,
    value: string,
  ) => {
    setEditingUser((current) =>
      current ? { ...current, [field]: value } : current,
    );
  };

  const saveUser = async () => {
    if (!editingUser) return;
    if (!editingUser.email.trim()) {
      toast.error("Email is required.");
      return;
    }

    setIsSaving(true);

    try {
      const savedUser = await updateAdminUser(editingUser.id, {
        full_name: editingUser.full_name,
        email: editingUser.email.trim(),
        account_status: editingUser.account_status,
        subscription_plan: editingUser.subscription_plan,
      });

      setUsers((current) =>
        current.map((user) => (user.id === savedUser.id ? savedUser : user)),
      );
      setEditingUser(null);
      toast.success("User details updated.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update user.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteUser = async () => {
    if (!deletingUser) return;

    setIsDeleting(true);

    try {
      await deleteAdminUser(deletingUser.id);
      setUsers((current) =>
        current.filter((user) => user.id !== deletingUser.id),
      );
      setDeletingUser(null);
      toast.success("User removed from the platform.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete user.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-500 font-medium">Manage subscribers, view details, and edit statuses.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-10 w-full md:w-80 bg-white border-gray-200 rounded-xl"
          />
        </div>
      </div>

      <Card className="border-0 shadow-sm rounded-3xl bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm font-medium text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : null}
              {!isLoading && filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm font-medium text-gray-500">
                    No users found yet.
                  </td>
                </tr>
              ) : null}
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{user.full_name || "Unnamed member"}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${user.account_status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {user.account_status === "active" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                      {user.account_status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 capitalize">{user.subscription_plan}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{dateFormatter.format(new Date(user.created_at))}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#145A41]" onClick={() => setEditingUser(user)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500" onClick={() => setDeletingUser(user)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={Boolean(editingUser)} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update subscription details and account status.</DialogDescription>
          </DialogHeader>

          {editingUser ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Name</label>
                <Input value={editingUser.full_name ?? ""} onChange={(event) => updateEditingUser("full_name", event.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Email</label>
                <Input value={editingUser.email} onChange={(event) => updateEditingUser("email", event.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Status</label>
                  <select
                    className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm"
                    value={editingUser.account_status}
                    onChange={(event) => updateEditingUser("account_status", event.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Plan</label>
                  <select
                    className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm"
                    value={editingUser.subscription_plan}
                    onChange={(event) => updateEditingUser("subscription_plan", event.target.value)}
                  >
                    <option value="premium">Premium</option>
                    <option value="basic">Basic</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
            <Button className="bg-[#145A41] hover:bg-[#0B3D2E] text-white" onClick={() => void saveUser()} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deletingUser)} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>Remove {deletingUser?.full_name || deletingUser?.email} from the platform?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingUser(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => void deleteUser()} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
