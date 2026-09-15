import { useState } from "react";
import Navbar from "../components/Navbar";
import { createProject } from "../api/backend";
import IncidentsList from "../components/IncidentsList";
import { CheckCircle2, Check } from "lucide-react";

function Dashboard({ 
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* ambient green glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-green-400/10 blur-[120px]" />

      <div className="relative">
        <Navbar session={initialSession} onLogoClick={onNavigateHome} />

        <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          {/* Create Project */}
          <section className="rounded-2xl border border-white/15 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-10">
            {/* <h1 className="font-mono text-2xl font-bold uppercase leading-tight tracking-tight text-white sm:text-3xl">
              Create project
            </h1> */}
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/50">
              Spin up a project to get an API key and start streaming incidents.
            </p>

            {error && (
              <div className="mt-6 rounded-lg border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
                  Project Name
                </label>
                <input
                  type="text"
                  placeholder="My AI Operations Project"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleCreateProject()}
                  className="w-full rounded-lg border border-green-400/20 bg-green-400/[0.06] px-4 py-3 text-sm text-white backdrop-blur-sm transition-colors placeholder:text-white/30 focus:border-green-400/50 focus:bg-green-400/10 focus:outline-none"
                />
              </div>
              <button 
                onClick={handleCreateProject}
                disabled={loading}
                className="rounded-lg bg-green-400 px-6 py-3 font-mono text-sm font-medium uppercase tracking-wide text-black transition-colors hover:bg-green-300 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>

            {/* API Key */}
            {project && (
              <div className="mt-8 rounded-xl border border-green-400/20 bg-green-400/[0.06] p-5 backdrop-blur-xl sm:p-6">
                <h3 className="flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wide text-green-300">
                  <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                  Project created successfully
                </h3>

                <div className="mt-5 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
                    Project Name
                  </span>
                  <span className="text-sm text-white">{project.name}</span>
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
                          <Check className="h-3.5 w-3.5" /> Copied
                        </>
                      ) : (
                        "Copy"
                      )}
                    </button>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-white/10 bg-black/50 p-3 font-mono text-[13px] text-green-400">
                    {project.api_key}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-white/40">
                    Keep this key secret and secure. Use it to send incidents to AI Ops.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Incidents */}
          <IncidentsList />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;