import { useEffect, useState } from "react";
import {
  createMemberScore,
  fetchMemberScores,
  subscribeToMemberScores,
  updateMemberScore,
  type MemberScore,
  type MemberScoreInsert,
  type MemberScoreUpdate,
} from "../services/memberDataApi";

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

export function useMemberScores(userId?: string) {
  const [scores, setScores] = useState<MemberScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadScores = async (options?: { silent?: boolean }) => {
    if (!userId) {
      setScores([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    if (!options?.silent) {
      setIsLoading(true);
    }

    try {
      const data = await fetchMemberScores(userId);
      setScores(data);
      setError(null);
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Unable to load scores."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      setScores([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    void loadScores();

    const unsubscribe = subscribeToMemberScores(userId, () => {
      void loadScores({ silent: true });
    });

    return unsubscribe;
  }, [userId]);

  const runMutation = async <T,>(
    operation: () => Promise<T>,
    fallbackMessage: string,
  ) => {
    setIsMutating(true);

    try {
      const result = await operation();
      setError(null);
      await loadScores({ silent: true });
      return result;
    } catch (mutationError) {
      const message = getErrorMessage(mutationError, fallbackMessage);
      setError(message);
      throw mutationError;
    } finally {
      setIsMutating(false);
    }
  };

  return {
    scores,
    isLoading,
    isMutating,
    error,
    refresh: () => loadScores(),
    createScore: (payload: MemberScoreInsert) =>
      runMutation(() => createMemberScore(payload), "Unable to save score."),
    updateScore: (scoreId: string, payload: MemberScoreUpdate) =>
      runMutation(() => updateMemberScore(scoreId, payload), "Unable to update score."),
  };
}
