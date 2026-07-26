"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PreIPODetailPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/pre-ipo");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-sans">
      <div className="text-center space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
        <p className="text-xs text-slate-550 font-bold">Redirecting to Pre-IPO Desk...</p>
      </div>
    </div>
  );
}
