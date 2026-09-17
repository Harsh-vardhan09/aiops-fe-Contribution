import { useState } from "react";
import { createProject } from "../api/backend";
import IncidentsList from "../components/IncidentsList";
import { CheckCircle2, Check, Bolt } from "lucide-react";

export default function Dashboard() {
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
      const p = await createProject(projectName);
      setProject(p);
      setProjectName("");
    } catch (e: any) {
      console.error("Project creation failed", e);
      setError(e?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyApiKey = () => {
    if (project?.api_key) {
      navigator.clipboard.writeText(project.api_key);
      setCopyFeedback("Copied!");
      setTimeout(() => setCopyFeedback(null), 2000);
    }
  };

  return (
    <>
      {/* Create Project Section */}
        <section className="w-full rounded-2xl border border-white/20 overflow-hidden bg-black p-6 sm:p-8">
          <span className="inline-flex items-center gap-2 rounded-lg bg-green-400/15 px-3 py-1.5 text-xs text-green-300 ring-1 ring-green-400/25">
            <Bolt className="h-3.5 w-3.5 text-green-400" />
            Project Setup
          </span>

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
                type="text"
                placeholder="My AI Operations Project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCreateProject()}
                className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white backdrop-blur-sm transition-colors placeholder:text-white/30 focus:border-green-400/50 focus:bg-white/10 focus:outline-none"
              />
            </div>
            <button
              onClick={handleCreateProject}
              disabled={loading}
              className="rounded-lg border bg-green-400 px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-green-300 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>

          {/* API Key */}
          {project && (
            <div className="mt-6 rounded-xl border border-green-400/20 bg-green-400/[0.06] p-5 backdrop-blur-xl sm:p-6">
              <h3 className="flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wide text-green-300">
                <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                Project created successfully
              </h3>

              <div className="mt-4 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
                  Project Name
                </span>
                <span className="text-sm font-medium text-white">{project.name}</span>
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
                  {project.api_key}
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-white/40">
                  Keep this key secret and secure. Use it to authenticate incident events.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Incidents Section */}
        <IncidentsList />

        {/* Footer */}
        <footer className="mt-auto w-full py-6 text-center text-xs sm:text-sm text-white/40">
          <p>&copy; 2026 AI Ops. All rights reserved.</p>
        </footer>
    </>
  );
}