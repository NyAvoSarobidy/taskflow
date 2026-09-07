"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Gauge } from "@/components/ui/Gauge";
import { Badge } from "@/components/ui/Badge";
import { mockProjects, mockUsers, mockSubscription, PLAN_LIMITS, SubscriptionPlan } from "@/lib/mock-data";
import { Check, Sparkles } from "lucide-react";

export default function BillingPage() {
  const projectCount = mockProjects.length;
  const memberCount = mockUsers.length;
  const maxProjects = PLAN_LIMITS[mockSubscription.plan].maxProjects;
  const maxMembers = PLAN_LIMITS[mockSubscription.plan].maxMembers;

  return (
    <AppLayout breadcrumb="Abonnement" title="Votre abonnement" activeRoute="billing">
      <div className="flex flex-col gap-8">
        {/* Consumption */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[18px] font-semibold text-ink">Votre consommation</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Projects */}
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

            {/* Members */}
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

        {/* Plans */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[18px] font-semibold text-ink">Nos offres</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Free plan */}
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
                    <Check className="h-4 w-4 text-blue" />
                    1 projet
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue" />
                    3 membres
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue" />
                    Tâches illimitées
                  </li>
                </ul>
                <Button variant="secondary" disabled>
                  Votre plan actuel
                </Button>
              </div>
            </div>

            {/* Pro plan */}
            <div className="rounded-xl border-[1.5px] border-blue-deep bg-white p-6 relative">
              <div className="absolute -top-3 right-4">
                <Badge variant="blue">
                  <Sparkles className="h-3 w-3" />
                  Sans limites
                </Badge>
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
                    <Check className="h-4 w-4 text-blue" />
                    Projets illimités
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue" />
                    Membres illimités
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue" />
                    Tâches illimitées
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue" />
                    Support prioritaire
                  </li>
                </ul>
                <Button>
                  Passer au Pro
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
