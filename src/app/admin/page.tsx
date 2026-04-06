"use client";

import { useState, useEffect, useRef, DragEvent, ChangeEvent } from "react";
// Using plain <img> instead of next/image since images.unoptimized is true
import { useRouter } from "next/navigation";
import type { AvailabilityConfig, DaySchedule } from "@/lib/availability";
import { DAY_NAMES, DAY_LABELS, DEFAULT_AVAILABILITY } from "@/lib/availability";

type Tab = "gallery" | "schedule";

const TIERS = [
  { tier: 1, label: "Tier 1 — Minimal", priceLabel: "+$10" },
  { tier: 2, label: "Tier 2 — Detailed", priceLabel: "+$20" },
  { tier: 3, label: "Tier 3 — Intricate", priceLabel: "+$30+" },
];

interface TierImages {
  [tier: number]: string[];
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
function fmtHour(h: number) {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("gallery");
  const [images, setImages] = useState<TierImages>({ 1: [], 2: [], 3: [] });
  const [uploading, setUploading] = useState<Record<number, boolean>>({});
  const [dragOver, setDragOver] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  // Schedule state
  const [availability, setAvailability] = useState<AvailabilityConfig>(DEFAULT_AVAILABILITY);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleSaving, setScheduleSaving] = useState(false);
  const [scheduleMsg, setScheduleMsg] = useState<string | null>(null);
  const [newBlockedDate, setNewBlockedDate] = useState("");

  useEffect(() => {
    fetchAllImages();
  }, []);

  useEffect(() => {
    if (tab === "schedule") fetchSchedule();
  }, [tab]);

  async function fetchAllImages() {
    const results = await Promise.all(
      TIERS.map(async ({ tier }) => {
        const res = await fetch(`/api/admin/images?tier=${tier}`);
        if (res.status === 401) {
          router.push("/admin/login");
          return { tier, images: [] };
        }
        const data = await res.json();
        return { tier, images: data.images as string[] };
      })
    );
    const next: TierImages = { 1: [], 2: [], 3: [] };
    results.forEach(({ tier, images: imgs }) => {
      next[tier] = imgs;
    });
    setImages(next);
  }

  async function uploadFiles(tier: number, files: FileList | File[]) {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setUploading((prev) => ({ ...prev, [tier]: true }));
    setError(null);

    for (const file of fileArray) {
      const formData = new FormData();
      formData.append("tier", String(tier));
      formData.append("file", file);

      const res = await fetch("/api/admin/images/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(`Upload failed: ${data.error}`);
      }
    }

    setUploading((prev) => ({ ...prev, [tier]: false }));
    // Re-fetch to get updated list with sanitized filenames
    const res = await fetch(`/api/admin/images?tier=${tier}`);
    const data = await res.json();
    setImages((prev) => ({ ...prev, [tier]: data.images }));
  }

  async function deleteImage(tier: number, filename: string) {
    if (!confirm(`Delete "${filename}"?`)) return;

    const res = await fetch(
      `/api/admin/images?tier=${tier}&filename=${encodeURIComponent(filename)}`,
      { method: "DELETE" }
    );

    if (res.ok) {
      setImages((prev) => ({
        ...prev,
        [tier]: prev[tier].filter((f) => f !== filename),
      }));
    } else {
      const data = await res.json();
      setError(`Delete failed: ${data.error}`);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  // ── Schedule helpers ──────────────────────────────────────

  async function fetchSchedule() {
    setScheduleLoading(true);
    try {
      const res = await fetch("/api/admin/availability");
      if (res.status === 401) { router.push("/admin/login"); return; }
      const data: AvailabilityConfig = await res.json();
      setAvailability(data);
    } catch {
      setError("Failed to load schedule");
    } finally {
      setScheduleLoading(false);
    }
  }

  async function saveSchedule() {
    setScheduleSaving(true);
    setScheduleMsg(null);
    try {
      const res = await fetch("/api/admin/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(availability),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Save failed");
      } else {
        setScheduleMsg("Schedule saved!");
        setTimeout(() => setScheduleMsg(null), 2000);
      }
    } catch {
      setError("Network error saving schedule");
    } finally {
      setScheduleSaving(false);
    }
  }

  function updateDay(day: string, patch: Partial<DaySchedule>) {
    setAvailability((prev) => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: { ...prev.weeklySchedule[day], ...patch },
      },
    }));
  }

  function addBlockedDate() {
    if (!newBlockedDate) return;
    if (availability.blockedDates.includes(newBlockedDate)) return;
    setAvailability((prev) => ({
      ...prev,
      blockedDates: [...prev.blockedDates, newBlockedDate].sort(),
    }));
    setNewBlockedDate("");
  }

  function removeBlockedDate(d: string) {
    setAvailability((prev) => ({
      ...prev,
      blockedDates: prev.blockedDates.filter((x) => x !== d),
    }));
  }

  function onDrop(tier: number, e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [tier]: false }));
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(tier, e.dataTransfer.files);
    }
  }

  function onFileChange(tier: number, e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(tier, e.target.files);
      e.target.value = "";
    }
  }

  return (
    <div className="min-h-screen bg-milky">
      {/* Header */}
      <header className="bg-white border-b border-brand-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="font-heading text-xl font-bold text-warm-dark">
            Admin Panel
          </h1>
          <p className="text-warm-gray text-xs">Cutify Nails</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="text-xs text-brand-400 hover:underline"
          >
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

      {/* Tab navigation */}
      <div className="bg-white border-b border-brand-100 px-6">
        <nav className="flex gap-6 max-w-7xl mx-auto">
          {([
            ["gallery", "Gallery"],
            ["schedule", "Schedule"],
          ] as [Tab, string][]).map(([key, label]) => (
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
          ))}
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 flex justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-4 font-bold">×</button>
          </div>
        )}

        {/* ── Gallery Tab ── */}
        {tab === "gallery" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {TIERS.map(({ tier, label, priceLabel }) => (
            <div key={tier} className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
              {/* Tier header */}
              <div className="bg-brand-50 px-5 py-4 border-b border-brand-100">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading font-bold text-warm-dark text-base">
                    {label}
                  </h2>
                  <span className="text-xs font-bold text-brand-400 bg-white border border-brand-200 rounded-full px-2.5 py-1">
                    {priceLabel}
                  </span>
                </div>
                <p className="text-xs text-warm-gray mt-1">
                  {images[tier].length} image{images[tier].length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Image grid */}
              <div className="p-4">
                {images[tier].length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {images[tier].map((filename) => (
                      <div
                        key={filename}
                        className="relative aspect-square rounded-xl overflow-hidden group"
                      >
                        <img
                          src={`/assets/Tier_${tier}/${filename}`}
                          alt={filename}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Delete overlay */}
                        <button
                          onClick={() => deleteImage(tier, filename)}
                          className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center"
                          title="Delete image"
                        >
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-lg">
                            ×
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-warm-gray text-sm py-6">
                    No images yet
                  </p>
                )}

                {/* Drop zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver((prev) => ({ ...prev, [tier]: true }));
                  }}
                  onDragLeave={() =>
                    setDragOver((prev) => ({ ...prev, [tier]: false }))
                  }
                  onDrop={(e) => onDrop(tier, e)}
                  onClick={() => fileInputRefs.current[tier]?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                    dragOver[tier]
                      ? "border-brand-400 bg-brand-50"
                      : "border-brand-200 hover:border-brand-400 hover:bg-brand-50"
                  }`}
                >
                  {uploading[tier] ? (
                    <p className="text-brand-400 text-sm font-medium animate-pulse">
                      Uploading…
                    </p>
                  ) : (
                    <>
                      <p className="text-warm-gray text-sm">
                        {dragOver[tier]
                          ? "Drop to upload"
                          : "Drag & drop images here"}
                      </p>
                      <p className="text-brand-400 text-xs mt-1 font-medium">
                        or click to browse
                      </p>
                      <p className="text-warm-gray/60 text-xs mt-1">
                        JPEG, PNG, WebP, GIF · max 10 MB
                      </p>
                    </>
                  )}
                </div>

                <input
                  ref={(el) => { fileInputRefs.current[tier] = el; }}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="hidden"
                  onChange={(e) => onFileChange(tier, e)}
                />
              </div>
            </div>
          ))}
        </div>
        )}

        {/* ── Schedule Tab ── */}
        {tab === "schedule" && (
          <div className="space-y-8">
            {scheduleLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-6 h-6 border-2 border-brand-300 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-warm-gray mt-2">Loading schedule…</p>
              </div>
            ) : (
              <>
                {/* Weekly schedule */}
                <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
                  <div className="bg-brand-50 px-5 py-4 border-b border-brand-100">
                    <h2 className="font-heading font-bold text-warm-dark text-base">
                      Weekly Hours
                    </h2>
                    <p className="text-xs text-warm-gray mt-1">
                      Set your working hours for each day
                    </p>
                  </div>
                  <div className="divide-y divide-brand-100">
                    {DAY_NAMES.map((day) => {
                      const sched = availability.weeklySchedule[day];
                      return (
                        <div
                          key={day}
                          className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
                        >
                          {/* Day toggle */}
                          <label className="flex items-center gap-3 sm:w-36 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={sched.enabled}
                              onChange={(e) =>
                                updateDay(day, { enabled: e.target.checked })
                              }
                              className="w-4 h-4 accent-brand-400 rounded"
                            />
                            <span
                              className={`text-sm font-medium ${
                                sched.enabled ? "text-warm-dark" : "text-warm-gray"
                              }`}
                            >
                              {day.charAt(0).toUpperCase() + day.slice(1)}
                            </span>
                          </label>

                          {/* Time selectors */}
                          {sched.enabled ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={sched.start}
                                onChange={(e) =>
                                  updateDay(day, { start: Number(e.target.value) })
                                }
                                className="text-sm border border-brand-200 rounded-lg px-2 py-1.5 bg-white"
                              >
                                {HOURS.map((h) => (
                                  <option key={h} value={h}>
                                    {fmtHour(h)}
                                  </option>
                                ))}
                              </select>
                              <span className="text-warm-gray text-sm">to</span>
                              <select
                                value={sched.end}
                                onChange={(e) =>
                                  updateDay(day, { end: Number(e.target.value) })
                                }
                                className="text-sm border border-brand-200 rounded-lg px-2 py-1.5 bg-white"
                              >
                                {HOURS.map((h) => (
                                  <option key={h} value={h}>
                                    {fmtHour(h)}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <span className="text-sm text-warm-gray italic">
                              Closed
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Blocked dates */}
                <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
                  <div className="bg-brand-50 px-5 py-4 border-b border-brand-100">
                    <h2 className="font-heading font-bold text-warm-dark text-base">
                      Blocked Dates
                    </h2>
                    <p className="text-xs text-warm-gray mt-1">
                      Block specific days off (vacations, holidays, etc.)
                    </p>
                  </div>
                  <div className="p-5 space-y-4">
                    {/* Add date */}
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={newBlockedDate}
                        onChange={(e) => setNewBlockedDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="text-sm border border-brand-200 rounded-lg px-3 py-1.5 bg-white"
                      />
                      <button
                        onClick={addBlockedDate}
                        disabled={!newBlockedDate}
                        className="text-sm bg-brand-400 text-white px-4 py-1.5 rounded-lg hover:bg-brand-500 disabled:opacity-40 transition-colors"
                      >
                        Block Date
                      </button>
                    </div>

                    {/* List */}
                    {availability.blockedDates.length === 0 ? (
                      <p className="text-sm text-warm-gray">
                        No dates blocked.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {availability.blockedDates.map((d) => (
                          <span
                            key={d}
                            className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-sm px-3 py-1.5 rounded-full border border-red-200"
                          >
                            {new Date(d + "T12:00:00").toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric", year: "numeric" }
                            )}
                            <button
                              onClick={() => removeBlockedDate(d)}
                              className="hover:text-red-800 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Save */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={saveSchedule}
                    disabled={scheduleSaving}
                    className="bg-brand-400 text-white font-medium px-6 py-2.5 rounded-xl hover:bg-brand-500 disabled:opacity-50 transition-colors"
                  >
                    {scheduleSaving ? "Saving…" : "Save Schedule"}
                  </button>
                  {scheduleMsg && (
                    <span className="text-sm text-green-600 font-medium">
                      {scheduleMsg}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
