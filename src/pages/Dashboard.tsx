import { useState } from "react";
import { supabase } from "../lib/supabase";
import { createProject } from "../api/backend";
import IncidentsList from "../components/IncidentsList";
import "../styles/dashboard.css";

export default function Dashboard({ 
  session: initialSession,
  onNavigateHome 
}: { 
  session: any;
  onNavigateHome: () => void;
}) {
  const [project, setProject] = useState<any | null>(null);
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      setError("Please enter a project name");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await createProject(projectName);
      if (res.error) {
        setError(res.error);
      } else {
        setProject(res);
        setProjectName("");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyApiKey = async () => {
    if (!project?.api_key) return;
    
    try {
      await navigator.clipboard.writeText(project.api_key);
      setCopyFeedback("Copied to clipboard!");
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (err) {
      setCopyFeedback("Failed to copy");
      setTimeout(() => setCopyFeedback(null), 2000);
    }
  };

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    try {
      await supabase.auth.signOut();
    } finally {
      setIsLogoutLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div 
            className="dashboard-logo"
            onClick={onNavigateHome}
            style={{ cursor: "pointer" }}
          >
            <span className="dashboard-logo-icon">⚡</span>
            <span className="dashboard-logo-text">AI Ops</span>
          </div>
          <div className="dashboard-user-info">
            {initialSession && (
              <span className="user-email">{initialSession.user?.email}</span>
            )}
            <button 
              className="logout-btn"
              onClick={handleLogout}
              disabled={isLogoutLoading}
            >
              {isLogoutLoading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Create Project Section */}
        <div style={{ marginBottom: "3rem" }}>
          <div className="section-header">
            <h1 className="section-title">Create Project</h1>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div style={{ 
            display: "flex", 
            gap: "1rem",
            alignItems: "flex-end",
            marginBottom: "2rem"
          }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "#cbd5e1", fontWeight: "600" }}>
                Project Name
              </label>
              <input
                type="text"
                placeholder="My AI Operations Project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCreateProject()}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "rgba(51, 65, 85, 0.5)",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.background = "rgba(51, 65, 85, 0.7)";
                  e.currentTarget.style.borderColor = "#3b82f6";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.background = "rgba(51, 65, 85, 0.5)";
                  e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.2)";
                }}
              />
            </div>
            <button 
              className="action-btn action-btn-primary"
              onClick={handleCreateProject}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>

          {/* API Key Card */}
          {project && (
            <div className="card">
              <h3 className="card-title">✅ Project Created Successfully</h3>
              <div className="card-content">
                <div className="card-row">
                  <span className="card-label">Project Name</span>
                  <span className="card-value">{project.name}</span>
                </div>
                <div style={{ marginTop: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span className="card-label">API Key</span>
                    <button
                      onClick={handleCopyApiKey}
                      style={{
                        padding: "0.35rem 0.75rem",
                        background: "rgba(59, 130, 246, 0.1)",
                        border: "1px solid rgba(59, 130, 246, 0.2)",
                        color: "#60a5fa",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(59, 130, 246, 0.15)";
                        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)";
                        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.2)";
                      }}
                    >
                      {copyFeedback ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="api-key-display">{project.api_key}</div>
                  <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: "0.5rem 0 0" }}>
                    Keep this key secret and secure. Use it to send incidents to AI Ops.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Incidents Section */}
        <IncidentsList />
      </div>
    </div>
  );
}
