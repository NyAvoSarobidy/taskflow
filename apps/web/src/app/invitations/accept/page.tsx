// apps/web/src/app/invitations/accept/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { invitationsApi } from "@/lib/api";
import { Check, X, Loader2 } from "lucide-react";

export default function AcceptInvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Token d'invitation manquant");
      return;
    }

    // Si pas connecté, rediriger vers login avec le token
    if (!authLoading && !user) {
      sessionStorage.setItem("invitation_token", token);
      router.push(`/login?invitation=${token}`);
      return;
    }

    // Si connecté, accepter l'invitation
    if (user && token) {
      acceptInvitation();
    }
  }, [token, user, authLoading, router]);

  const acceptInvitation = async () => {
    if (!token) return;
    setIsLoading(true);
    setError("");

    try {
      await invitationsApi.accept(token);
      setSuccess(true);
      setTimeout(() => {
        router.push("/today");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'acceptation");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg p-6">
        <div className="text-center">
          <X className="mx-auto h-12 w-12 text-ink-soft" />
          <h1 className="mt-4 text-[22px] font-semibold text-ink">Invitation invalide</h1>
          <p className="mt-2 text-[14px] text-ink-soft">Token d'invitation manquant.</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Check className="mx-auto h-12 w-12 text-blue" />
          <h1 className="mt-4 text-[22px] font-semibold text-ink">Invitation acceptée !</h1>
          <p className="mt-2 text-[14px] text-ink-soft">
            Bienvenue dans l'organisation. Redirection en cours...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg"
      >
        <h1 className="text-[22px] font-semibold text-ink">Invitation</h1>
        <p className="mt-2 text-[14px] text-ink-soft">
          Vous avez été invité(e) à rejoindre une organisation.
        </p>

        {isLoading && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue" />
            <span className="text-[14px] text-ink-soft">Acceptation en cours...</span>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-lg bg-blue-veil p-3 text-[13px] text-ink">
            {error}
          </div>
        )}
      </motion.div>
    </div>
  );
}
