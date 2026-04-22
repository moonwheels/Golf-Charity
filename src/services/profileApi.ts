import { supabase } from "./supabaseClient";

export type AppRole = "member" | "admin";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: AppRole;
  subscription_plan: "none" | "basic" | "premium";
  account_status: "active" | "inactive";
  created_at: string;
  updated_at: string;
};

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as Profile | null) ?? null;
}

export async function updateProfile(
  userId: string,
  payload: Partial<Pick<Profile, "email" | "full_name" | "subscription_plan" | "account_status">>,
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", userId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Profile;
}
