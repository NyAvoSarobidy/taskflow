"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { MemberRow } from "@/components/ui/MemberRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { mockUsers, mockCurrentUser, mockSubscription, PLAN_LIMITS, SubscriptionPlan, UserRole } from "@/lib/mock-data";
import { UserPlus, Mail, ShieldCheck } from "lucide-react";

export default function TeamPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>(UserRole.MEMBRE);

  const maxMembers = PLAN_LIMITS[SubscriptionPlan.FREE].maxMembers;
  const isLimitReached = mockUsers.length >= maxMembers;

  return (
    <AppLayout breadcrumb="Équipe" title="Membres de l'organisation" activeRoute="team">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-ink-soft">
            {mockUsers.length} membre{mockUsers.length > 1 ? "s" : ""}
          </span>
          <Button onClick={() => setIsInviteOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Inviter un membre
          </Button>
        </div>

        {/* Members list */}
        <div className="rounded-xl border border-line bg-white">
          {mockUsers.map(user => (
            <MemberRow
              key={user._id}
              user={user}
              isCurrentUser={user._id === mockCurrentUser._id}
            />
          ))}
        </div>

        {/* Limit banner */}
        {isLimitReached && (
          <div className="rounded-xl border border-blue-edge bg-blue-veil p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[14px] font-semibold text-ink">
                  Limite atteinte
                </span>
                <span className="text-[13px] text-ink-soft">
                  Vous avez atteint la limite de {maxMembers} membres du plan gratuit.
                </span>
              </div>
              <Button variant="secondary">
                Passer au Pro
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Invite modal */}
      <Modal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)}>
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-semibold text-ink">
            Inviter un membre
          </h3>
          
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-ink">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="email@exemple.com"
                className="h-10 w-full rounded-lg border border-blue-edge bg-white pl-9 pr-3 text-[14px]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-ink">Rôle</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setInviteRole(UserRole.MEMBRE)}
                className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition-colors ${
                  inviteRole === UserRole.MEMBRE
                    ? "border-blue bg-blue-veil"
                    : "border-blue-edge bg-white hover:bg-blue-veil/30"
                }`}
              >
                <span className="text-[14px] font-semibold text-ink">Membre</span>
                <span className="text-[12.5px] text-ink-soft">
                  Voit les projets, crée et met à jour des tâches
                </span>
              </button>
              <button
                onClick={() => setInviteRole(UserRole.ADMIN)}
                className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition-colors ${
                  inviteRole === UserRole.ADMIN
                    ? "border-blue bg-blue-veil"
                    : "border-blue-edge bg-white hover:bg-blue-veil/30"
                }`}
              >
                <span className="text-[14px] font-semibold text-ink">Administrateur</span>
                <span className="text-[12.5px] text-ink-soft">
                  Gère les membres, l'abonnement et les paramètres
                </span>
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsInviteOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => setIsInviteOpen(false)}>
              Envoyer l'invitation
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
