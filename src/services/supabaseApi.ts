import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

export type ProjectStatus = "draft" | "active" | "archived";

export type Project = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
};

export type ProjectInsert = {
  user_id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
};

export type ProjectUpdate = Partial<Omit<ProjectInsert, "user_id">>;

const PROJECTS_TABLE = "projects";

export async function fetchProjects(userId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from(PROJECTS_TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as Project[];
}

export async function createProject(payload: ProjectInsert): Promise<Project> {
  const { data, error } = await supabase
    .from(PROJECTS_TABLE)
    .insert({
      user_id: payload.user_id,
      name: payload.name,
      description: payload.description ?? null,
      status: payload.status,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Project;
}

export async function updateProject(
  projectId: string,
  payload: ProjectUpdate,
): Promise<Project> {
  const { data, error } = await supabase
    .from(PROJECTS_TABLE)
    .update({
      ...payload,
      description: payload.description ?? null,
    })
    .eq("id", projectId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Project;
}

export async function deleteProject(projectId: string): Promise<void> {
  const { error } = await supabase
    .from(PROJECTS_TABLE)
    .delete()
    .eq("id", projectId);

  if (error) {
    throw error;
  }
}

export function subscribeToProjects(
  userId: string,
  onChange: () => void,
): () => void {
  const channel: RealtimeChannel = supabase
    .channel(`projects:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: PROJECTS_TABLE,
        filter: `user_id=eq.${userId}`,
      },
      () => onChange(),
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
