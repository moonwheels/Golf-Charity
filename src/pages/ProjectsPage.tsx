import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  AlertCircle,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Radio,
  Trash2,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useProjects } from "../hooks/useProjects";
import type { Project, ProjectStatus } from "../services/supabaseApi";
import { Alert, AlertDescription, AlertTitle } from "../app/components/ui/alert";
import { Button } from "../app/components/ui/button";
import { Card } from "../app/components/ui/card";
import { Input } from "../app/components/ui/input";
import { Label } from "../app/components/ui/label";
import { Skeleton } from "../app/components/ui/skeleton";
import { Textarea } from "../app/components/ui/textarea";

type ProjectFormValues = {
  name: string;
  description: string;
  status: ProjectStatus;
};

const defaultValues: ProjectFormValues = {
  name: "",
  description: "",
  status: "draft",
};

export function ProjectsPage() {
  const { user } = useAuth();
  const { projects, isLoading, isMutating, error, refresh, createProject, updateProject, deleteProject } =
    useProjects(user?.id);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    defaultValues,
  });

  const isBusy = isSubmitting || isMutating;

  const resetForm = () => {
    reset(defaultValues);
    setEditingProject(null);
  };

  const onSubmit = async (values: ProjectFormValues) => {
    if (!user?.id) {
      return;
    }

    try {
      if (editingProject) {
        await updateProject(editingProject.id, values);
        toast.success("Project updated.");
      } else {
        await createProject({
          user_id: user.id,
          ...values,
        });
        toast.success("Project created.");
      }

      resetForm();
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Unable to save project.";
      toast.error(message);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setValue("name", project.name);
    setValue("description", project.description ?? "");
    setValue("status", project.status);
  };

  const handleDelete = async (project: Project) => {
    setDeletingId(project.id);

    try {
      await deleteProject(project.id);
      if (editingProject?.id === project.id) {
        resetForm();
      }
      toast.success("Project deleted.");
    } catch (deleteError) {
      const message =
        deleteError instanceof Error ? deleteError.message : "Unable to delete project.";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#145A41]/10 bg-[#145A41]/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#145A41]">
            <Radio className="h-3.5 w-3.5" />
            Live Supabase Data
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900">
            Projects
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-gray-500">
            Create, edit, and delete records stored in Supabase. Changes will refresh in real time for this signed-in user.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="rounded-xl border-gray-200"
          onClick={() => void refresh()}
          disabled={isLoading || isBusy}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {error ? (
        <Alert className="border-red-200 bg-red-50 text-red-900">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Supabase request failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1.4fr]">
        <Card className="rounded-3xl border-0 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
              {editingProject ? "Edit Project" : "Add Project"}
            </h2>
            <p className="mt-1 text-sm font-medium text-gray-500">
              {editingProject
                ? "Update the selected record and save it back to Supabase."
                : "Insert a new record into the public.projects table."}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="Member onboarding portal"
                className={errors.name ? "border-red-500" : ""}
                {...register("name", { required: "Project name is required" })}
              />
              {errors.name ? (
                <p className="text-sm font-medium text-red-600">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this project does..."
                rows={5}
                {...register("description")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none"
                {...register("status", { required: true })}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                className="flex-1 rounded-xl bg-[#145A41] font-bold text-white hover:bg-[#0B3D2E]"
                disabled={isBusy}
              >
                {isBusy ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {editingProject ? "Save Changes" : "Create Project"}
              </Button>

              {editingProject ? (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={resetForm}
                  disabled={isBusy}
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </Card>

        <Card className="rounded-3xl border-0 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                Your Records
              </h2>
              <p className="mt-1 text-sm font-medium text-gray-500">
                Read, update, and delete data from Supabase.
              </p>
            </div>
            <div className="rounded-full bg-gray-100 px-3 py-1 text-sm font-bold text-gray-600">
              {projects.length} item{projects.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <>
                <Skeleton className="h-28 rounded-2xl" />
                <Skeleton className="h-28 rounded-2xl" />
                <Skeleton className="h-28 rounded-2xl" />
              </>
            ) : projects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
                <p className="text-lg font-bold text-gray-700">No projects yet</p>
                <p className="mt-2 text-sm font-medium text-gray-500">
                  Create your first project using the form on the left.
                </p>
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-extrabold text-gray-900">
                          {project.name}
                        </h3>
                        <span className="rounded-full bg-[#145A41]/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[#145A41]">
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-500">
                        {project.description || "No description provided."}
                      </p>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Updated {new Date(project.updated_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => handleEdit(project)}
                        disabled={isBusy}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => void handleDelete(project)}
                        disabled={isBusy}
                      >
                        {deletingId === project.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
