import { Inbox } from "lucide-react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-line bg-white px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-veil">
        {icon ?? <Inbox className="h-5 w-5 text-blue" />}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[14.5px] font-semibold text-ink">{title}</h3>
        <p className="text-[13.5px] text-ink-soft">{description}</p>
      </div>
      {action}
    </div>
  );
}
