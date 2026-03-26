import { motion } from "motion/react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Save, User, Mail, Shield } from "lucide-react";
import { toast } from "sonner";

export function DashboardProfile() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Profile Settings</h1>
        <p className="text-gray-500 font-medium mt-2">Update your personal details and security preferences.</p>
      </motion.div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
        <Card className="p-8 border-0 shadow-sm rounded-3xl bg-white">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <User className="w-5 h-5 text-[#145A41]" /> Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">First Name</label>
                  <Input defaultValue="Alex" className="bg-gray-50 border-gray-200 h-12 rounded-xl" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Last Name</label>
                  <Input defaultValue="Thompson" className="bg-gray-50 border-gray-200 h-12 rounded-xl" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email Address
                </label>
                <Input defaultValue="alex.thompson@example.com" type="email" className="bg-gray-50 border-gray-200 h-12 rounded-xl" />
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Shield className="w-5 h-5 text-[#145A41]" /> Security
              </h3>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Current Password</label>
                <Input type="password" placeholder="••••••••" className="bg-gray-50 border-gray-200 h-12 rounded-xl" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">New Password</label>
                  <Input type="password" placeholder="••••••••" className="bg-gray-50 border-gray-200 h-12 rounded-xl" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Confirm Password</label>
                  <Input type="password" placeholder="••••••••" className="bg-gray-50 border-gray-200 h-12 rounded-xl" />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button type="submit" className="w-full bg-[#145A41] hover:bg-[#0B3D2E] text-white font-bold h-12 rounded-xl text-lg shadow-lg">
                <Save className="w-5 h-5 mr-2" /> Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
