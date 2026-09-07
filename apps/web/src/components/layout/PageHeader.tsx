// apps/web/src/components/layout/PageHeader.tsx
"use client";

import { useState } from "react";
import { Search, Bell, LogOut, User } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";
import { mockCurrentUser } from "@/lib/mock-data";

export function PageHeader({
  breadcrumb,
  title,
}: {
  breadcrumb: string;
  title: string;
}) {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

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

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-blue-veil"
          >
            <Avatar name={user?.name || mockCurrentUser.name} size="md" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-12 z-20 w-56 rounded-xl border border-line bg-white p-1 shadow-lg">
              <div className="border-b border-line px-3 py-2">
                <span className="text-[14px] font-medium text-ink">
                  {user?.name || mockCurrentUser.name}
                </span>
                <br />
                <span className="text-[12.5px] text-ink-soft">
                  {user?.email || mockCurrentUser.email}
                </span>
              </div>
              <a
                href="/profile"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-ink hover:bg-blue-veil"
              >
                <User className="h-4 w-4" />
                Mon profil
              </a>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-ink hover:bg-blue-veil"
              >
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
