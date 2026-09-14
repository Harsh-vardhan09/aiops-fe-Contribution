import { useEffect, useState } from "react";
import { fetchIncidents, analyzeIncident } from "../api/backend";
import { supabase } from "../lib/supabase";
import {
  PartyPopper,
  Bot,
  BarChart3,
  Target,
  TrendingUp,
  Siren,
  User,
  Lightbulb,
} from "lucide-react";

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
    if (sev === "high" || sev === "critical") return "severity-high";
    if (sev === "medium") return "severity-medium";
    return "severity-low";
  };

  if (loading) {
    return (
      <div className="incidents-container">
        <h3 className="incidents-title">Incidents</h3>
        <div className="loading-message">Loading incidents...</div>
      </div>
    );
  }

  return (
    <div className="incidents-container">
      <h3 className="incidents-title">Live Incidents</h3>

      {error && <div className="error-message">Error: {error}</div>}

      {incidents.length === 0 && !error && (
        <div className="empty-message flex items-center justify-center gap-2">
          <span>No incidents found. Your systems are healthy!</span>
          <PartyPopper className="h-5 w-5 text-green-400 inline" />
        </div>
      )}

      <div className="incidents-list">
        {incidents.map((incident) => {
          const analysis = analysisByIncident[incident.id];

          return (
            <div key={incident.id} className="incident-item">
              <div className="incident-header">
                <div>
                  <div className="incident-service">{incident.service}</div>
                  <div className="incident-summary">{incident.summary}</div>
                </div>
                <span className={`incident-severity ${getSeverityClass(incident.severity)}`}>
                  {incident.severity}
                </span>
              </div>

              <button
                className="incident-action-btn inline-flex items-center justify-center gap-2"
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
                <Bot className={`h-4 w-4 ${analyzingId === incident.id ? "animate-spin" : ""}`} />
                {analyzingId === incident.id ? "Analyzing..." : "Run AI Analysis"}
              </button>

              {/* AI Analysis Result */}
              {analysis && (
                <div className="analysis-container">
                  <h4 className="analysis-title flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-green-400" /> AI Analysis Result
                  </h4>
                  <div className="analysis-content">
                    <div className="analysis-item">
                      <span className="analysis-label flex items-center gap-1.5">
                        <Target className="h-4 w-4 text-green-400 inline shrink-0" /> Root Cause:
                      </span>
                      <span className="analysis-value">{analysis.root_cause}</span>
                    </div>
                    <div className="analysis-item">
                      <span className="analysis-label flex items-center gap-1.5">
                        <TrendingUp className="h-4 w-4 text-green-400 inline shrink-0" /> Confidence:
                      </span>
                      <span className="analysis-value">
                        {analysis.confidence !== undefined
                          ? `${(analysis.confidence * 100).toFixed(0)}%`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="analysis-item">
                      <span className="analysis-label flex items-center gap-1.5">
                        <Siren className="h-4 w-4 text-red-400 inline shrink-0" /> Severity:
                      </span>
                      <span className="analysis-value">{analysis.severity}</span>
                    </div>
                    <div className="analysis-item">
                      <span className="analysis-label flex items-center gap-1.5">
                        <User className="h-4 w-4 text-slate-300 inline shrink-0" /> Needs Human Review:
                      </span>
                      <span className="analysis-value">
                        {analysis.needs_human ? "Yes" : "No"}
                      </span>
                    </div>

                    {analysis.suggested_fixes?.length > 0 && (
                      <div className="mt-4 border-t border-slate-400/20 pt-4">
                        <span className="analysis-label flex items-center gap-1.5">
                          <Lightbulb className="h-4 w-4 text-yellow-400 inline shrink-0" /> Suggested Fixes:
                        </span>
                        <ul className="mt-2 mb-0 pl-6">
                          {analysis.suggested_fixes.map((fix, idx) => (
                            <li key={idx} className="mb-2 text-slate-300">
                              {fix}
                            </li>
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
