// apps/web/src/app/(app)/team/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { MemberRow } from "@/components/ui/MemberRow";
import { User, UserRole } from "@/types";
import { invitationsApi } from "@/lib/api";
import { UserPlus, Mail, ShieldCheck, X, RefreshCw, Clock, CheckCircle, XCircle } from "lucide-react";
import { mockUsers, mockCurrentUser, mockSubscription, PLAN_LIMITS, SubscriptionPlan } from "@/lib/mock-data";

interface Invitation {
  _id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  expiresAt: string;
}

export default function TeamPage() {
  const router = useRouter();
  const { user, organizationId, isLoading: authLoading } = useAuth();
  const [members, setMembers] = useState<User[]>(mockUsers);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>(UserRole.MEMBRE);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");

  const maxMembers = PLAN_LIMITS[SubscriptionPlan.FREE].maxMembers;
  const isLimitReached = members.length >= maxMembers;

  useEffect(() => {
    if (!user || !organizationId) return;
    
    // Charger les invitations
    invitationsApi.list(organizationId)
      .then((data) => setInvitations(data.invitations || []))
      .catch(() => setInvitations([]));
  }, [user, organizationId]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !organizationId) return;
    setIsInviting(true);
    setInviteError("");
    setInviteSuccess("");

    try {
      const response = await invitationsApi.create({
        email: inviteEmail,
        role: inviteRole,
        organizationId,
      });
      setInviteSuccess(`Invitation envoyée à ${inviteEmail}`);
      setInviteEmail("");
      setIsInviteOpen(false);
      // Recharger les invitations
      const data = await invitationsApi.list(organizationId);
      setInvitations(data.invitations || []);
    } catch (err: any) {
      setInviteError(err.message || "Erreur lors de l'envoi");
    } finally {
      setIsInviting(false);
    }
  };

  const handleRevoke = async (invitationId: string) => {
    try {
      await invitationsApi.revoke(invitationId);
      // Recharger les invitations
      if (organizationId) {
        const data = await invitationsApi.list(organizationId);
        setInvitations(data.invitations || []);
      }
    } catch (err: any) {
      alert(err.message || "Erreur lors de la révocation");
    }
  };

  const handleResend = async (invitationId: string) => {
    try {
      await invitationsApi.resend(invitationId);
      // Recharger les invitations
      if (organizationId) {
        const data = await invitationsApi.list(organizationId);
        setInvitations(data.invitations || []);
      }
      setInviteSuccess("Invitation renvoyée !");
    } catch (err: any) {
      alert(err.message || "Erreur lors du renvoi");
    }
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

  const pendingInvitations = invitations.filter(i => i.status === "pending");

  return (
    <AppLayout breadcrumb="Équipe" title="Membres de l'organisation" activeRoute="team">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[14px] text-ink-soft">
              {members.length} membre{members.length > 1 ? "s" : ""}
            </span>
            {pendingInvitations.length > 0 && (
              <span className="rounded-full bg-blue-veil px-2 py-0.5 text-[12px] font-medium text-blue">
                {pendingInvitations.length} invitation{pendingInvitations.length > 1 ? "s" : ""} en attente
              </span>
            )}
          </div>
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

        {/* Pending invitations */}
        {pendingInvitations.length > 0 && (
          <div className="rounded-xl border border-blue-edge bg-blue-veil/30">
            <div className="border-b border-blue-edge px-4 py-3">
              <span className="text-[14px] font-semibold text-ink">Invitations en attente</span>
            </div>
            {pendingInvitations.map((invitation) => (
              <div key={invitation._id} className="flex items-center gap-4 border-b border-blue-edge/50 px-4 py-3 last:border-b-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-veil">
                  <Mail className="h-4 w-4 text-blue" />
                </div>
                <div className="flex-1 flex flex-col">
                  <span className="text-[14px] font-medium text-ink">{invitation.email}</span>
                  <span className="text-[12.5px] text-ink-soft">
                    {invitation.role === "admin" ? "Administrateur" : "Membre"} · Expire le {new Date(invitation.expiresAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResend(invitation._id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft hover:bg-blue-veil"
                    title="Renvoyer"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleRevoke(invitation._id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft hover:bg-blue-veil"
                    title="Révoquer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

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

              {inviteError && (
                <div className="rounded-lg bg-blue-veil p-3 text-[13px] text-ink">
                  {inviteError}
                </div>
              )}
              {inviteSuccess && (
                <div className="rounded-lg bg-blue-veil p-3 text-[13px] text-blue">
                  {inviteSuccess}
                </div>
              )}

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
