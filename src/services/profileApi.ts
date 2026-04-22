import { supabase } from "./supabaseClient";

export type AppRole = "member" | "admin";
export type SubscriptionPlan = "none" | "basic" | "premium";
export type AccountStatus = "active" | "inactive";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: AppRole;
  subscription_plan: SubscriptionPlan;
  account_status: AccountStatus;
  created_at: string;
  updated_at: string;
};

export type ProfileUpdatePayload = Partial<
  Pick<Profile, "email" | "full_name">
>;

export function hasActiveSubscription(
  profile: Pick<Profile, "subscription_plan" | "account_status"> | null | undefined,
) {
  return Boolean(
    profile &&
      profile.subscription_plan !== "none" &&
      profile.account_status === "active",
  );
}

export function getDefaultAuthenticatedPath(
  profile:
    | Pick<Profile, "role" | "subscription_plan" | "account_status">
    | null
    | undefined,
) {
  if (profile?.role === "admin") {
    return "/admin";
  }

  return hasActiveSubscription(profile) ? "/dashboard" : "/dashboard/subscription";
}

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
  payload: ProfileUpdatePayload,
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
