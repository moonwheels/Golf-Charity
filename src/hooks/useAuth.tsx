import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { RealtimeChannel, Session, User } from "@supabase/supabase-js";
import {
  fetchProfile,
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
  role: AppRole;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
  signUp: (payload: SignUpPayload) => ReturnType<typeof signUpWithEmail>;
  signIn: (payload: SignInPayload) => ReturnType<typeof signInWithEmail>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadProfile = async (nextUser: User | null) => {
    if (!nextUser) {
      setProfile(null);
      return;
    }

    try {
      const nextProfile = await fetchProfile(nextUser.id);
      setProfile(nextProfile);
    } catch {
      setProfile(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const activeSession = await getSession();

        if (isMounted) {
          setSession(activeSession);
          await loadProfile(activeSession?.user ?? null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      void loadProfile(nextSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
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
          void loadProfile(user);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const role: AppRole = profile?.role === "admin" ? "admin" : "member";
  const isAdmin = role === "admin";
  const value: AuthContextValue = {
    session,
    user,
    profile,
    role,
    isLoading,
    isAuthenticated: Boolean(session?.user),
    isAdmin,
    refreshProfile: async () => {
      await loadProfile(session?.user ?? null);
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
