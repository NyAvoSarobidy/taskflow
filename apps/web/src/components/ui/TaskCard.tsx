import { Calendar } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { clsx } from "clsx";
import { Task, TaskStatus, User } from "@/types";

interface TaskCardProps {
  task: Task;
  assignee?: User;
}

export function TaskCard({ task, assignee }: TaskCardProps) {
  const isEnCours = task.status === TaskStatus.EN_COURS;
  const isTermine = task.status === TaskStatus.TERMINE;

  return (
    <div
      className={clsx(
        "flex flex-col gap-3 rounded-xl border border-line bg-white p-4",
        isEnCours && "border-l-[3px] border-l-blue",
        isTermine && "bg-blue-veil/20"
      )}
    >
      <span
        className={clsx(
          "text-[14px]",
          isTermine ? "text-ink-soft line-through" : "text-ink"
        )}
      >
        {task.title}
      </span>

      {task.description && (
        <span className="text-[13px] text-ink-soft">{task.description}</span>
      )}

      <div className="flex items-center justify-between">
        {task.dueDate ? (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-ink-soft" />
            <span className="text-[12px] text-ink-soft">
              {new Date(task.dueDate).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        ) : (
          <span className="text-[12px] text-ink-soft">Sans échéance</span>
        )}

        {assignee && <Avatar name={assignee.name} size="sm" />}
      </div>
    </div>
  );
}
