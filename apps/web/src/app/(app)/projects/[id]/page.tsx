// apps/web/src/app/(app)/projects/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { TaskCard } from "@/components/ui/TaskCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { projectsApi, tasksApi } from "@/lib/api";
import { Task, TaskStatus } from "@/types";
import { Plus, Filter, SlidersHorizontal } from "lucide-react";

export default function KanbanPage() {
  const router = useRouter();
  const params = useParams();
  const { user, organizationId, isLoading: authLoading } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const projectId = params.id as string;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || !projectId || !organizationId) return;

    Promise.all([
      projectsApi.get(projectId, organizationId),
      tasksApi.listByProject(projectId, organizationId),
    ])
      .then(([projectData, tasksData]) => {
        setProject(projectData.project);
        setTasks(tasksData.tasks as Task[]);
      })
      .catch(() => {
        setProject(null);
        setTasks([]);
      })
      .finally(() => setIsLoading(false));
  }, [user, projectId, organizationId]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setIsCreating(true);
    try {
      await tasksApi.create(projectId, { title: newTaskTitle });
      const data = await tasksApi.listByProject(projectId, organizationId!);
      setTasks(data.tasks as Task[]);
      setIsModalOpen(false);
      setNewTaskTitle("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      await tasksApi.update(projectId, taskId, { status });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status } : t))
      );
    } catch (err: any) {
      alert(err.message);
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

  if (!project) {
    return (
      <AppLayout breadcrumb="Projets" title="Projet introuvable">
        <EmptyState
          title="Projet introuvable"
          description="Ce projet n'existe pas ou a été supprimé."
        />
      </AppLayout>
    );
  }

  const todoTasks = tasks.filter((t) => t.status === TaskStatus.A_FAIRE);
  const inProgressTasks = tasks.filter((t) => t.status === TaskStatus.EN_COURS);
  const doneTasks = tasks.filter((t) => t.status === TaskStatus.TERMINE);

  return (
    <AppLayout breadcrumb={`Projets / ${project.name}`} title={project.name}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <Filter className="h-4 w-4" />
              Assigné
            </Button>
            <Button variant="secondary" size="sm">
              <SlidersHorizontal className="h-4 w-4" />
              Échéance
            </Button>
          </div>
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Nouvelle tâche
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full border border-blue-edge" />
              <span className="text-[14.5px] font-semibold text-ink">À faire</span>
              <span className="rounded-full bg-line px-2 py-0.5 text-[11px] font-medium text-ink-soft">
                {todoTasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {todoTasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-blue-edge bg-white/50 py-4 text-[13px] text-ink-soft hover:bg-blue-veil/30"
              >
                <Plus className="h-4 w-4" />
                Ajouter une tâche
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-veil" />
              <span className="text-[14.5px] font-semibold text-ink">En cours</span>
              <span className="rounded-full bg-blue px-2 py-0.5 text-[11px] font-medium text-white">
                {inProgressTasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {inProgressTasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue" />
              <span className="text-[14.5px] font-semibold text-ink">Terminé</span>
              <span className="rounded-full bg-blue-deep px-2 py-0.5 text-[11px] font-medium text-white">
                {doneTasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {doneTasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(10,27,77,0.42)]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
          >
            <h3 className="text-[18px] font-semibold text-ink">Nouvelle tâche</h3>
            <form onSubmit={handleCreateTask} className="mt-4 flex flex-col gap-4">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Titre de la tâche"
                className="h-10 rounded-lg border border-blue-edge bg-white px-3 text-[14px]"
                required
              />
              <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Création..." : "Créer"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AppLayout>
  );
}
