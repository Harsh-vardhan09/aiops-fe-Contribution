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
        <div className="empty-message">
          No incidents found. Your systems are healthy! 🎉
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
                className="incident-action-btn"
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
                <div className="analysis-container">
                  <h4 className="analysis-title">📊 AI Analysis Result</h4>
                  <div className="analysis-content">
                    <div className="analysis-item">
                      <span className="analysis-label">🎯 Root Cause:</span>
                      <span className="analysis-value">{analysis.root_cause}</span>
                    </div>
                    <div className="analysis-item">
                      <span className="analysis-label">📈 Confidence:</span>
                      <span className="analysis-value">
                        {analysis.confidence !== undefined
                          ? `${(analysis.confidence * 100).toFixed(0)}%`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="analysis-item">
                      <span className="analysis-label">🚨 Severity:</span>
                      <span className="analysis-value">{analysis.severity}</span>
                    </div>
                    <div className="analysis-item">
                      <span className="analysis-label">👤 Needs Human Review:</span>
                      <span className="analysis-value">
                        {analysis.needs_human ? "Yes" : "No"}
                      </span>
                    </div>

                    {analysis.suggested_fixes?.length > 0 && (
                      <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(148, 163, 184, 0.2)" }}>
                        <span className="analysis-label">💡 Suggested Fixes:</span>
                        <ul style={{ marginTop: "0.5rem", marginBottom: 0, paddingLeft: "1.5rem" }}>
                          {analysis.suggested_fixes.map((fix, idx) => (
                            <li key={idx} style={{ color: "#cbd5e1", marginBottom: "0.5rem" }}>
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
