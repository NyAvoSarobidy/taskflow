// apps/web/src/app/(auth)/verify-otp/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp, resendOtp } = useAuth();
  
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await verifyOtp(email, otpCode);
      router.push("/today");
    } catch (err: any) {
      setError(err.message || "Code invalide");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setIsResending(true);
    try {
      await resendOtp(email);
      setSuccessMessage("Nouveau code envoyé !");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'envoi");
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[352px]"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-veil">
          <Mail className="h-5 w-5 text-blue" />
        </div>

        <h2 className="mt-4 text-[22px] font-semibold text-ink">
          Vérifiez votre email
        </h2>
        <p className="mt-1 text-[14px] text-ink-soft">
          Nous vous avons envoyé un code à 6 chiffres. Entrez-le pour activer votre compte.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-ink">Code OTP</label>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              className="h-14 rounded-lg border border-blue-edge bg-center bg-[length:24px] bg-[repeat-x] bg-[center_left_1rem] pl-4 text-center text-[24px] font-semibold tracking-[0.5em] text-ink placeholder:text-ink-soft/40 focus-visible:outline-2 focus-visible:outline-blue"
              required
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-lg bg-blue-veil p-3 text-[13px] text-ink"
              >
                {error}
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-lg bg-blue-veil p-3 text-[13px] text-blue"
              >
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" disabled={isLoading || otpCode.length !== 6}>
            {isLoading ? "Vérification..." : "Vérifier"}
          </Button>
        </form>

        <div className="mt-6 flex flex-col gap-2">
          <Button
            variant="ghost"
            onClick={handleResend}
            disabled={isResending}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4" />
            {isResending ? "Envoi..." : "Renvoyer le code"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
