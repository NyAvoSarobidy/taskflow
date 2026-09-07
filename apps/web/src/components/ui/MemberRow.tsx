"use client";

import { useState } from "react";
import { MoreHorizontal, ShieldCheck } from "lucide-react";
import { clsx } from "clsx";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { User, UserRole } from "@/types";

interface MemberRowProps {
  user: User;
  isCurrentUser?: boolean;
  onRoleChange?: (userId: string, role: UserRole) => void;
  onRemove?: (userId: string) => void;
}

export function MemberRow({
  user,
  isCurrentUser,
  onRoleChange,
  onRemove,
}: MemberRowProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex items-center gap-4 border-b border-line px-4 py-3">
      <Avatar name={user.name} size="md" />

      <div className="flex flex-1 flex-col">
        <span className="text-[14px] font-medium text-ink">
          {user.name}
          {isCurrentUser && (
            <span className="ml-2 text-[12px] font-normal text-ink-soft">
              (Vous)
            </span>
          )}
        </span>
        <span className="text-[12.5px] text-ink-soft">{user.email}</span>
      </div>

      {/* Role */}
      <div className="w-40">
        {isCurrentUser ? (
          <Badge variant="blue">Administrateur</Badge>
        ) : (
          <select
            value={user.role}
            onChange={(e) =>
              onRoleChange?.(user._id, e.target.value as UserRole)
            }
            className="h-8 rounded-lg border border-blue-edge bg-white px-3 text-[13px] text-ink focus-visible:outline-2 focus-visible:outline-blue"
          >
            <option value={UserRole.ADMIN}>Administrateur</option>
            <option value={UserRole.MEMBRE}>Membre</option>
          </select>
        )}
      </div>

      {/* Joined date */}
      <span className="w-32 text-[12.5px] text-ink-soft">
        {new Date(user.createdAt).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </span>

      {/* Actions */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft hover:bg-blue-veil"
          aria-label="Actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
        {showMenu && (
          <div className="absolute right-0 top-10 z-10 w-48 rounded-xl border border-line bg-white p-1 shadow-lg">
            <button
              onClick={() => {
                onRemove?.(user._id);
                setShowMenu(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-ink hover:bg-blue-veil"
            >
              Retirer de l'organisation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
