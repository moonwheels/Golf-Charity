type AppEnv = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  VITE_APP_URL?: string;
};

const env = (import.meta as ImportMeta & { env: AppEnv }).env;

function normalizeUrl(value?: string) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  return trimmed.replace(/\/+$/, "");
}

const runtimeOrigin =
  typeof window !== "undefined" ? normalizeUrl(window.location.origin) : undefined;
const appUrl = normalizeUrl(env.VITE_APP_URL) ?? runtimeOrigin;

export const appEnv = {
  supabaseUrl: env.VITE_SUPABASE_URL,
  supabaseAnonKey: env.VITE_SUPABASE_ANON_KEY,
  appUrl,
  authRedirectUrl: appUrl ? `${appUrl}/auth` : undefined,
};
