import { useState } from "react";
import { supabase } from "../lib/supabase";
import Logo from "../components/Logo";
import { createProject } from "../api/backend";
import IncidentsList from "../components/IncidentsList";
import "../styles/dashboard.css"

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
      <header className="">
        <div className="dashboard-header-content">
          <div
            className="dashboard-logo cursor-pointer"
            onClick={onNavigateHome}
          >
            <Logo className="h-6 w-6 text-green-400" />
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
        <div className="mb-12">
          <div className="section-header">
            <h1 className="section-title">Create Project</h1>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="mb-8 flex items-end gap-4">
            <div className="flex-1">
              <label className="mb-2 block font-semibold text-slate-300">
                Project Name
              </label>
              <input
                type="text"
                placeholder="My AI Operations Project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCreateProject()}
                className="w-full rounded-lg border border-slate-400/20 bg-slate-700/50 px-4 py-3 font-[inherit] text-base text-slate-200 transition-colors focus:border-blue-500 focus:bg-slate-700/70 focus:outline-none"
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
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="card-label">API Key</span>
                    <button
                      onClick={handleCopyApiKey}
                      className="cursor-pointer rounded border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-[0.8rem] font-semibold text-blue-400 transition-all hover:border-blue-500/30 hover:bg-blue-500/15"
                    >
                      {copyFeedback ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="api-key-display">{project.api_key}</div>
                  <p className="mt-2 mb-0 text-[0.85rem] text-slate-400">
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
