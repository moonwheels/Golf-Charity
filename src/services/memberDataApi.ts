import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

export type MemberScore = {
  id: string;
  profile_id: string;
  score: number;
  played_on: string;
  created_at: string;
  updated_at: string;
};

export type MemberScoreInsert = {
  profile_id: string;
  score: number;
  played_on: string;
};

export type MemberScoreUpdate = Pick<MemberScoreInsert, "score" | "played_on">;

type CharityRow = {
  id: string;
  name: string;
  category: string;
  total_allocated: number | string;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type CharityOption = {
  id: string;
  name: string;
  category: string;
  total_allocated: number;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
};

type MemberCharityPreferenceRow = {
  profile_id: string;
  charity_id: string;
  contribution_percentage: number | string;
  created_at: string;
  updated_at: string;
  charity: CharityRow | null;
};

export type MemberCharityPreference = {
  profile_id: string;
  charity_id: string;
  contribution_percentage: number;
  created_at: string;
  updated_at: string;
  charity: CharityOption | null;
};

export type MemberCharityPreferenceUpsert = {
  profile_id: string;
  charity_id: string;
  contribution_percentage: number;
};

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

function normalizeCharity(row: CharityRow): CharityOption {
  return {
    ...row,
    total_allocated: Number(row.total_allocated ?? 0),
  };
}

function normalizeCharityPreference(
  row: MemberCharityPreferenceRow | null,
): MemberCharityPreference | null {
  if (!row) {
    return null;
  }

  return {
    profile_id: row.profile_id,
    charity_id: row.charity_id,
    contribution_percentage: Number(row.contribution_percentage),
    created_at: row.created_at,
    updated_at: row.updated_at,
    charity: row.charity ? normalizeCharity(row.charity) : null,
  };
}

function assertValidScoreInput(score: number, playedOn: string) {
  if (!playedOn) {
    throw new Error("Score date is required.");
  }

  if (!Number.isInteger(score) || score < 1 || score > 45) {
    throw new Error("Stableford score must be a whole number between 1 and 45.");
  }
}

function assertValidContributionPercentage(contributionPercentage: number) {
  if (!Number.isFinite(contributionPercentage) || contributionPercentage < 10) {
    throw new Error("Contribution percentage must be at least 10%.");
  }
}

export async function fetchMemberScores(userId: string): Promise<MemberScore[]> {
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .eq("profile_id", userId)
    .order("played_on", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(getErrorMessage(error, "Unable to load your scores."));
  }

  return (data as MemberScore[] | null) ?? [];
}

export async function createMemberScore(
  payload: MemberScoreInsert,
): Promise<MemberScore> {
  assertValidScoreInput(payload.score, payload.played_on);

  const { data, error } = await supabase
    .from("scores")
    .insert({
      profile_id: payload.profile_id,
      score: payload.score,
      played_on: payload.played_on,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(getErrorMessage(error, "Unable to save your score."));
  }

  return data as MemberScore;
}

export async function updateMemberScore(
  scoreId: string,
  payload: MemberScoreUpdate,
): Promise<MemberScore> {
  assertValidScoreInput(payload.score, payload.played_on);

  const { data, error } = await supabase
    .from("scores")
    .update({
      score: payload.score,
      played_on: payload.played_on,
    })
    .eq("id", scoreId)
    .select("*")
    .single();

  if (error) {
    throw new Error(getErrorMessage(error, "Unable to update your score."));
  }

  return data as MemberScore;
}

export function subscribeToMemberScores(
  userId: string,
  onChange: () => void,
): () => void {
  const channel: RealtimeChannel = supabase
    .channel(`scores:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "scores",
        filter: `profile_id=eq.${userId}`,
      },
      () => onChange(),
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

export async function fetchActiveCharities(): Promise<CharityOption[]> {
  const { data, error } = await supabase
    .from("charities")
    .select("*")
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(getErrorMessage(error, "Unable to load charities."));
  }

  return ((data as CharityRow[] | null) ?? []).map(normalizeCharity);
}

export async function fetchMemberCharityPreference(
  userId: string,
): Promise<MemberCharityPreference | null> {
  const { data, error } = await supabase
    .from("member_charity_preferences")
    .select(`
      profile_id,
      charity_id,
      contribution_percentage,
      created_at,
      updated_at,
      charity:charities!member_charity_preferences_charity_id_fkey (
        id,
        name,
        category,
        total_allocated,
        featured,
        active,
        created_at,
        updated_at
      )
    `)
    .eq("profile_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(getErrorMessage(error, "Unable to load your charity preferences."));
  }

  return normalizeCharityPreference(data as MemberCharityPreferenceRow | null);
}

export async function upsertMemberCharityPreference(
  payload: MemberCharityPreferenceUpsert,
): Promise<MemberCharityPreference> {
  assertValidContributionPercentage(payload.contribution_percentage);

  const { data, error } = await supabase
    .from("member_charity_preferences")
    .upsert(
      {
        profile_id: payload.profile_id,
        charity_id: payload.charity_id,
        contribution_percentage: payload.contribution_percentage,
      },
      {
        onConflict: "profile_id",
      },
    )
    .select(`
      profile_id,
      charity_id,
      contribution_percentage,
      created_at,
      updated_at,
      charity:charities!member_charity_preferences_charity_id_fkey (
        id,
        name,
        category,
        total_allocated,
        featured,
        active,
        created_at,
        updated_at
      )
    `)
    .single();

  if (error) {
    throw new Error(getErrorMessage(error, "Unable to save your charity preferences."));
  }

  const normalizedPreference = normalizeCharityPreference(
    data as unknown as MemberCharityPreferenceRow,
  );

  if (!normalizedPreference) {
    throw new Error("Unable to save your charity preferences.");
  }

  return normalizedPreference;
}

export function subscribeToMemberCharityPreference(
  userId: string,
  onChange: () => void,
): () => void {
  const channel: RealtimeChannel = supabase
    .channel(`member_charity_preferences:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "member_charity_preferences",
        filter: `profile_id=eq.${userId}`,
      },
      () => onChange(),
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

export type DrawResultRecord = {
  id: string;
  draw_period_id: string;
  winning_scores: number[];
  published_at: string | null;
};

export type MemberDrawData = {
  drawResult: DrawResultRecord | null;
  entryScores: number[];
  winningTier: string | null;
  prizeName: string | null;
  winningStatus: string | null;
  winningId: string | null;
  proofSubmitted: boolean;
};

export async function fetchMemberDrawData(userId: string): Promise<MemberDrawData> {
  const { data: drawRes } = await supabase
    .from("draw_results")
    .select("*")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!drawRes) {
    return { drawResult: null, entryScores: [], winningTier: null, prizeName: null, winningStatus: null, winningId: null, proofSubmitted: false };
  }

  const { data: entryData } = await supabase
    .from("draw_entries")
    .select("entry_scores")
    .eq("draw_period_id", drawRes.draw_period_id)
    .eq("profile_id", userId)
    .maybeSingle();

  const { data: winningData } = await supabase
    .from("winnings")
    .select("id, tier, prize_name, status")
    .eq("draw_period_id", drawRes.draw_period_id)
    .eq("profile_id", userId)
    .maybeSingle();

  let proofSubmitted = false;
  if (winningData?.id) {
    const { data: proofData } = await supabase
      .from("winner_proof_submissions")
      .select("id")
      .eq("winning_id", winningData.id)
      .maybeSingle();
    proofSubmitted = !!proofData;
  }

  return {
    drawResult: drawRes as DrawResultRecord,
    entryScores: entryData?.entry_scores || [],
    winningTier: winningData?.tier || null,
    prizeName: winningData?.prize_name || null,
    winningStatus: winningData?.status || null,
    winningId: winningData?.id || null,
    proofSubmitted,
  };
}

export async function submitWinnerProof(winningId: string, profileId: string, proofText: string): Promise<void> {
  if (!proofText.trim()) throw new Error("Proof text is required.");

  const { error } = await supabase
    .from("winner_proof_submissions")
    .insert({
      winning_id: winningId,
      profile_id: profileId,
      proof_text: proofText,
    });

  if (error) {
    throw new Error(getErrorMessage(error, "Unable to submit proof."));
  }
}

