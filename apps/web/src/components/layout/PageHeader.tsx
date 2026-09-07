import { Search, Bell } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { mockCurrentUser } from "@/lib/mock-data";

export function PageHeader({
  breadcrumb,
  title,
}: {
  breadcrumb: string;
  title: string;
}) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-line bg-white px-6">
      <div className="flex flex-col">
        <span className="text-[12.5px] text-ink-soft">{breadcrumb}</span>
        <h1 className="text-[18px] font-semibold text-ink">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="h-9 w-64 rounded-lg border border-blue-edge bg-white pl-9 pr-3 text-[14px] placeholder:text-ink-soft/60 focus-visible:outline-2 focus-visible:outline-blue"
          />
        </div>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-blue-edge bg-white text-ink-soft hover:bg-blue-veil"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <Avatar name={mockCurrentUser.name} size="md" />
      </div>
    </header>
  );
}
