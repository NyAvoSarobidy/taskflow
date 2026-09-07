"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { TaskRow } from "@/components/ui/TaskRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { mockTasks, mockProjects, mockUsers, mockCurrentUser } from "@/lib/mock-data";
import { Task, TaskStatus } from "@/types";
import { Check, Clock, Calendar } from "lucide-react";

export default function TodayPage() {
  const [tasks, setTasks] = useState<Task[]>(
    mockTasks.filter((t) => t.assignedTo === mockCurrentUser._id)
  );

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status } : t))
    );
  };

  const todayTasks = tasks.filter((t) => t.status !== TaskStatus.TERMINE);
  const doneTasks = tasks.filter((t) => t.status === TaskStatus.TERMINE);

  const getProject = (id: string) => mockProjects.find((p) => p._id === id);
  const getAssignee = (id?: string) =>
    mockUsers.find((u) => u._id === id);

  return (
    <AppLayout breadcrumb="Aujourd'hui" title="Bonjour Aminata" activeRoute="today">
      <div className="flex flex-col gap-6">
        {/* Bandeau */}
        <div className="rounded-2xl bg-blue-deep p-6 text-white">
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
            {/* Frise de charge */}
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
        </div>

        {/* Tâches */}
        {tasks.length === 0 ? (
          <EmptyState
            title="Aucune tâche assignée"
            description="Les tâches qui vous sont assignées apparaîtront ici."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {/* En retard */}
            {todayTasks.filter(
              (t) => t.dueDate && new Date(t.dueDate) < new Date()
            ).length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[12.5px] font-semibold uppercase tracking-wide text-ink-soft">
                  En retard
                </span>
                {todayTasks
                  .filter(
                    (t) => t.dueDate && new Date(t.dueDate) < new Date()
                  )
                  .map((t) => (
                    <TaskRow
                      key={t._id}
                      task={t}
                      project={getProject(t.projectId)}
                      assignee={getAssignee(t.assignedTo)}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
              </div>
            )}

            {/* À faire aujourd'hui */}
            <div className="flex flex-col gap-2">
              <span className="text-[12.5px] font-semibold uppercase tracking-wide text-ink-soft">
                À faire
              </span>
              {todayTasks
                .filter(
                  (t) => !t.dueDate || new Date(t.dueDate) >= new Date()
                )
                .map((t) => (
                  <TaskRow
                    key={t._id}
                    task={t}
                    project={getProject(t.projectId)}
                    assignee={getAssignee(t.assignedTo)}
                    onStatusChange={handleStatusChange}
                  />
                ))}
            </div>

            {/* Terminées */}
            {doneTasks.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[12.5px] font-semibold uppercase tracking-wide text-ink-soft">
                  Terminées aujourd'hui
                </span>
                {doneTasks.map((t) => (
                  <TaskRow
                    key={t._id}
                    task={t}
                    project={getProject(t.projectId)}
                    assignee={getAssignee(t.assignedTo)}
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
