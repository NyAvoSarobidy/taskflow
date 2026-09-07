// apps/web/src/app/(app)/today/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { TaskRow } from "@/components/ui/TaskRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { tasksApi } from "@/lib/api";
import { Task, TaskStatus } from "@/types";
import { Check, Clock, Calendar } from "lucide-react";

export default function TodayPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    // TODO: Récupérer l'organizationId depuis le contexte ou les params
    const organizationId = "org_1";

    tasksApi
      .myTasks(organizationId)
      .then((data) => setTasks(data.tasks as Task[]))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [user]);

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    // TODO: Mettre à jour via l'API
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status } : t))
    );
  };

  if (authLoading || isLoading) {
    return (
      <AppLayout breadcrumb="Aujourd'hui" title="Chargement...">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  if (!user) return null;

  const todayTasks = tasks.filter((t) => t.status !== TaskStatus.TERMINE);
  const doneTasks = tasks.filter((t) => t.status === TaskStatus.TERMINE);

  return (
    <AppLayout breadcrumb="Aujourd'hui" title={`Bonjour ${user.name}`} activeRoute="today">
      <div className="flex flex-col gap-6">
        {/* Bandeau */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-blue-deep p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[18px] font-semibold">
                {todayTasks.length === 0
                  ? "Rien pour aujourd'hui"
                  : `${todayTasks.length} tâche${todayTasks.length > 1 ? "s" : ""} aujourd'hui`}
              </h2>
              <p className="mt-1 text-[14px] text-white/80">
                {doneTasks.length > 0
                  ? `${doneTasks.length} terminée${doneTasks.length > 1 ? "s" : ""}`
                  : "Cochez vos tâches au fil de la journée"}
              </p>
            </div>
            <div className="flex items-end gap-1">
              {tasks.map((t) => (
                <div
                  key={t._id}
                  className={`h-8 w-2 rounded-full ${
                    t.status === TaskStatus.TERMINE
                      ? "bg-blue"
                      : t.status === TaskStatus.EN_COURS
                      ? "bg-white"
                      : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tâches */}
        {tasks.length === 0 ? (
          <EmptyState
            title="Aucune tâche assignée"
            description="Les tâches qui vous sont assignées apparaîtront ici."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {todayTasks.filter(
              (t) => t.dueDate && new Date(t.dueDate) < new Date()
            ).length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[12.5px] font-semibold uppercase tracking-wide text-ink-soft">
                  En retard
                </span>
                {todayTasks
                  .filter((t) => t.dueDate && new Date(t.dueDate) < new Date())
                  .map((t) => (
                    <TaskRow
                      key={t._id}
                      task={t}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <span className="text-[12.5px] font-semibold uppercase tracking-wide text-ink-soft">
                À faire
              </span>
              {todayTasks
                .filter((t) => !t.dueDate || new Date(t.dueDate) >= new Date())
                .map((t) => (
                  <TaskRow
                    key={t._id}
                    task={t}
                    onStatusChange={handleStatusChange}
                  />
                ))}
            </div>

            {doneTasks.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[12.5px] font-semibold uppercase tracking-wide text-ink-soft">
                  Terminées aujourd'hui
                </span>
                {doneTasks.map((t) => (
                  <TaskRow
                    key={t._id}
                    task={t}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
