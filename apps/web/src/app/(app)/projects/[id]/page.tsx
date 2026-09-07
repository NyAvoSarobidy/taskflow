"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { TaskCard } from "@/components/ui/TaskCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { mockTasks, mockProjects, mockUsers, mockCurrentUser } from "@/lib/mock-data";
import { Task, TaskStatus } from "@/types";
import { Plus, Filter, SlidersHorizontal } from "lucide-react";

export default function KanbanPage({ params }: { params: { id: string } }) {
  const project = mockProjects.find(p => p._id === params.id);
  const tasks = mockTasks.filter(t => t.projectId === params.id);

  const todoTasks = tasks.filter(t => t.status === TaskStatus.A_FAIRE);
  const inProgressTasks = tasks.filter(t => t.status === TaskStatus.EN_COURS);
  const doneTasks = tasks.filter(t => t.status === TaskStatus.TERMINE);

  const getAssignee = (id?: string) => mockUsers.find(u => u._id === id);

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

  return (
    <AppLayout breadcrumb={`Projets / ${project.name}`} title={project.name}>
      <div className="flex flex-col gap-6">
        {/* Toolbar */}
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
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Nouvelle tâche
          </Button>
        </div>

        {/* Kanban columns */}
        <div className="grid grid-cols-3 gap-4">
          {/* À faire */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full border border-blue-edge" />
              <span className="text-[14.5px] font-semibold text-ink">À faire</span>
              <span className="rounded-full bg-line px-2 py-0.5 text-[11px] font-medium text-ink-soft">
                {todoTasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {todoTasks.map(task => (
                <TaskCard key={task._id} task={task} assignee={getAssignee(task.assignedTo)} />
              ))}
              <button className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-blue-edge bg-white/50 py-4 text-[13px] text-ink-soft hover:bg-blue-veil/30">
                <Plus className="h-4 w-4" />
                Ajouter une tâche
              </button>
            </div>
          </div>

          {/* En cours */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-veil" />
              <span className="text-[14.5px] font-semibold text-ink">En cours</span>
              <span className="rounded-full bg-blue px-2 py-0.5 text-[11px] font-medium text-white">
                {inProgressTasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {inProgressTasks.map(task => (
                <TaskCard key={task._id} task={task} assignee={getAssignee(task.assignedTo)} />
              ))}
            </div>
          </div>

          {/* Terminé */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue" />
              <span className="text-[14.5px] font-semibold text-ink">Terminé</span>
              <span className="rounded-full bg-blue-deep px-2 py-0.5 text-[11px] font-medium text-white">
                {doneTasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {doneTasks.map(task => (
                <TaskCard key={task._id} task={task} assignee={getAssignee(task.assignedTo)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
