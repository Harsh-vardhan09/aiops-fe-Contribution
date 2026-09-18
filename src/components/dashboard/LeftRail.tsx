import {
  FolderGit2,
  Radio,
  Bot,
  Settings,
  Plus,
  ShieldCheck,
  Layers,
} from "lucide-react";

export interface DashboardProject {
  id: string;
  name: string;
  incidentCount: number;
  status: "healthy" | "active" | "degraded";
  api_key?: string;
  created_at?: string;
}

interface LeftRailProps {
  projects: DashboardProject[];
  activeProjectId: string | null;
  onSelectProject: (project: DashboardProject) => void;
  onNewProjectClick: () => void;
  activeQuickAccess: string;
  onSelectQuickAccess: (key: string) => void;
  incidentCount: number;
}

export default function LeftRail({
  projects,
  activeProjectId,
  onSelectProject,
  onNewProjectClick,
  activeQuickAccess,
  onSelectQuickAccess,
  incidentCount,
}: LeftRailProps) {
  return (
    <div className="flex flex-col gap-4 text-white">
      {/* Recent Projects Card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-4 w-4 text-green-400" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              Recent Projects
            </h3>
          </div>
          <button
            onClick={onNewProjectClick}
            className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/5 px-2 py-1 font-mono text-[11px] uppercase tracking-wide text-white/70 transition-colors hover:border-green-400/30 hover:bg-green-400/10 hover:text-green-300"
            title="Create new project"
          >
            <Plus className="h-3 w-3" />
            <span>New</span>
          </button>
        </div>

        {/* Project List */}
        <div className="mt-3 flex flex-col gap-2">
          {projects.length === 0 ? (
            <p className="py-4 text-center font-mono text-xs text-white/40">
              No projects created yet
            </p>
          ) : (
            projects.map((proj) => {
              const isSelected = proj.id === activeProjectId;
              const isHealthy = proj.status === "healthy" || proj.incidentCount === 0;

              return (
                <button
                  key={proj.id}
                  onClick={() => onSelectProject(proj)}
                  className={`group relative flex items-center justify-between rounded-xl border p-3 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-green-400/40 bg-green-400/[0.08] shadow-[0_0_20px_rgba(34,197,94,0.08)]"
                      : "border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`h-2 w-2 rounded-full shrink-0 ${
                        isHealthy
                          ? "bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                          : "bg-red-400 animate-pulse shadow-[0_0_8px_rgba(248,113,113,0.8)]"
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="font-mono text-xs font-bold uppercase tracking-tight text-white truncate group-hover:text-green-300 transition-colors">
                        {proj.name}
                      </div>
                      <div className="text-[11px] text-white/40 flex items-center gap-1.5 mt-0.5">
                        <span>{isHealthy ? "Healthy" : "Active alerts"}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`rounded px-1.5 py-0.5 font-mono text-[10px] uppercase shrink-0 font-medium ${
                      proj.incidentCount > 0
                        ? "border border-red-400/30 bg-red-400/10 text-red-300"
                        : "border border-green-400/20 bg-green-400/10 text-green-300"
                    }`}
                  >
                    {proj.incidentCount} {proj.incidentCount === 1 ? "inc" : "incs"}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Access Navigation */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 backdrop-blur-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <Layers className="h-4 w-4 text-green-400" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
            Quick Access
          </h3>
        </div>

        <nav className="mt-3 flex flex-col gap-1.5">
          <button
            onClick={() => onSelectQuickAccess("incidents")}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              activeQuickAccess === "incidents"
                ? "bg-green-400/15 text-green-300 border border-green-400/30 font-mono uppercase"
                : "text-white/70 hover:bg-white/5 hover:text-white border border-transparent font-mono uppercase"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Radio className="h-3.5 w-3.5 text-red-400 animate-pulse" />
              All Incidents
            </span>
            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/80">
              {incidentCount}
            </span>
          </button>

          <button
            onClick={() => onSelectQuickAccess("projects")}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              activeQuickAccess === "projects"
                ? "bg-green-400/15 text-green-300 border border-green-400/30 font-mono uppercase"
                : "text-white/70 hover:bg-white/5 hover:text-white border border-transparent font-mono uppercase"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <FolderGit2 className="h-3.5 w-3.5 text-green-400" />
              Projects
            </span>
            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/80">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => onSelectQuickAccess("analysis")}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              activeQuickAccess === "analysis"
                ? "bg-green-400/15 text-green-300 border border-green-400/30 font-mono uppercase"
                : "text-white/70 hover:bg-white/5 hover:text-white border border-transparent font-mono uppercase"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Bot className="h-3.5 w-3.5 text-green-400" />
              AI Analysis
            </span>
            <span className="font-mono text-[10px] text-green-400">Live</span>
          </button>

          <button
            onClick={() => onSelectQuickAccess("settings")}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              activeQuickAccess === "settings"
                ? "bg-green-400/15 text-green-300 border border-green-400/30 font-mono uppercase"
                : "text-white/70 hover:bg-white/5 hover:text-white border border-transparent font-mono uppercase"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Settings className="h-3.5 w-3.5 text-white/60" />
              Settings
            </span>
          </button>
        </nav>
      </div>

      {/* Security Status Mini-card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-xs backdrop-blur-sm">
        <div className="flex items-center gap-2 text-green-400">
          <ShieldCheck className="h-4 w-4" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-white">
            Security Guard
          </span>
        </div>
        <p className="mt-2 text-[11px] text-white/50 leading-relaxed">
          AI Ops Autonomous monitoring active with bank-grade API token encryption.
        </p>
      </div>
    </div>
  );
}
