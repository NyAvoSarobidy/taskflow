import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Gauge } from "@/components/ui/Gauge";

interface SidebarProps {
  activeRoute?: string;
}

export function Sidebar({ activeRoute = "today" }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[248px] flex flex-col border-r border-line bg-white">
      {/* Organisation selector */}
      <div className="flex items-center gap-3 border-b border-line p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-deep text-[14px] font-semibold text-white">
          CV
        </div>
        <div className="flex flex-1 flex-col">
          <span className="text-[14px] font-semibold text-ink">
            Carrefour Ventures
          </span>
          <span className="text-[12.5px] text-ink-soft">
            Plan gratuit · 3 membres
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        <NavItem
          label="Aujourd'hui"
          count={3}
          active={activeRoute === "today"}
        />
        <NavItem label="Projets" count={3} active={activeRoute === "projects"} />
        <NavItem label="Équipe" count={3} active={activeRoute === "team"} />

        <div className="mt-4 flex flex-col gap-1">
          <span className="px-3 py-1 text-[12.5px] font-semibold uppercase tracking-wide text-ink-soft">
            Projets
          </span>
          <NavItem label="Lancement appli mobile" active={false} />
          <NavItem label="Refonte site vitrine" active={false} />
          <NavItem label="Campagne fidélité" active={false} />
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <span className="px-3 py-1 text-[12.5px] font-semibold uppercase tracking-wide text-ink-soft">
            Organisation
          </span>
          <NavItem label="Abonnement" active={activeRoute === "billing"} />
          <NavItem label="Profil" active={activeRoute === "profile"} />
        </div>
      </nav>

      {/* Plan gauge */}
      <div className="border-t border-line p-4">
        <div className="mb-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[12.5px]">
            <span className="text-ink-soft">Projets</span>
            <span className="font-semibold text-ink">1 / 1</span>
          </div>
          <Gauge value={1} max={1} color="blue-deep" />
          <div className="flex items-center justify-between text-[12.5px]">
            <span className="text-ink-soft">Membres</span>
            <span className="font-semibold text-ink">3 / 3</span>
          </div>
          <Gauge value={3} max={3} color="blue-deep" />
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-deep px-3 py-2 text-[13px] font-semibold text-white hover:bg-ink">
          Passer au Pro
        </button>
      </div>
    </aside>
  );
}

function NavItem({
  label,
  count,
  active,
}: {
  label: string;
  count?: number;
  active: boolean;
}) {
  return (
    <button
      className={`flex h-9 w-full items-center gap-2 rounded-lg px-3 text-[14px] transition-colors ${
        active ? "bg-blue-veil font-medium text-blue" : "text-ink hover:bg-blue-veil"
      }`}
    >
      <span className="flex-1 text-left">{label}</span>
      {count !== undefined && (
        <span
          className={`rounded-[99px] px-2 py-0.5 text-[11px] font-medium ${
            active ? "bg-blue text-white" : "bg-line text-ink-soft"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
