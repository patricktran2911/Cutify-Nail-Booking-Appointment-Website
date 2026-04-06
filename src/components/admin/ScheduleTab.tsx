"use client";

import { useState, useEffect } from "react";
import type { AvailabilityConfig, DaySchedule } from "@/lib/availability";
import { DAY_NAMES, DEFAULT_AVAILABILITY } from "@/lib/availability";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
function fmtHour(h: number) {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

interface ScheduleTabProps {
  onAuthError: () => void;
  onError: (msg: string) => void;
}

export default function ScheduleTab({ onAuthError, onError }: ScheduleTabProps) {
  const [availability, setAvailability] = useState<AvailabilityConfig>(DEFAULT_AVAILABILITY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [newBlockedDate, setNewBlockedDate] = useState("");

  useEffect(() => {
    fetch("/api/admin/availability")
      .then((res) => {
        if (res.status === 401) { onAuthError(); return null; }
        return res.json();
      })
      .then((data: AvailabilityConfig | null) => {
        if (data) setAvailability(data);
      })
      .catch(() => onError("Failed to load schedule"))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(availability),
      });
      if (!res.ok) {
        const data = await res.json();
        onError(data.error ?? "Save failed");
      } else {
        setMsg("Schedule saved!");
        setTimeout(() => setMsg(null), 2000);
      }
    } catch {
      onError("Network error saving schedule");
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-6 h-6 border-2 border-brand-300 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-warm-gray mt-2">Loading schedule…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
                <label className="flex items-center gap-3 sm:w-36 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sched.enabled}
                    onChange={(e) => updateDay(day, { enabled: e.target.checked })}
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

                {sched.enabled ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={sched.start}
                      onChange={(e) => updateDay(day, { start: Number(e.target.value) })}
                      className="text-sm border border-brand-200 rounded-lg px-2 py-1.5 bg-white"
                    >
                      {HOURS.map((h) => (
                        <option key={h} value={h}>{fmtHour(h)}</option>
                      ))}
                    </select>
                    <span className="text-warm-gray text-sm">to</span>
                    <select
                      value={sched.end}
                      onChange={(e) => updateDay(day, { end: Number(e.target.value) })}
                      className="text-sm border border-brand-200 rounded-lg px-2 py-1.5 bg-white"
                    >
                      {HOURS.map((h) => (
                        <option key={h} value={h}>{fmtHour(h)}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <span className="text-sm text-warm-gray italic">Closed</span>
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

          {availability.blockedDates.length === 0 ? (
            <p className="text-sm text-warm-gray">No dates blocked.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availability.blockedDates.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-sm px-3 py-1.5 rounded-full border border-red-200"
                >
                  {new Date(d + "T12:00:00").toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
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
          onClick={save}
          disabled={saving}
          className="bg-brand-400 text-white font-medium px-6 py-2.5 rounded-xl hover:bg-brand-500 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving…" : "Save Schedule"}
        </button>
        {msg && (
          <span className="text-sm text-green-600 font-medium">{msg}</span>
        )}
      </div>
    </div>
  );
}
