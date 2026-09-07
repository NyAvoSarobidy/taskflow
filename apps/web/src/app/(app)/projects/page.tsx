"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Gauge } from "@/components/ui/Gauge";
import { mockTasks, mockProjects, mockUsers, mockSubscription, mockOrganization, PLAN_LIMITS, SubscriptionPlan, TaskStatus, UserRole } from "@/lib/mock-data";
import { FolderKanban, Plus, ChevronRight, Users } from "lucide-react";

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const projectTasks = (projectId: string) => mockTasks.filter(t => t.projectId === projectId);
  
  const maxProjects = PLAN_LIMITS[SubscriptionPlan.FREE].maxProjects;
  const isLimitReached = mockProjects.length >= maxProjects;

  return (
    <AppLayout breadcrumb="Projets" title="Tous les projets" activeRoute="projects">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-blue" />
            <span className="text-[14px] text-ink-soft">
              {mockProjects.length} projet{mockProjects.length > 1 ? "s" : ""}
            </span>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Nouveau projet
          </Button>
        </div>

        {/* Projects list */}
        {mockProjects.length === 0 ? (
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
            {mockProjects.map((project) => {
              const tasks = projectTasks(project._id);
              const completed = tasks.filter(t => t.status === TaskStatus.TERMINE).length;
              const inProgress = tasks.filter(t => t.status === TaskStatus.EN_COURS).length;
              const todo = tasks.filter(t => t.status === TaskStatus.A_FAIRE).length;
              const total = tasks.length;

              return (
                <div
                  key={project._id}
                  className="flex items-center gap-4 rounded-xl border border-line bg-white px-5 py-4 transition-colors hover:bg-blue-veil/30"
                >
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="text-[14.5px] font-semibold text-ink">
                      {project.name}
                    </span>
                    <div className="flex items-center gap-3 text-[12.5px] text-ink-soft">
                      <span>{total} tâche{total > 1 ? "s" : ""}</span>
                      <span className="text-line">·</span>
                      <span>Mis à jour récemment</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-48 flex flex-col gap-1.5">
                    <div className="flex h-2 w-full overflow-hidden rounded-full bg-line">
                      {total > 0 && (
                        <>
                          <div className="bg-blue-deep" style={{ width: `${(completed / total) * 100}%` }} />
                          <div className="bg-blue" style={{ width: `${(inProgress / total) * 100}%` }} />
                          <div className="bg-blue-veil" style={{ width: `${(todo / total) * 100}%` }} />
                        </>
                      )}
                    </div>
                    <div className="flex gap-3 text-[11px] text-ink-soft">
                      <span>{completed} term.</span>
                      <span>{inProgress} en cours</span>
                      <span>{todo} à faire</span>
                    </div>
                  </div>

                  {/* Members */}
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-ink-soft" />
                    <span className="text-[12.5px] text-ink-soft">
                      {mockUsers.length}
                    </span>
                  </div>

                  <ChevronRight className="h-4 w-4 text-ink-soft" />
                </div>
              );
            })}
          </div>
        )}

        {/* Limit banner */}
        {isLimitReached && (
          <div className="rounded-xl border border-blue-edge bg-blue-veil p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[14px] font-semibold text-ink">
                  Limite atteinte
                </span>
                <span className="text-[13px] text-ink-soft">
                  Vous avez atteint la limite de {maxProjects} projet{maxProjects > 1 ? "s" : ""} du plan gratuit.
                </span>
              </div>
              <Button variant="secondary">
                Passer au Pro
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-semibold text-ink">
            {isLimitReached ? "Limite atteinte" : "Nouveau projet"}
          </h3>
          {isLimitReached ? (
            <>
              <p className="text-[14px] text-ink-soft">
                Passez au plan Pro pour créer des projets illimités.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Plus tard
                </Button>
                <Button>Voir le plan Pro</Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-[14px] text-ink-soft">
                Donnez un nom à votre projet.
              </p>
              <input
                type="text"
                placeholder="Nom du projet"
                className="h-10 rounded-lg border border-blue-edge bg-white px-3 text-[14px]"
              />
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </Button>
                <Button>Créer</Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </AppLayout>
  );
}
