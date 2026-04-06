"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GalleryTab from "@/components/admin/GalleryTab";
import ScheduleTab from "@/components/admin/ScheduleTab";

type Tab = "gallery" | "schedule";

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("gallery");
  const [error, setError] = useState<string | null>(null);

  const onAuthError = () => router.push("/admin/login");
  const onError = (msg: string) => setError(msg);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-milky">
      <header className="bg-white border-b border-brand-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="font-heading text-xl font-bold text-warm-dark">
            Admin Panel
          </h1>
          <p className="text-warm-gray text-xs">Cutify Nails</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" className="text-xs text-brand-400 hover:underline">
            View site →
          </a>
          <button
            onClick={handleLogout}
            className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="bg-white border-b border-brand-100 px-6">
        <nav className="flex gap-6 max-w-7xl mx-auto">
          {([["gallery", "Gallery"], ["schedule", "Schedule"]] as [Tab, string][]).map(
            ([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === key
                    ? "border-brand-400 text-brand-400"
                    : "border-transparent text-warm-gray hover:text-warm-dark"
                }`}
              >
                {label}
              </button>
            )
          )}
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 flex justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-4 font-bold">×</button>
          </div>
        )}

        {tab === "gallery" && <GalleryTab onAuthError={onAuthError} onError={onError} />}
        {tab === "schedule" && <ScheduleTab onAuthError={onAuthError} onError={onError} />}
      </main>
    </div>
  );
}
