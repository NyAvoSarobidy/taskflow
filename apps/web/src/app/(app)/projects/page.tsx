// apps/web/src/app/(app)/projects/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Gauge } from "@/components/ui/Gauge";
import { projectsApi, tasksApi } from "@/lib/api";
import { TaskStatus } from "@/types";
import { FolderKanban, Plus, ChevronRight, Users } from "lucide-react";

export default function ProjectsPage() {
  const router = useRouter();
  const { user, organizationId, isLoading: authLoading } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || !organizationId) return;
    projectsApi
      .list(organizationId)
      .then((data) => setProjects(data.projects || []))
      .catch(() => setProjects([]))
      .finally(() => setIsLoading(false));
  }, [user, organizationId]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !organizationId) return;
    setIsCreating(true);
    try {
      await projectsApi.create({ name: newProjectName, organizationId });
      const data = await projectsApi.list(organizationId);
      setProjects(data.projects || []);
      setIsModalOpen(false);
      setNewProjectName("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <AppLayout breadcrumb="Projets" title="Chargement...">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  if (!user) return null;

  const maxProjects = 1;
  const isLimitReached = projects.length >= maxProjects;

  return (
    <AppLayout breadcrumb="Projets" title="Tous les projets" activeRoute="projects">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-blue" />
            <span className="text-[14px] text-ink-soft">
              {projects.length} projet{projects.length > 1 ? "s" : ""}
            </span>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Nouveau projet
          </Button>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            title="Aucun projet"
            description="Créez votre premier projet pour commencer à organiser vos tâches."
            action={
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4" />
                Créer un projet
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-2">
            {projects.map((project) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 rounded-xl border border-line bg-white px-5 py-4 transition-colors hover:bg-blue-veil/30 cursor-pointer"
                onClick={() => router.push(`/projects/${project._id}`)}
              >
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-[14.5px] font-semibold text-ink">{project.name}</span>
                  <div className="flex items-center gap-3 text-[12.5px] text-ink-soft">
                    <span>Créé le {new Date(project.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-ink-soft" />
              </motion.div>
            ))}
          </div>
        )}

        {isLimitReached && (
          <div className="rounded-xl border border-blue-edge bg-blue-veil p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[14px] font-semibold text-ink">Limite atteinte</span>
                <span className="text-[13px] text-ink-soft">
                  Vous avez atteint la limite de {maxProjects} projet{maxProjects > 1 ? "s" : ""} du plan gratuit.
                </span>
              </div>
              <Button variant="secondary">Passer au Pro</Button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(10,27,77,0.42)]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
          >
            <h3 className="text-[18px] font-semibold text-ink">Nouveau projet</h3>
            <form onSubmit={handleCreateProject} className="mt-4 flex flex-col gap-4">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Nom du projet"
                className="h-10 rounded-lg border border-blue-edge bg-white px-3 text-[14px]"
                required
              />
              <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                <Button type="submit" disabled={isCreating}>{isCreating ? "Création..." : "Créer"}</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AppLayout>
  );
}
