import { useEffect, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Save, User, Mail, Shield } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { updateProfile } from "../../../services/profileApi";
import { updateCurrentUser } from "../../../services/supabaseAuth";

export function DashboardProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fullName = profile?.full_name || user?.user_metadata?.full_name || "";
    const [nextFirstName = "", ...rest] = fullName.trim().split(/\s+/).filter(Boolean);

    setFirstName(nextFirstName);
    setLastName(rest.join(" "));
    setEmail(profile?.email || user?.email || "");
  }, [profile?.email, profile?.full_name, user?.email, user?.user_metadata]);

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();

    if (!user?.id) {
      toast.error("You need to be signed in to update your profile.");
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedFullName = `${firstName} ${lastName}`.trim();

    if (!trimmedEmail) {
      toast.error("Email is required.");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation must match.");
      return;
    }

    setIsSaving(true);

    try {
      await updateCurrentUser({
        email: trimmedEmail !== user.email ? trimmedEmail : undefined,
        password: newPassword || undefined,
        fullName: trimmedFullName,
      });

      await updateProfile(user.id, {
        email: trimmedEmail,
        full_name: trimmedFullName || null,
      });

      await refreshProfile();
      setNewPassword("");
      setConfirmPassword("");

      toast.success(
        newPassword
          ? "Profile and password updated successfully."
          : "Profile updated successfully.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update your profile.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Profile Settings
        </h1>
        <p className="text-gray-500 font-medium mt-2">
          Update your personal details and security preferences.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Card className="p-8 border-0 shadow-sm rounded-3xl bg-white">
          <form onSubmit={(event) => void handleSave(event)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <User className="w-5 h-5 text-[#145A41]" /> Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                    First Name
                  </label>
                  <Input
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    className="bg-gray-50 border-gray-200 h-12 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                    Last Name
                  </label>
                  <Input
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    className="bg-gray-50 border-gray-200 h-12 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email Address
                </label>
                <Input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  className="bg-gray-50 border-gray-200 h-12 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Shield className="w-5 h-5 text-[#145A41]" /> Security
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="Enter a new password"
                    className="bg-gray-50 border-gray-200 h-12 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm the new password"
                    className="bg-gray-50 border-gray-200 h-12 rounded-xl"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Leave the password fields blank if you only want to update your profile details.
              </p>
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full bg-[#145A41] hover:bg-[#0B3D2E] text-white font-bold h-12 rounded-xl text-lg shadow-lg"
              >
                <Save className="w-5 h-5 mr-2" /> {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
