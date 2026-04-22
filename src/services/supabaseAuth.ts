import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

export type SignUpPayload = {
  email: string;
  password: string;
  fullName: string;
};

export type SignInPayload = {
  email: string;
  password: string;
};

export type AuthSessionData = {
  user: User | null;
  session: Session | null;
};

export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export async function signUpWithEmail({
  email,
  password,
  fullName,
}: SignUpPayload): Promise<AuthSessionData> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "https://golf-charity-kohl.vercel.app",
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    throw error;
  }

  return {
    user: data.user,
    session: data.session,
  };
}

export async function signInWithEmail({
  email,
  password,
}: SignInPayload): Promise<AuthSessionData> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return {
    user: data.user,
    session: data.session,
  };
}

export async function signOutUser(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export type UpdateUserPayload = {
  email?: string;
  password?: string;
  fullName?: string;
};

export async function updateCurrentUser({
  email,
  password,
  fullName,
}: UpdateUserPayload): Promise<User> {
  const attributes: {
    email?: string;
    password?: string;
    data?: {
      full_name?: string;
    };
  } = {};

  if (email) {
    attributes.email = email;
  }

  if (password) {
    attributes.password = password;
  }

  if (fullName !== undefined) {
    attributes.data = {
      full_name: fullName,
    };
  }

  const { data, error } = await supabase.auth.updateUser(attributes);

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error("Unable to update the authenticated user.");
  }

  return data.user;
}
