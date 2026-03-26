import { supabase } from "./supabaseClient";
import type { Profile } from "./profileApi";

export type AccountStatus = "active" | "inactive";
export type SubscriptionPlan = "none" | "basic" | "premium";
export type DrawAlgorithm = "standard" | "weighted";
export type ProofStatus = "pending" | "approved";
export type PaymentStatus = "pending" | "paid";

export type AdminUserRecord = Profile;

export type CharityRecord = {
  id: string;
  name: string;
  category: string;
  total_allocated: number;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type DrawConfigurationRecord = {
  id: string;
  draw_date: string;
  prize_pool: number;
  algorithm: DrawAlgorithm;
  last_simulation_summary: string | null;
  last_simulated_at: string | null;
  results_published_at: string | null;
  created_at: string;
  updated_at: string;
};

type WinnerClaimRow = {
  id: string;
  profile_id: string;
  prize: string;
  tier: string;
  proof_status: ProofStatus;
  payment_status: PaymentStatus;
  scorecard: string;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string | null;
    email: string;
  } | null;
};

export type WinnerClaimRecord = {
  id: string;
  profile_id: string;
  prize: string;
  tier: string;
  proof_status: ProofStatus;
  payment_status: PaymentStatus;
  scorecard: string;
  created_at: string;
  updated_at: string;
  winner_name: string;
  winner_email: string;
};

export type AdminAnalytics = {
  totalUsers: number;
  activeSubscriptions: number;
  prizePool: number;
  charityContributions: number;
};

function mapWinnerClaim(row: WinnerClaimRow): WinnerClaimRecord {
  return {
    id: row.id,
    profile_id: row.profile_id,
    prize: row.prize,
    tier: row.tier,
    proof_status: row.proof_status,
    payment_status: row.payment_status,
    scorecard: row.scorecard,
    created_at: row.created_at,
    updated_at: row.updated_at,
    winner_name: row.profiles?.full_name || row.profiles?.email || "Unknown member",
    winner_email: row.profiles?.email || "",
  };
}

export async function fetchAdminUsers(): Promise<AdminUserRecord[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as AdminUserRecord[]) ?? [];
}

export async function updateAdminUser(
  userId: string,
  payload: Pick<AdminUserRecord, "full_name" | "email" | "account_status" | "subscription_plan">,
): Promise<AdminUserRecord> {
  const { error } = await supabase.rpc("admin_update_user_profile", {
    target_user_id: userId,
    next_email: payload.email.trim(),
    next_full_name: payload.full_name ?? "",
    next_account_status: payload.account_status,
    next_subscription_plan: payload.subscription_plan,
  });

  if (error) {
    throw error;
  }

  const { data, error: fetchError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  return data as AdminUserRecord;
}

export async function deleteAdminUser(userId: string): Promise<void> {
  const { error } = await supabase.rpc("admin_delete_user", {
    target_user_id: userId,
  });

  if (error) {
    throw error;
  }
}

export async function fetchCharities(): Promise<CharityRecord[]> {
  const { data, error } = await supabase
    .from("charities")
    .select("*")
    .order("featured", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data as CharityRecord[]) ?? [];
}

export async function saveCharity(
  payload: Pick<
    CharityRecord,
    "id" | "name" | "category" | "total_allocated" | "featured" | "active"
  >,
): Promise<CharityRecord> {
  const { data, error } = await supabase
    .from("charities")
    .upsert(payload)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as CharityRecord;
}

export async function createCharity(
  payload: Pick<CharityRecord, "name" | "category" | "total_allocated" | "featured" | "active">,
): Promise<CharityRecord> {
  const { data, error } = await supabase
    .from("charities")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as CharityRecord;
}

export async function deleteCharity(charityId: string): Promise<void> {
  const { error } = await supabase
    .from("charities")
    .delete()
    .eq("id", charityId);

  if (error) {
    throw error;
  }
}

export async function fetchDrawConfiguration(): Promise<DrawConfigurationRecord | null> {
  const { data, error } = await supabase
    .from("draw_configurations")
    .select("*")
    .eq("id", "primary")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as DrawConfigurationRecord | null) ?? null;
}

export async function saveDrawConfiguration(
  payload: Pick<DrawConfigurationRecord, "draw_date" | "prize_pool" | "algorithm">,
): Promise<DrawConfigurationRecord> {
  const { data, error } = await supabase
    .from("draw_configurations")
    .upsert({
      id: "primary",
      ...payload,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as DrawConfigurationRecord;
}

export async function updateDrawSimulation(
  payload: Pick<
    DrawConfigurationRecord,
    "draw_date" | "prize_pool" | "algorithm" | "last_simulation_summary" | "last_simulated_at"
  >,
): Promise<DrawConfigurationRecord> {
  const { data, error } = await supabase
    .from("draw_configurations")
    .upsert({
      id: "primary",
      results_published_at: null,
      ...payload,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as DrawConfigurationRecord;
}

export async function publishDrawResults(
  payload: Pick<DrawConfigurationRecord, "draw_date" | "prize_pool" | "algorithm">,
): Promise<DrawConfigurationRecord> {
  const { data, error } = await supabase
    .from("draw_configurations")
    .upsert({
      id: "primary",
      ...payload,
      results_published_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as DrawConfigurationRecord;
}

export async function fetchWinnerClaims(): Promise<WinnerClaimRecord[]> {
  const { data, error } = await supabase
    .from("winner_claims")
    .select(`
      id,
      profile_id,
      prize,
      tier,
      proof_status,
      payment_status,
      scorecard,
      created_at,
      updated_at,
      profiles:profiles!winner_claims_profile_id_fkey (
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data as WinnerClaimRow[] | null) ?? []).map(mapWinnerClaim);
}

export async function updateWinnerClaim(
  claimId: string,
  payload: Partial<Pick<WinnerClaimRecord, "proof_status" | "payment_status">>,
): Promise<WinnerClaimRecord> {
  const { data, error } = await supabase
    .from("winner_claims")
    .update(payload)
    .eq("id", claimId)
    .select(`
      id,
      profile_id,
      prize,
      tier,
      proof_status,
      payment_status,
      scorecard,
      created_at,
      updated_at,
      profiles:profiles!winner_claims_profile_id_fkey (
        full_name,
        email
      )
    `)
    .single();

  if (error) {
    throw error;
  }

  return mapWinnerClaim(data as WinnerClaimRow);
}

export async function fetchAdminAnalytics(): Promise<AdminAnalytics> {
  const [usersResult, charitiesResult, drawResult] = await Promise.all([
    supabase.from("profiles").select("id, account_status"),
    supabase.from("charities").select("total_allocated"),
    supabase
      .from("draw_configurations")
      .select("prize_pool")
      .eq("id", "primary")
      .maybeSingle(),
  ]);

  if (usersResult.error) {
    throw usersResult.error;
  }

  if (charitiesResult.error) {
    throw charitiesResult.error;
  }

  if (drawResult.error) {
    throw drawResult.error;
  }

  const users = usersResult.data ?? [];
  const charities = charitiesResult.data ?? [];

  return {
    totalUsers: users.length,
    activeSubscriptions: users.filter((user) => user.account_status === "active").length,
    prizePool: Number(drawResult.data?.prize_pool ?? 0),
    charityContributions: charities.reduce(
      (sum, charity) => sum + Number(charity.total_allocated ?? 0),
      0,
    ),
  };
}
