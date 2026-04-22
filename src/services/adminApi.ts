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

function generateWinningNumbers(): number[] {
  const nums = new Set<number>();
  while (nums.size < 5) {
    nums.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(nums);
}

export async function updateDrawSimulation(
  payload: Pick<
    DrawConfigurationRecord,
    "draw_date" | "prize_pool" | "algorithm" | "last_simulation_summary" | "last_simulated_at"
  >,
): Promise<DrawConfigurationRecord> {
  // Real Simulation Engine
  const usersResult = await supabase.from("profiles").select("id").eq("account_status", "active");
  const scoresResult = await supabase.from("scores").select("profile_id, score");

  const validProfileIds = new Set((usersResult.data ?? []).map((p) => p.id));
  const entriesByProfile = new Map<string, number[]>();

  for (const row of scoresResult.data ?? []) {
    if (validProfileIds.has(row.profile_id)) {
      if (!entriesByProfile.has(row.profile_id)) {
        entriesByProfile.set(row.profile_id, []);
      }
      entriesByProfile.get(row.profile_id)!.push(row.score);
    }
  }

  const winningNumbers = generateWinningNumbers();
  let m5 = 0; let m4 = 0; let m3 = 0;

  Array.from(entriesByProfile.values()).forEach((scores) => {
    const matches = scores.filter((s) => winningNumbers.includes(s)).length;
    if (matches === 5) m5++;
    if (matches === 4) m4++;
    if (matches >= 3 && matches < 4) m3++;
  });

  const summary = `Simulated 5 numbers. Entries: ${entriesByProfile.size}. Expected Winners: 5-Match (${m5}), 4-Match (${m4}), 3-Match (${m3}).`;

  const { data, error } = await supabase
    .from("draw_configurations")
    .upsert({
      id: "primary",
      results_published_at: null,
      ...payload,
      last_simulation_summary: summary,
      last_simulated_at: new Date().toISOString(),
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
  // 1. Run actual generation
  const usersResult = await supabase.from("profiles").select("id").eq("account_status", "active");
  const scoresResult = await supabase.from("scores").select("profile_id, score, played_on");

  const validProfileIds = new Set((usersResult.data ?? []).map((p) => p.id));
  const entriesByProfile = new Map<string, { scores: number[]; dates: string[] }>();

  for (const row of scoresResult.data ?? []) {
    if (validProfileIds.has(row.profile_id)) {
      if (!entriesByProfile.has(row.profile_id)) {
        entriesByProfile.set(row.profile_id, { scores: [], dates: [] });
      }
      const entry = entriesByProfile.get(row.profile_id)!;
      if (entry.scores.length < 5) {
        entry.scores.push(row.score);
        entry.dates.push(row.played_on);
      }
    }
  }

  const winningNumbers = generateWinningNumbers();

  // 2. Create Draw Period
  const today = new Date();
  const periodStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
  const periodEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0];
  
  const drawPdRes = await supabase.from("draw_periods").insert({
    title: `Monthly Draw - ${today.toLocaleString('default', { month: 'long', year: 'numeric' })}`,
    period_start: periodStart,
    period_end: periodEnd,
    draw_date: payload.draw_date,
    status: 'drawn',
    published_at: new Date().toISOString()
  }).select("*").single();

  if (drawPdRes.error) throw drawPdRes.error;
  const periodId = drawPdRes.data.id;

  // 3. Create Draw Results
  const drawResRes = await supabase.from("draw_results").insert({
    draw_period_id: periodId,
    algorithm: 'random',
    winning_scores: winningNumbers,
    published_at: new Date().toISOString()
  }).select("*").single();

  if (drawResRes.error) throw drawResRes.error;
  const resultId = drawResRes.data.id;

  // 4. Calculate distributions and insert Entries & Winnings
  let m5 = []; let m4 = []; let m3 = [];
  const entriesToInsert = [];

  for (const [profileId, data] of Array.from(entriesByProfile.entries())) {
    if (data.scores.length === 0) continue;
    
    // Ensure array properties logic doesn't crash on incomplete data limit issues
    const matchCount = data.scores.filter(s => winningNumbers.includes(s)).length;
    entriesToInsert.push({
      draw_period_id: periodId,
      profile_id: profileId,
      entry_scores: data.scores,
      entry_score_dates: data.dates,
      match_count: matchCount,
    });

    if (matchCount === 5) m5.push(profileId);
    if (matchCount === 4) m4.push(profileId);
    if (matchCount === 3) m3.push(profileId);
  }

  if (entriesToInsert.length > 0) {
    const entryRes = await supabase.from("draw_entries").insert(entriesToInsert).select("id, profile_id");
    if (entryRes.error) throw entryRes.error;

    // Build winnings records
    const winningsToInsert = [];
    const pool = Number(payload.prize_pool);
    const m5Pool = pool * 0.40;
    const m4Pool = pool * 0.35;
    const m3Pool = pool * 0.25;

    // Rollover logic: if m5 length is 0, m5 is rolled over (do nothing with payout).
    const m5Payout = m5.length > 0 ? (m5Pool / m5.length) : 0;
    const m4Payout = m4.length > 0 ? (m4Pool / m4.length) : 0;
    const m3Payout = m3.length > 0 ? (m3Pool / m3.length) : 0;

    for (const row of entryRes.data) {
      if (m5.includes(row.profile_id)) {
        winningsToInsert.push({ draw_period_id: periodId, draw_result_id: resultId, draw_entry_id: row.id, profile_id: row.profile_id, tier: '5-Match Jackpot', prize_name: 'St. Andrews Trip + Cash', prize_amount: m5Payout, match_count: 5 });
      } else if (m4.includes(row.profile_id)) {
        winningsToInsert.push({ draw_period_id: periodId, draw_result_id: resultId, draw_entry_id: row.id, profile_id: row.profile_id, tier: '4-Match', prize_name: 'New Driver / $500 Credit', prize_amount: m4Payout, match_count: 4 });
      } else if (m3.includes(row.profile_id)) {
        winningsToInsert.push({ draw_period_id: periodId, draw_result_id: resultId, draw_entry_id: row.id, profile_id: row.profile_id, tier: '3-Match', prize_name: 'Premium Golf Balls', prize_amount: m3Payout, match_count: 3 });
      }
    }

    if (winningsToInsert.length > 0) {
      const winRes = await supabase.from("winnings").insert(winningsToInsert);
      if (winRes.error) throw winRes.error;
    }
  }

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
  const { data: winningsData, error } = await supabase
    .from("winnings")
    .select(`
      id,
      profile_id,
      tier,
      prize_name,
      status,
      created_at,
      updated_at,
      profiles:profiles!winnings_profile_id_fkey (
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const winningIds = (winningsData ?? []).map((w: any) => w.id);
  const paramsStr = winningIds.join(',');
  const { data: proofData } = await supabase
    .from("winner_proof_submissions")
    .select("winning_id, proof_text")
    // Use an un-parameterized .in filter for the array
    .filter('winning_id', 'in', `(${paramsStr})`);

  const proofMap = new Map((proofData ?? []).map(p => [p.winning_id, p.proof_text]));

  return (winningsData ?? []).map((w: any) => {
    let proof_status: ProofStatus = "pending";
    let payment_status: PaymentStatus = "pending";
    if (w.status === "approved" || w.status === "paid") proof_status = "approved";
    if (w.status === "paid") payment_status = "paid";

    return {
      id: w.id,
      profile_id: w.profile_id,
      prize: w.prize_name,
      tier: w.tier,
      proof_status,
      payment_status,
      scorecard: proofMap.get(w.id) || "",
      created_at: w.created_at,
      updated_at: w.updated_at,
      winner_name: w.profiles?.full_name || w.profiles?.email || "Unknown member",
      winner_email: w.profiles?.email || "",
    };
  });
}

export async function updateWinnerClaim(
  claimId: string,
  payload: Partial<Pick<WinnerClaimRecord, "proof_status" | "payment_status">>,
): Promise<WinnerClaimRecord> {
  const isPaid = payload.payment_status === "paid";
  const status = isPaid ? "paid" : "approved";

  const { error } = await supabase
    .from("winnings")
    .update({ 
      status, 
      ...(status === "approved" ? { approved_at: new Date().toISOString() } : {}),
      ...(status === "paid" ? { paid_at: new Date().toISOString() } : {})
    })
    .eq("id", claimId);

  if (error) {
    throw error;
  }

  const claims = await fetchWinnerClaims();
  const updated = claims.find((c) => c.id === claimId);
  if (!updated) throw new Error("Could not refetch claim.");
  return updated;
}

export type AdminScoreRecord = {
  id: string;
  profile_id: string;
  score: number;
  played_on: string;
  course_name: string;
  verified: boolean;
  member_name: string;
  member_email: string;
};

export async function fetchAdminScores(): Promise<AdminScoreRecord[]> {
  const { data, error } = await supabase
    .from("scores")
    .select(`
      id,
      profile_id,
      score,
      played_on,
      course_name,
      verified,
      profiles:profiles!scores_profile_id_fkey (
        full_name,
        email
      )
    `)
    .order("played_on", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map((s: any) => ({
    id: s.id,
    profile_id: s.profile_id,
    score: s.score,
    played_on: s.played_on,
    course_name: s.course_name,
    verified: s.verified || false,
    member_name: s.profiles?.full_name || s.profiles?.email || "Unknown member",
    member_email: s.profiles?.email || "",
  }));
}

export async function deleteAdminScore(scoreId: string): Promise<void> {
  const { error } = await supabase.from("scores").delete().eq("id", scoreId);
  if (error) throw error;
}

export type AdminAnalytics = {
  totalUsers: number;
  activeSubscriptions: number;
  prizePool: number;
  charityContributions: number;
  charityDistribution: { name: string; value: number; color: string }[];
};

export async function fetchAdminAnalytics(): Promise<AdminAnalytics> {
  const [usersResult, charitiesResult, drawResult] = await Promise.all([
    supabase.from("profiles").select("id, account_status"),
    supabase.from("charities").select("name, total_allocated"),
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

  const totalAllocated = charities.reduce(
    (sum, charity) => sum + Number(charity.total_allocated ?? 0),
    0,
  );

  const colors = ["bg-[#145A41]", "bg-[#2563EB]", "bg-[#F59E0B]", "bg-[#FFD95A]", "bg-gray-300"];
  const distribution = totalAllocated > 0 
    ? charities
        .filter((c) => Number(c.total_allocated) > 0)
        .sort((a, b) => Number(b.total_allocated) - Number(a.total_allocated))
        .slice(0, 4)
        .map((c, i) => ({
          name: c.name,
          value: Math.round((Number(c.total_allocated) / totalAllocated) * 100),
          color: colors[i],
        }))
    : [];

  return {
    totalUsers: users.length,
    activeSubscriptions: users.filter((user) => user.account_status === "active").length,
    prizePool: Number(drawResult.data?.prize_pool ?? 0),
    charityContributions: totalAllocated,
    charityDistribution: distribution,
  };
}
