import { useEffect, useState } from "react";
import {
  fetchActiveCharities,
  fetchMemberCharityPreference,
  subscribeToMemberCharityPreference,
  upsertMemberCharityPreference,
  type CharityOption,
  type MemberCharityPreference,
  type MemberCharityPreferenceUpsert,
} from "../services/memberDataApi";

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

export function useMemberCharityPreference(userId?: string) {
  const [charities, setCharities] = useState<CharityOption[]>([]);
  const [preference, setPreference] = useState<MemberCharityPreference | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPreference = async (options?: { silent?: boolean }) => {
    if (!userId) {
      setCharities([]);
      setPreference(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    if (!options?.silent) {
      setIsLoading(true);
    }

    try {
      const [nextCharities, nextPreference] = await Promise.all([
        fetchActiveCharities(),
        fetchMemberCharityPreference(userId),
      ]);

      setCharities(nextCharities);
      setPreference(nextPreference);
      setError(null);
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Unable to load charity preferences."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      setCharities([]);
      setPreference(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    void loadPreference();

    const unsubscribe = subscribeToMemberCharityPreference(userId, () => {
      void loadPreference({ silent: true });
    });

    return unsubscribe;
  }, [userId]);

  const savePreference = async (payload: MemberCharityPreferenceUpsert) => {
    setIsSaving(true);

    try {
      const nextPreference = await upsertMemberCharityPreference(payload);
      setPreference(nextPreference);
      setError(null);
      await loadPreference({ silent: true });
      return nextPreference;
    } catch (saveError) {
      const message = getErrorMessage(saveError, "Unable to save charity preferences.");
      setError(message);
      throw saveError;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    charities,
    preference,
    isLoading,
    isSaving,
    error,
    refresh: () => loadPreference(),
    savePreference,
  };
}
