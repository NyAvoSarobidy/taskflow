// apps/web/src/app/(app)/billing/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Gauge } from "@/components/ui/Gauge";
import { Badge } from "@/components/ui/Badge";
import { billingApi, projectsApi, membersApi } from "@/lib/api";
import { PLAN_LIMITS, SubscriptionPlan } from "@/types";
import { Check, Sparkles } from "lucide-react";

export default function BillingPage() {
  const router = useRouter();
  const { user, organizationId, isLoading: authLoading } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [projectCount, setProjectCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    if (!organizationId) return;

    projectsApi.list(organizationId)
      .then((data) => setProjectCount(data.projects?.length || 0))
      .catch(() => setProjectCount(0));

    membersApi.list(organizationId)
      .then((data) => setMemberCount(data.members?.length || 0))
      .catch(() => setMemberCount(0));
  }, [organizationId]);

  const maxProjects = PLAN_LIMITS[SubscriptionPlan.FREE].maxProjects;
  const maxMembers = PLAN_LIMITS[SubscriptionPlan.FREE].maxMembers;

  const handleUpgrade = async () => {
    if (!organizationId) return;
    setIsUpgrading(true);
    try {
      const { url } = await billingApi.checkout({ plan: "pro", organizationId });
      window.location.href = url;
    } catch (err: any) {
      alert(err.message || "Erreur lors de la création de la session");
    } finally {
      setIsUpgrading(false);
    }
  };

  const handlePortal = async () => {
    if (!organizationId) return;
    setIsPortalLoading(true);
    try {
      const { url } = await billingApi.portal({ organizationId });
      window.location.href = url;
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'ouverture du portail");
    } finally {
      setIsPortalLoading(false);
    }
  };

  if (authLoading) {
    return (
      <AppLayout breadcrumb="Abonnement" title="Chargement...">
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
    <AppLayout breadcrumb="Abonnement" title="Votre abonnement" activeRoute="billing">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-[18px] font-semibold text-ink">Votre consommation</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-line bg-white p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] font-medium text-ink">Projets</span>
                <span className="text-[14px] font-semibold text-ink">
                  {projectCount} / {maxProjects === Infinity ? "∞" : maxProjects}
                </span>
              </div>
              <Gauge
                value={projectCount}
                max={maxProjects === Infinity ? projectCount : maxProjects}
                color={projectCount >= (maxProjects === Infinity ? 0 : maxProjects) ? "blue-deep" : "blue"}
              />
              <p className="mt-2 text-[12.5px] text-ink-soft">
                {maxProjects === Infinity
                  ? "Projets illimités"
                  : `Limite de ${maxProjects} projet${maxProjects > 1 ? "s" : ""} sur le plan gratuit`}
              </p>
            </div>

            <div className="rounded-xl border border-line bg-white p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] font-medium text-ink">Membres</span>
                <span className="text-[14px] font-semibold text-ink">
                  {memberCount} / {maxMembers === Infinity ? "∞" : maxMembers}
                </span>
              </div>
              <Gauge
                value={memberCount}
                max={maxMembers === Infinity ? memberCount : maxMembers}
                color={memberCount >= (maxMembers === Infinity ? 0 : maxMembers) ? "blue-deep" : "blue"}
              />
              <p className="mt-2 text-[12.5px] text-ink-soft">
                {maxMembers === Infinity
                  ? "Membres illimités"
                  : `Limite de ${maxMembers} membres sur le plan gratuit`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-[18px] font-semibold text-ink">Nos offres</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-line bg-white p-6">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-[16px] font-semibold text-ink">Gratuit</h3>
                  <p className="text-[24px] font-bold text-ink mt-1">
                    0€<span className="text-[14px] font-normal text-ink-soft">/mois</span>
                  </p>
                </div>
                <ul className="flex flex-col gap-2 text-[14px] text-ink-soft">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue" /> 1 projet
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue" /> 3 membres
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue" /> Tâches illimitées
                  </li>
                </ul>
                <Button variant="secondary" disabled>Votre plan actuel</Button>
              </div>
            </div>

            <div className="rounded-xl border-[1.5px] border-blue-deep bg-white p-6 relative">
              <div className="absolute -top-3 right-4">
                <Badge variant="blue"><Sparkles className="h-3 w-3" /> Sans limites</Badge>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-[16px] font-semibold text-ink">Pro</h3>
                  <p className="text-[24px] font-bold text-ink mt-1">
                    9,99€<span className="text-[14px] font-normal text-ink-soft">/mois</span>
                  </p>
                </div>
                <ul className="flex flex-col gap-2 text-[14px] text-ink-soft">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue" /> Projets illimités
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue" /> Membres illimités
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue" /> Tâches illimitées
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue" /> Support prioritaire
                  </li>
                </ul>
                <Button onClick={handleUpgrade} disabled={isUpgrading}>
                  {isUpgrading ? "Chargement..." : "Passer au Pro"}
                </Button>
                <p className="text-[12px] text-ink-soft text-center">
                  Paiement sécurisé par Stripe · Annulation possible à tout moment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
