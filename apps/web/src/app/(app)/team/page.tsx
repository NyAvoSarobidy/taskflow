// apps/web/src/app/(app)/team/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { MemberRow } from "@/components/ui/MemberRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { User, UserRole } from "@/types";
import { UserPlus, Mail, ShieldCheck } from "lucide-react";
import { mockUsers, mockCurrentUser, mockSubscription, PLAN_LIMITS, SubscriptionPlan } from "@/lib/mock-data";

export default function TeamPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [members, setMembers] = useState<User[]>(mockUsers);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>(UserRole.MEMBRE);
  const [isInviting, setIsInviting] = useState(false);

  const maxMembers = PLAN_LIMITS[SubscriptionPlan.FREE].maxMembers;
  const isLimitReached = members.length >= maxMembers;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setIsInviting(true);
    // TODO: Appel API pour inviter un membre
    // Pour l'instant, on simule
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Invitation envoyée à ${inviteEmail} (simulation)`);
    setIsInviteOpen(false);
    setInviteEmail("");
    setIsInviting(false);
  };

  if (authLoading) {
    return (
      <AppLayout breadcrumb="Équipe" title="Chargement...">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <AppLayout breadcrumb="Équipe" title="Membres de l'organisation" activeRoute="team">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-ink-soft">
            {members.length} membre{members.length > 1 ? "s" : ""}
          </span>
          <Button onClick={() => setIsInviteOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Inviter un membre
          </Button>
        </div>

        {/* Members list */}
        <div className="rounded-xl border border-line bg-white">
          {members.map((member) => (
            <MemberRow
              key={member._id}
              user={member}
              isCurrentUser={member._id === mockCurrentUser._id}
            />
          ))}
        </div>

        {/* Limit banner */}
        {isLimitReached && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-blue-edge bg-blue-veil p-4"
          >
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
          </motion.div>
        )}
      </div>

      {/* Invite modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(10,27,77,0.42)]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
          >
            <h3 className="text-[18px] font-semibold text-ink">
              Inviter un membre
            </h3>
            <form onSubmit={handleInvite} className="mt-4 flex flex-col gap-4">
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
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-ink">Rôle</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
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
                    type="button"
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
                <Button type="button" variant="ghost" onClick={() => setIsInviteOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isInviting}>
                  {isInviting ? "Envoi..." : "Envoyer l'invitation"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AppLayout>
  );
}
