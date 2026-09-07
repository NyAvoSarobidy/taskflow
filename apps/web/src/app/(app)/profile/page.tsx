// apps/web/src/app/(app)/profile/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <AppLayout breadcrumb="Profil" title="Mon profil">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <div className="rounded-xl border border-line bg-white p-6">
          <div className="flex items-center gap-4 pb-6 border-b border-line">
            <Avatar name={user.name} size="lg" />
            <div className="flex flex-col gap-1">
              <h2 className="text-[20px] font-semibold text-ink">{user.name}</h2>
              <span className="text-[14px] text-ink-soft">{user.email}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-ink">Nom complet</label>
              <input
                type="text"
                value={user.name}
                disabled
                className="h-10 rounded-lg border border-blue-edge bg-bg px-3 text-[14px] text-ink-soft"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-ink">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="h-10 rounded-lg border border-blue-edge bg-bg px-3 text-[14px] text-ink-soft"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-ink">ID utilisateur</label>
              <input
                type="text"
                value={user.userId}
                disabled
                className="h-10 rounded-lg border border-blue-edge bg-bg px-3 text-[14px] text-ink-soft"
              />
            </div>

            <div className="rounded-lg bg-blue-veil p-4 mt-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue" />
                <span className="text-[14px] font-medium text-ink">Compte vérifié</span>
              </div>
              <p className="mt-1 text-[13px] text-ink-soft">
                Votre compte a été vérifié par code OTP.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-line flex justify-end">
            <Button variant="danger" onClick={handleLogout}>
              Se déconnecter
            </Button>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
