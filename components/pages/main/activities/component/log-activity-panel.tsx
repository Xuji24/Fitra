"use client";

import { useState, useEffect, useCallback } from "react";
import { joinedRacesData } from "@/data/activities-data";
import { X, Check, Loader2, AlertCircle, ExternalLink } from "lucide-react";

interface Props {
  open: boolean;
  preselectedRaceId?: string;
  onClose: () => void;
}

/** Shape returned by /api/strava/activities */
interface StravaActivity {
  id: number;
  name: string;
  type: "run" | "walk" | "cycle";
  stravaType: string;
  distance: number;
  movingTime: number;
  elapsedTime: number;
  startDate: string;
  averagePace: string;
  elevationGain: number;
  calories: number | null;
  imported: boolean;
  stravaUrl: string;
}

/** Format seconds to readable duration */
function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

/** Format ISO date to short readable form */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const LogActivityPanel = ({ open, preselectedRaceId, onClose }: Props) => {
  const inProgressRaces = joinedRacesData.filter(
    (r) => r.status === "in-progress"
  );

  const [raceId, setRaceId] = useState(preselectedRaceId ?? inProgressRaces[0]?.id ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successDistance, setSuccessDistance] = useState("");

  // Strava state
  const [stravaConnected, setStravaConnected] = useState<boolean | null>(null); // null = loading
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<StravaActivity | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Sync preselected race when parent changes it
  if (preselectedRaceId && preselectedRaceId !== raceId && open) {
    setRaceId(preselectedRaceId);
  }

  /** Fetch Strava activities from our API (with optional date filtering) */
  const fetchStravaActivities = useCallback(async () => {
    setFetchError(null);
    try {
      // Build URL with optional date-range filters based on the selected race
      const url = new URL("/api/strava/activities", window.location.origin);

      // If a race is selected, filter activities up to the race date
      const selectedRace = inProgressRaces.find((r) => r.id === raceId);
      if (selectedRace?.date) {
        // Only fetch activities before the race event date (inclusive)
        url.searchParams.set("before", selectedRace.date);
      }

      const res = await fetch(url.toString());
      const data = await res.json();

      if (res.status === 404 && data.connected === false) {
        setStravaConnected(false);
        return;
      }

      if (res.status === 401) {
        setStravaConnected(false);
        return;
      }

      if (!res.ok) {
        setFetchError(data.error || "Failed to load activities");
        return;
      }

      setStravaConnected(true);
      setActivities(data.activities ?? []);
    } catch {
      setFetchError("Unable to connect to Strava");
    }
  }, [raceId, inProgressRaces]);

  // Fetch activities when panel opens
  useEffect(() => {
    if (open) {
      fetchStravaActivities();
    } else {
      // Reset state when closed
      setSelectedActivity(null);
      setSuccess(false);
    }
  }, [open, fetchStravaActivities]);

  /** Redirect to Strava OAuth */
  const handleStravaConnect = () => {
    window.location.href = "/api/strava/auth";
  };

  /** Select a Strava activity to import */
  const handleSelectActivity = (activity: StravaActivity) => {
    setSelectedActivity(activity);
  };

  /** Import selected activity into the chosen race */
  const handleImport = async () => {
    if (!selectedActivity || !raceId) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/strava/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stravaActivityId: selectedActivity.id,
          registrationId: raceId,
          distance: selectedActivity.distance,
          activityType: selectedActivity.type,
          activityDate: selectedActivity.startDate.split("T")[0],
          activityName: selectedActivity.name,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessDistance(selectedActivity.distance.toFixed(1));
        setSuccess(true);

        // Mark as imported in local list
        setActivities((prev) =>
          prev.map((a) =>
            a.id === selectedActivity.id ? { ...a, imported: true } : a
          )
        );

        setTimeout(() => {
          setSuccess(false);
          setSelectedActivity(null);
          onClose();
        }, 1500);
      } else {
        setFetchError(data.error || "Failed to import activity");
        setSubmitting(false);
      }
    } catch {
      setFetchError("Import failed. Please try again.");
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/5 dark:border-white/5 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 text-[#FC4C02]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
              </svg>
              <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-white font-raleway">
                Log Distance via Strava
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A1A1A]/40 dark:text-white/40 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success state */}
        {success && (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
              <Check className="w-7 h-7 text-emerald-500" />
            </div>
            <p className="font-semibold text-[#1A1A1A] dark:text-white font-raleway">
              Distance Logged!
            </p>
            <p className="text-sm text-[#1A1A1A]/40 dark:text-white/30 mt-1 font-merriweather-sans">
              +{successDistance} km imported from Strava
            </p>
          </div>
        )}

        {/* Loading state */}
        {!success && stravaConnected === null && (
          <div className="p-10 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#FC4C02] mx-auto mb-3" />
            <p className="text-sm text-[#1A1A1A]/50 dark:text-white/40 font-merriweather-sans">
              Checking Strava connection...
            </p>
          </div>
        )}

        {/* Not connected — show connect button */}
        {!success && stravaConnected === false && (
          <div className="p-5">
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-[#FC4C02]/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#FC4C02]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                </svg>
              </div>
              <h3 className="font-raleway font-bold text-base text-[#1A1A1A] dark:text-white mb-1">
                Connect to Strava
              </h3>
              <p className="font-merriweather-sans text-sm text-[#1A1A1A]/50 dark:text-white/40 mb-5 max-w-xs mx-auto">
                Link your Strava account to import activities and log distances to your races automatically.
              </p>
              <button
                onClick={handleStravaConnect}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FC4C02] hover:bg-[#E04400] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                </svg>
                Connect with Strava
              </button>
            </div>
          </div>
        )}

        {/* Error state */}
        {fetchError && !success && (
          <div className="px-5 pb-3">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-xs text-red-600 dark:text-red-400">{fetchError}</p>
            </div>
          </div>
        )}

        {/* Connected — show activity list or selected activity confirmation */}
        {!success && stravaConnected === true && !selectedActivity && (
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Connected to Strava
                </span>
              </div>
              <button
                onClick={fetchStravaActivities}
                className="text-xs text-[#FC4C02] hover:text-[#E04400] font-medium cursor-pointer"
              >
                Refresh
              </button>
            </div>

            {activities.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-[#1A1A1A]/50 dark:text-white/40 font-merriweather-sans">
                  No recent activities found on Strava.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {activities.map((activity) => (
                  <button
                    key={activity.id}
                    type="button"
                    disabled={activity.imported}
                    onClick={() => handleSelectActivity(activity)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      activity.imported
                        ? "border-emerald-200 dark:border-emerald-800/30 bg-emerald-50 dark:bg-emerald-900/10 opacity-60"
                        : "border-black/5 dark:border-white/5 bg-[#F5F5F0] dark:bg-[#2A2A2E] hover:border-[#FC4C02]/30 hover:bg-[#FC4C02]/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${
                            activity.type === "run"
                              ? "bg-[#FF5733]/10 text-[#FF5733]"
                              : activity.type === "cycle"
                                ? "bg-blue-500/10 text-blue-500"
                                : "bg-[#FFB800]/10 text-[#FFB800]"
                          }`}>
                            {activity.stravaType}
                          </span>
                          {activity.imported && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                              Already Imported
                            </span>
                          )}
                        </div>
                        <p className="font-raleway font-semibold text-sm text-[#1A1A1A] dark:text-white truncate">
                          {activity.name}
                        </p>
                        <p className="font-merriweather-sans text-xs text-[#1A1A1A]/40 dark:text-white/30 mt-0.5">
                          {formatDate(activity.startDate)} · {activity.averagePace}
                        </p>
                        {/* View on Strava link — API Agreement Section 2.14.5 */}
                        <a
                          href={activity.stravaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 mt-1 text-[10px] text-[#FC4C02] hover:text-[#E04400] font-medium transition-colors"
                        >
                          View on Strava
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-raleway font-bold text-sm text-[#1A1A1A] dark:text-white">
                          {activity.distance.toFixed(1)} km
                        </p>
                        <p className="font-merriweather-sans text-xs text-[#1A1A1A]/40 dark:text-white/30">
                          {formatDuration(activity.movingTime)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
                </div>

                {/* Powered by Strava — API Agreement Section 2.3 Brand Attribution */}
                <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#FC4C02]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                  </svg>
                  <span className="text-[10px] text-[#1A1A1A]/30 dark:text-white/20 font-merriweather-sans">
                    Powered by Strava
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Selected activity — confirm and assign to race */}
        {!success && stravaConnected === true && selectedActivity && (
          <div className="p-5 space-y-4">
            {/* Selected Activity Preview */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FC4C02]/5 border border-[#FC4C02]/15">
              <svg className="w-5 h-5 text-[#FC4C02] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="font-raleway font-semibold text-sm text-[#1A1A1A] dark:text-white truncate">
                  {selectedActivity.name}
                </p>
                <p className="font-merriweather-sans text-xs text-[#1A1A1A]/60 dark:text-white/50">
                  {selectedActivity.distance.toFixed(1)} km · {formatDuration(selectedActivity.movingTime)} · {selectedActivity.averagePace}
                </p>
                <a
                  href={selectedActivity.stravaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-0.5 text-[10px] text-[#FC4C02] hover:text-[#E04400] font-medium transition-colors"
                >
                  View on Strava
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <button
                type="button"
                onClick={() => setSelectedActivity(null)}
                className="text-[#1A1A1A]/30 dark:text-white/30 hover:text-[#1A1A1A] dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Activity Details */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#F5F5F0] dark:bg-[#2A2A2E] rounded-xl p-3 text-center">
                <p className="font-raleway font-bold text-base text-[#FF5733]">
                  {selectedActivity.distance.toFixed(1)}
                </p>
                <p className="font-merriweather-sans text-[10px] text-[#1A1A1A]/40 dark:text-white/30 uppercase tracking-wide">
                  km
                </p>
              </div>
              <div className="bg-[#F5F5F0] dark:bg-[#2A2A2E] rounded-xl p-3 text-center">
                <p className="font-raleway font-bold text-base text-[#1A1A1A] dark:text-white">
                  {formatDuration(selectedActivity.movingTime)}
                </p>
                <p className="font-merriweather-sans text-[10px] text-[#1A1A1A]/40 dark:text-white/30 uppercase tracking-wide">
                  Duration
                </p>
              </div>
              <div className="bg-[#F5F5F0] dark:bg-[#2A2A2E] rounded-xl p-3 text-center">
                <p className="font-raleway font-bold text-base text-[#1A1A1A] dark:text-white">
                  {selectedActivity.elevationGain}m
                </p>
                <p className="font-merriweather-sans text-[10px] text-[#1A1A1A]/40 dark:text-white/30 uppercase tracking-wide">
                  Elevation
                </p>
              </div>
            </div>

            {/* Race Select */}
            <div>
              <label className="block text-xs font-medium text-[#1A1A1A]/60 dark:text-white/40 mb-1.5 uppercase tracking-wider">
                Assign to Race
              </label>
              <select
                value={raceId}
                onChange={(e) => setRaceId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white border-0 focus:ring-2 focus:ring-[#FF5733] outline-none cursor-pointer"
              >
                {inProgressRaces.map((race) => (
                  <option key={race.id} value={race.id}>
                    {race.title} ({race.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Import Button */}
            <button
              onClick={handleImport}
              disabled={submitting || !raceId}
              className="w-full py-3 rounded-xl bg-[#FF5733] hover:bg-[#E84E2E] disabled:opacity-50 text-white text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                  </svg>
                  Import & Log {selectedActivity.distance.toFixed(1)} km
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogActivityPanel;
