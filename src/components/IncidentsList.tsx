import { useEffect, useState } from "react";
import { fetchIncidents, analyzeIncident } from "../api/backend";
import { supabase } from "../lib/supabase";

type Analysis = {
  root_cause: string;
  confidence: number;
  severity: string;
  suggested_fixes: string[];
  needs_human: boolean;
};

export default function IncidentsList() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [analysisByIncident, setAnalysisByIncident] = useState<
    Record<string, Analysis>
  >({});
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }
        load();
      } catch (err: any) {
        console.error("Auth check failed:", err);
        setError("Authentication error");
        setLoading(false);
      }
    };

    checkAuthAndLoad();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchIncidents();
      setIncidents(data || []);
    } catch (err: any) {
      console.error("Failed to load incidents:", err);
      setError(err.message || "Failed to load incidents");
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityClass = (severity: string) => {
    const sev = severity?.toLowerCase();
    if (sev === "high" || sev === "critical")
      return "border-red-400/25 bg-red-400/10 text-red-300";
    if (sev === "medium")
      return "border-amber-400/25 bg-amber-400/10 text-amber-300";
    return "border-green-400/25 bg-green-400/10 text-green-300";
  };

  const section =
    "mt-8 rounded-2xl border border-white/15 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-10";
  const heading =
    "font-mono text-2xl font-bold uppercase leading-tight tracking-tight text-white sm:text-3xl";
  const label =
    "font-mono text-[11px] uppercase tracking-[0.15em] text-white/50";

  if (loading) {
    return (
      <div className={section}>
        <h2 className={heading}>Incidents</h2>
        <p className="mt-4 text-sm text-white/40">Loading incidents...</p>
      </div>
    );
  }

  return (
    <div className={section}>
      <h2 className={heading}>Live Incidents</h2>

      {error && (
        <div className="mt-6 rounded-lg border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          Error: {error}
        </div>
      )}

      {incidents.length === 0 && !error && (
        <p className="mt-6 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-6 text-center text-sm text-white/40">
          No incidents found. Your systems are healthy! 🎉
        </p>
      )}

      <div className="mt-8 space-y-4">
        {incidents.map((incident) => {
          const analysis = analysisByIncident[incident.id];

          return (
            <div
              key={incident.id}
              className="rounded-xl border border-green-400/20 bg-green-400/[0.06] p-5 backdrop-blur-sm transition-colors hover:border-green-400/40 hover:bg-green-400/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-sm font-bold uppercase tracking-wide text-white">
                    {incident.service}
                  </div>
                  <div className="mt-1.5 text-sm leading-relaxed text-white/50">
                    {incident.summary}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-md border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide ${getSeverityClass(incident.severity)}`}
                >
                  {incident.severity}
                </span>
              </div>

              <button
                className="mt-5 rounded-lg border border-white/15 px-4 py-2 font-mono text-xs uppercase tracking-wide text-white transition-colors hover:bg-white/10 disabled:opacity-50"
                onClick={async () => {
                  try {
                    setAnalyzingId(incident.id);
                    const result = await analyzeIncident(incident.id);

                    setAnalysisByIncident((prev) => ({
                      ...prev,
                      [incident.id]: result.analysis,
                    }));
                  } catch (e) {
                    console.error("Analysis failed", e);
                    alert("Failed to run analysis");
                  } finally {
                    setAnalyzingId(null);
                  }
                }}
                disabled={analyzingId === incident.id}
              >
                {analyzingId === incident.id ? "🤖 Analyzing..." : "🤖 Run AI Analysis"}
              </button>

              {/* AI Analysis Result */}
              {analysis && (
                <div className="mt-5 rounded-xl border border-green-400/25 bg-black/30 p-5 backdrop-blur-sm">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wide text-green-300">
                    📊 AI Analysis Result
                  </h4>
                  <div className="mt-4 space-y-3">
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                      <span className={`${label} sm:w-48 sm:shrink-0`}>🎯 Root Cause</span>
                      <span className="text-sm text-white/80">{analysis.root_cause}</span>
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                      <span className={`${label} sm:w-48 sm:shrink-0`}>📈 Confidence</span>
                      <span className="text-sm text-white/80">
                        {analysis.confidence !== undefined
                          ? `${(analysis.confidence * 100).toFixed(0)}%`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                      <span className={`${label} sm:w-48 sm:shrink-0`}>🚨 Severity</span>
                      <span className="text-sm text-white/80">{analysis.severity}</span>
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                      <span className={`${label} sm:w-48 sm:shrink-0`}>👤 Needs Human Review</span>
                      <span className="text-sm text-white/80">
                        {analysis.needs_human ? "Yes" : "No"}
                      </span>
                    </div>

                    {analysis.suggested_fixes?.length > 0 && (
                      <div className="border-t border-white/10 pt-4">
                        <span className={label}>💡 Suggested Fixes</span>
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/70">
                          {analysis.suggested_fixes.map((fix, idx) => (
                            <li key={idx}>{fix}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
