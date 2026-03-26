import { useEffect, useState } from "react";
import {
  createProject,
  deleteProject,
  fetchProjects,
  subscribeToProjects,
  updateProject,
  type Project,
  type ProjectInsert,
  type ProjectUpdate,
} from "../services/supabaseApi";

export function useProjects(userId?: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async (options?: { silent?: boolean }) => {
    if (!userId) {
      setProjects([]);
      setIsLoading(false);
      return;
    }

    if (!options?.silent) {
      setIsLoading(true);
    }

    try {
      const data = await fetchProjects(userId);
      setProjects(data);
      setError(null);
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : "Unable to load projects.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      setProjects([]);
      setIsLoading(false);
      return;
    }

    void loadProjects();

    const unsubscribe = subscribeToProjects(userId, () => {
      void loadProjects({ silent: true });
    });

    return unsubscribe;
  }, [userId]);

  const runMutation = async <T,>(operation: () => Promise<T>) => {
    setIsMutating(true);

    try {
      const result = await operation();
      setError(null);
      await loadProjects({ silent: true });
      return result;
    } catch (mutationError) {
      const message =
        mutationError instanceof Error
          ? mutationError.message
          : "Unable to update projects.";
      setError(message);
      throw mutationError;
    } finally {
      setIsMutating(false);
    }
  };

  const createProjectOptimistic = async (payload: ProjectInsert) => {
    const optimisticProject: Project = {
      id: `temp-${crypto.randomUUID()}`,
      user_id: payload.user_id,
      name: payload.name,
      description: payload.description ?? null,
      status: payload.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setProjects((current) => [optimisticProject, ...current]);

    try {
      const createdProject = await runMutation(() => createProject(payload));
      setProjects((current) =>
        current.map((project) =>
          project.id === optimisticProject.id ? createdProject : project,
        ),
      );
      return createdProject;
    } catch (error) {
      setProjects((current) =>
        current.filter((project) => project.id !== optimisticProject.id),
      );
      throw error;
    }
  };

  const updateProjectOptimistic = async (
    projectId: string,
    payload: ProjectUpdate,
  ) => {
    const previousProjects = projects;

    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? {
              ...project,
              ...payload,
              description:
                payload.description === undefined
                  ? project.description
                  : payload.description,
              updated_at: new Date().toISOString(),
            }
          : project,
      ),
    );

    try {
      return await runMutation(() => updateProject(projectId, payload));
    } catch (error) {
      setProjects(previousProjects);
      throw error;
    }
  };

  const deleteProjectOptimistic = async (projectId: string) => {
    const previousProjects = projects;
    setProjects((current) =>
      current.filter((project) => project.id !== projectId),
    );

    try {
      await runMutation(() => deleteProject(projectId));
    } catch (error) {
      setProjects(previousProjects);
      throw error;
    }
  };

  return {
    projects,
    isLoading,
    isMutating,
    error,
    refresh: () => loadProjects(),
    createProject: createProjectOptimistic,
    updateProject: updateProjectOptimistic,
    deleteProject: deleteProjectOptimistic,
  };
}
