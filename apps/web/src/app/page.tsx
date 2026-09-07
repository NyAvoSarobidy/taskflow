// apps/web/src/app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      router.push("/today");
    } else {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-deep text-white">
          <span className="text-[20px] font-bold">TF</span>
        </div>
        <h1 className="text-[24px] font-semibold text-ink">TaskFlow</h1>
        <p className="text-[14px] text-ink-soft">
          Chargement...
        </p>
      </div>
    </main>
  );
}
