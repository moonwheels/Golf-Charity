import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { RealtimeChannel, Session, User } from "@supabase/supabase-js";
import {
  fetchProfile,
  getDefaultAuthenticatedPath,
  hasActiveSubscription,
  type AppRole,
  type Profile,
} from "../services/profileApi";
import { supabase } from "../services/supabaseClient";
import {
  getSession,
  signInWithEmail,
  signOutUser,
  signUpWithEmail,
  type SignInPayload,
  type SignUpPayload,
} from "../services/supabaseAuth";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: AppRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasActiveSubscription: boolean;
  profileError: string | null;
  defaultAuthenticatedPath: string;
  refreshProfile: () => Promise<void>;
  signUp: (payload: SignUpPayload) => ReturnType<typeof signUpWithEmail>;
  signIn: (payload: SignInPayload) => ReturnType<typeof signInWithEmail>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const isMountedRef = useRef(true);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const loadProfile = async (
    nextUser: User | null,
    options?: { preserveExistingProfileOnError?: boolean },
  ) => {
    if (!nextUser) {
      if (isMountedRef.current) {
        setProfile(null);
        setProfileError(null);
      }
      return null;
    }

    try {
      const nextProfile = await fetchProfile(nextUser.id);

      if (!nextProfile) {
        throw new Error(
          "Your account profile could not be loaded. Please sign out and sign back in.",
        );
      }

      if (isMountedRef.current) {
        setProfile(nextProfile);
        setProfileError(null);
      }

      return nextProfile;
    } catch (error) {
      if (!isMountedRef.current) {
        return null;
      }

      if (!options?.preserveExistingProfileOnError) {
        setProfile(null);
      }

      setProfileError(
        getErrorMessage(error, "Unable to load your account profile."),
      );
      return null;
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    const syncSession = async (
      nextSession: Session | null,
      options?: { preserveExistingProfileOnError?: boolean },
    ) => {
      const shouldShowGlobalLoading = !options?.preserveExistingProfileOnError;

      if (!isMountedRef.current) {
        return;
      }

      setSession(nextSession);

      if (!nextSession?.user) {
        setProfile(null);
        setProfileError(null);
        setIsLoading(false);
        return;
      }

      if (shouldShowGlobalLoading) {
        setIsLoading(true);
      }

      await loadProfile(nextSession.user, options);

      if (isMountedRef.current && shouldShowGlobalLoading) {
        setIsLoading(false);
      }
    };

    const bootstrapSession = async () => {
      setIsLoading(true);

      try {
        const activeSession = await getSession();
        await syncSession(activeSession);
      } catch (error) {
        if (!isMountedRef.current) {
          return;
        }

        setSession(null);
        setProfile(null);
        setProfileError(
          getErrorMessage(error, "Unable to restore your session."),
        );
        setIsLoading(false);
      }
    };

    void bootstrapSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      const preserveExistingProfileOnError =
        event === "TOKEN_REFRESHED" || event === "USER_UPDATED";

      void syncSession(nextSession, {
        preserveExistingProfileOnError,
      });
    });

    return () => {
      isMountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const user = session?.user ?? null;

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const channel: RealtimeChannel = supabase
      .channel(`profile:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        () => {
          void loadProfile(user, {
            preserveExistingProfileOnError: true,
          });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const role: AppRole | null = profile?.role ?? null;
  const isAdmin = role === "admin";
  const defaultAuthenticatedPath = getDefaultAuthenticatedPath(profile);

  const value: AuthContextValue = {
    session,
    user,
    profile,
    role,
    isLoading,
    isAuthenticated: Boolean(session?.user),
    isAdmin,
    hasActiveSubscription: hasActiveSubscription(profile),
    profileError,
    defaultAuthenticatedPath,
    refreshProfile: async () => {
      await loadProfile(session?.user ?? null, {
        preserveExistingProfileOnError: true,
      });
    },
    signUp: signUpWithEmail,
    signIn: signInWithEmail,
    signOut: signOutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
