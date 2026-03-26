type AppEnv = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  VITE_ADMIN_EMAIL?: string;
};

const env = (import.meta as ImportMeta & { env: AppEnv }).env;

export const appEnv = {
  supabaseUrl: env.VITE_SUPABASE_URL,
  supabaseAnonKey: env.VITE_SUPABASE_ANON_KEY,
  adminEmail: env.VITE_ADMIN_EMAIL?.trim().toLowerCase(),
};
