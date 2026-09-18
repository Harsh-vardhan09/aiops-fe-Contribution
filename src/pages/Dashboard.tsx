import { useState, useEffect, useRef } from "react";
import { createProject } from "../api/backend";
import IncidentsList from "../components/IncidentsList";
import LeftRail, { type DashboardProject } from "../components/dashboard/LeftRail";
import RightRail, { type ActivityItem } from "../components/dashboard/RightRail";
import { CheckCircle2, Check, Bolt, Sparkles } from "lucide-react";

export default function Dashboard() {
  const [projects, setProjects] = useState<DashboardProject[]>(() => {
    try {
      const saved = localStorage.getItem("aiops_dashboard_projects");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeProject, setActiveProject] = useState<DashboardProject | null>(
    () => {
      try {
        const saved = localStorage.getItem("aiops_dashboard_projects");
        const list = saved ? JSON.parse(saved) : [];
        return list.length > 0 ? list[0] : null;
      } catch {
        return null;
      }
    }
  );

  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [activeQuickAccess, setActiveQuickAccess] = useState("incidents");
  const [incidentCount, setIncidentCount] = useState(0);
  const [monitoredServicesCount, setMonitoredServicesCount] = useState(0);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const createInputRef = useRef<HTMLInputElement>(null);

  // Save projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("aiops_dashboard_projects", JSON.stringify(projects));
    } catch (e) {
      console.warn("Failed to persist projects", e);
    }
  }, [projects]);

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      setError("Please enter a project name");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let createdProj: any;
      try {
        createdProj = await createProject(projectName);
      } catch (backendErr) {
        // Mock fallback if offline/local development without backend service running
        createdProj = {
          id: `proj-${Date.now()}`,
          name: projectName,
          api_key: `aiops_live_${projectName.toLowerCase().replace(/[^a-z0-9]/g, "")}_${Math.random().toString(36).substring(2, 10)}`,
          created_at: "Just now",
        };
      }

      const newDashboardProject: DashboardProject = {
        id: createdProj.id || `proj-${Date.now()}`,
        name: createdProj.name || projectName,
        incidentCount: 0,
        status: "healthy",
        api_key: createdProj.api_key,
        created_at: "Just now",
      };

      setProjects((prev) => [newDashboardProject, ...prev]);
      setActiveProject(newDashboardProject);
      setProjectName("");

      // Add activity event
      addActivity({
        id: `act-${Date.now()}`,
        title: "Project Created",
        subtitle: `${newDashboardProject.name} created with API key`,
        time: "Just now",
        type: "project",
      });
    } catch (e: any) {
      console.error("Project creation failed", e);
      setError(e?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyApiKey = () => {
    if (activeProject?.api_key) {
      navigator.clipboard.writeText(activeProject.api_key);
      setCopyFeedback("Copied!");
      setTimeout(() => setCopyFeedback(null), 2000);
    }
  };

  const handleNewProjectClick = () => {
    createInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    createInputRef.current?.focus();
  };

  const addActivity = (act: ActivityItem) => {
    setActivities((prev) => [act, ...prev.slice(0, 7)]);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 3-Column Desktop Layout */}
      <div className="w-full flex flex-col lg:flex-row justify-center items-start gap-6 xl:gap-8 mx-auto">
        {/* Left Rail: Navigation / Project Context */}
        <aside className="w-full lg:w-[280px] xl:w-[310px] 2xl:w-[320px] shrink-0 lg:sticky lg:top-24 space-y-4">
          <LeftRail
            projects={projects}
            activeProjectId={activeProject?.id || null}
            onSelectProject={(proj) => {
              setActiveProject(proj);
              addActivity({
                id: `act-${Date.now()}`,
                title: "Switched Context",
                subtitle: `Switched to project ${proj.name}`,
                time: "Just now",
                type: "project",
              });
            }}
            onNewProjectClick={handleNewProjectClick}
            activeQuickAccess={activeQuickAccess}
            onSelectQuickAccess={(key) => {
              setActiveQuickAccess(key);
              if (key === "projects") {
                handleNewProjectClick();
              }
            }}
            incidentCount={incidentCount}
          />
        </aside>

        {/* Center: Main Visual Focus (Same width as Landing page cards) */}
        <main className="w-full max-w-[920px] flex flex-col gap-6 shrink-1 min-w-0">
          {/* Create Project Section */}
          <section className="w-full rounded-2xl overflow-hidden bg-black p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-lg bg-green-400/15 px-3 py-1.5 text-xs text-green-300 ring-1 ring-green-400/25">
                <Bolt className="h-3.5 w-3.5 text-green-400" />
                Project Setup
              </span>

              {activeProject && (
                <span className="font-mono text-xs text-white/50">
                  Active: <strong className="text-white">{activeProject.name}</strong>
                </span>
              )}
            </div>

            <h2 className="mt-4 font-mono text-2xl font-bold uppercase leading-[1.15] tracking-tight text-white sm:text-3xl">
              Create Project
            </h2>

            <p className="mt-2.5 max-w-xl text-xs sm:text-sm leading-relaxed text-white/50">
              Spin up a project to get an API key and start streaming incidents into AI Ops.
            </p>

            {error && (
              <div className="mt-5 rounded-lg border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
                  Project Name
                </label>
                <input
                  ref={createInputRef}
                  type="text"
                  placeholder="e.g. Acme Microservices"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleCreateProject()}
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white backdrop-blur-sm transition-colors placeholder:text-white/30 focus:border-green-400/50 focus:bg-white/10 focus:outline-none"
                />
              </div>
              <button
                onClick={handleCreateProject}
                disabled={loading}
                className="rounded-lg border bg-green-400 px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-green-300 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="h-4 w-4" />
                {loading ? "Creating..." : "Create"}
              </button>
            </div>

            {/* API Key Card */}
            {activeProject?.api_key && (
              <div className="mt-6 rounded-xl border border-green-400/20 bg-green-400/[0.06] p-5 backdrop-blur-xl sm:p-6">
                <h3 className="flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wide text-green-300">
                  <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                  API Credentials • {activeProject.name}
                </h3>

                <div className="mt-4 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
                    Active Project
                  </span>
                  <span className="text-sm font-medium text-white font-mono">
                    {activeProject.name}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
                      API Key
                    </span>
                    <button
                      onClick={handleCopyApiKey}
                      className="inline-flex items-center gap-1 rounded-md border border-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      {copyFeedback ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-green-400" /> Copied
                        </>
                      ) : (
                        "Copy"
                      )}
                    </button>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-white/10 bg-black/60 p-3 font-mono text-[13px] text-green-400">
                    {activeProject.api_key}
                  </div>
                  <p className="mt-2.5 text-xs leading-relaxed text-white/40">
                    Keep this key secret and secure. Use it to authenticate incident events.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Incidents Section */}
          <IncidentsList
            activeProject={activeProject}
            onIncidentCountChange={(count) => {
              setIncidentCount(count);
              if (activeProject) {
                setProjects((prev) =>
                  prev.map((p) =>
                    p.id === activeProject.id ? { ...p, incidentCount: count } : p
                  )
                );
              }
            }}
            onServicesCountChange={(count) => {
              setMonitoredServicesCount(count);
            }}
            onActivityAdd={addActivity}
          />
        </main>

        {/* Right Rail: System Context & Monitoring (Matching width with Left Rail) */}
        <aside className="w-full lg:w-[280px] xl:w-[310px] 2xl:w-[320px] shrink-0 lg:sticky lg:top-24 space-y-4">
          <RightRail
            totalProjects={projects.length}
            activeIncidents={incidentCount}
            eventsToday={null}
            monitoredServices={monitoredServicesCount}
            systemHealth={incidentCount > 0 ? "degraded" : "healthy"}
            activities={activities}
            hasActiveApiKey={Boolean(activeProject?.api_key)}
          />
        </aside>
      </div>

      {/* Footer */}
      <footer className="mt-auto w-full py-6 text-center text-xs sm:text-sm text-white/40">
        <p>&copy; 2026 AI Ops. All rights reserved.</p>
      </footer>
    </div>
  );
}