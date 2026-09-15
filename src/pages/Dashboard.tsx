import { useState } from "react";
import Navbar from "../components/Navbar";
import { createProject } from "../api/backend";
import IncidentsList from "../components/IncidentsList";
import {
  alertError,
  alertWarn,
  badgeAccent,
  bodySm,
  btnPrimary,
  btnSmall,
  glow,
  h2,
  h4,
  input as inputCls,
  label,
  panelPad,
} from "../lib/ui";

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
  const [keyVisible, setKeyVisible] = useState(false);

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
      <div className={`${glow} -top-40`} />

      <div className="relative">
        <Navbar session={initialSession} onLogoClick={onNavigateHome} />

        <main className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:py-20">
          {/* Create project ------------------------------------------------ */}
          <section className={panelPad}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className={h2}>Create project</h1>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/50">
                  Spin up a project to get an API key and start streaming
                  incidents into AI Ops.
                </p>
              </div>
              <span className={badgeAccent}>Projects</span>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="min-w-0 flex-1">
                <label htmlFor="project-name" className={`mb-2 block ${label}`}>
                  Project Name
                </label>
                <input
                  id="project-name"
                  type="text"
                  placeholder="My AI Operations Project"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleCreateProject()}
                  aria-invalid={!!error}
                  aria-describedby={error ? "project-error" : undefined}
                  className={inputCls}
                />
                <p className={`mt-2 ${bodySm}`}>
                  Press Enter to create.
                </p>
              </div>
              <button
                onClick={handleCreateProject}
                disabled={loading}
                className={`${btnPrimary} w-full shrink-0 sm:mt-[1.6rem] sm:w-auto`}
              >
                {loading ? "Creating..." : "Create project"}
              </button>
            </div>

            {error && (
              <div
                id="project-error"
                role="alert"
                className={`mt-6 flex items-start gap-3 ${alertError}`}
              >
                <span aria-hidden="true">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Created state ---------------------------------------------- */}
            {project && (
              <div className="mt-10 overflow-hidden rounded-xl border border-green-400/20 bg-green-400/[0.04] backdrop-blur-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-green-400/15 bg-green-400/[0.06] px-5 py-4">
                  <h3 className={h4}>✅ Project created successfully</h3>
                  <span className={badgeAccent}>Live</span>
                </div>

                <dl className="divide-y divide-white/10 px-5">
                  <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                    <dt className={label}>Project Name</dt>
                    <dd className="min-w-0 break-words text-sm text-white">
                      {project.name}
                    </dd>
                  </div>

                  {project.id && (
                    <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                      <dt className={label}>Project ID</dt>
                      <dd className="min-w-0 break-all font-mono text-xs text-white/70">
                        {project.id}
                      </dd>
                    </div>
                  )}

                  <div className="py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <dt className={label}>API Key</dt>
                      <dd className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setKeyVisible((v) => !v)}
                          aria-pressed={keyVisible}
                          className={btnSmall}
                        >
                          {keyVisible ? "Hide" : "Reveal"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCopyApiKey}
                          className={`${btnSmall} ${
                            copyFeedback
                              ? "border-green-400/40 bg-green-400/10 text-green-300"
                              : ""
                          }`}
                        >
                          {copyFeedback ? "✓ Copied" : "Copy"}
                        </button>
                      </dd>
                    </div>

                    <div className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-black/60 px-4 py-3">
                      <code className="block whitespace-pre font-mono text-[13px] leading-relaxed text-green-400">
                        {keyVisible
                          ? project.api_key
                          : "•".repeat(
                              String(project.api_key ?? "").length || 32
                            )}
                      </code>
                    </div>

                    <p role="note" className={`mt-3 flex items-start gap-3 ${alertWarn}`}>
                      <span aria-hidden="true">🔒</span>
                      <span className="text-xs leading-relaxed">
                        Keep this key secret and secure. Send it only from your
                        backend — never commit it or expose it in client code.
                      </span>
                    </p>

                    <span aria-live="polite" className="sr-only">
                      {copyFeedback ?? ""}
                    </span>
                  </div>
                </dl>
              </div>
            )}
          </section>

          {/* Incidents ----------------------------------------------------- */}
          <IncidentsList />
        </main>
      </div>
    </div>
  );
}
