"use client";

import { useState } from "react";
import { Check, MoreHorizontal, Calendar } from "lucide-react";
import { clsx } from "clsx";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Task, TaskStatus, Project, User } from "@/types";

interface TaskRowProps {
  task: Task;
  project?: Project;
  assignee?: User;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
}

const statusBadge: Record<TaskStatus, { label: string; variant: "default" | "blue" | "outline" }> = {
  [TaskStatus.A_FAIRE]: { label: "À faire", variant: "outline" },
  [TaskStatus.EN_COURS]: { label: "En cours", variant: "default" },
  [TaskStatus.TERMINE]: { label: "Terminé", variant: "blue" },
};

export function TaskRow({ task, project, assignee, onStatusChange }: TaskRowProps) {
  const [isCompleted, setIsCompleted] = useState(task.status === TaskStatus.TERMINE);

  const handleToggle = () => {
    const newStatus = isCompleted ? TaskStatus.A_FAIRE : TaskStatus.TERMINE;
    setIsCompleted(!isCompleted);
    onStatusChange?.(task._id, newStatus);
  };

  return (
    <div
      className={clsx(
        "flex items-center gap-4 rounded-xl border border-line bg-white px-4 py-3 transition-colors",
        isCompleted && "bg-blue-veil/30"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={clsx(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
          isCompleted
            ? "border-blue bg-blue"
            : "border-blue-edge"
        )}
        aria-label={isCompleted ? "Marquer comme à faire" : "Marquer comme terminé"}
      >
        {isCompleted && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1">
        <span
          className={clsx(
            "text-[14px]",
            isCompleted ? "text-ink-soft line-through" : "text-ink"
          )}
        >
          {task.title}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[12.5px] text-ink-soft">
            {project?.name}
          </span>
          <span className="text-line">·</span>
          <span className="text-[12.5px] text-ink-soft">
            {assignee?.name || "Non assigné"}
          </span>
        </div>
      </div>

      {/* Due date */}
      {task.dueDate && (
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-ink-soft" />
          <span className="text-[12.5px] text-ink-soft">
            {new Date(task.dueDate).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
      )}

      {/* Status badge */}
      <Badge variant={statusBadge[task.status].variant}>
        {statusBadge[task.status].label}
      </Badge>

      {/* Menu */}
      <button
        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft hover:bg-blue-veil"
        aria-label="Plus d'actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
}
