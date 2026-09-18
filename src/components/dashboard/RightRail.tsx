import {
  Activity,
  HeartPulse,
  Clock,
  Zap,
  CheckCircle,
  Radio,
  Server,
  AlertCircle,
  Cpu,
  Database,
  KeyRound,
  Bot,
} from "lucide-react";

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  type: "incident" | "ai" | "log" | "project" | "health";
}

interface RightRailProps {
  totalProjects: number;
  activeIncidents: number;
  eventsToday: number | null;
  monitoredServices: number;
  systemHealth?: "healthy" | "degraded" | "critical";
  activities?: ActivityItem[];
  hasActiveApiKey?: boolean;
}

export default function RightRail({
  totalProjects,
  activeIncidents,
  eventsToday,
  monitoredServices,
  systemHealth = "healthy",
  activities = [],
  hasActiveApiKey = false,
}: RightRailProps) {
  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "ai":
        return <Bot className="h-3 w-3 text-green-400" />;
      case "incident":
        return <AlertCircle className="h-3 w-3 text-red-400" />;
      case "log":
        return <Radio className="h-3 w-3 text-emerald-400" />;
      case "project":
        return <Server className="h-3 w-3 text-white/70" />;
      default:
        return <CheckCircle className="h-3 w-3 text-green-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-4 text-white">
      {/* System Overview Card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 backdrop-blur-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <Activity className="h-4 w-4 text-green-400" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
            System Overview
          </h3>
        </div>

        {/* 2x2 Metric Grid */}
        <div className="mt-3.5 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-white/5 bg-black/40 p-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Projects
            </div>
            <div className="mt-1 font-mono text-lg font-bold text-white">
              {totalProjects}
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-black/40 p-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Incidents
            </div>
            <div
              className={`mt-1 font-mono text-lg font-bold ${
                activeIncidents > 0 ? "text-red-400 animate-pulse" : "text-green-400"
              }`}
            >
              {activeIncidents}
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-black/40 p-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Events Today
            </div>
            <div className="mt-1 font-mono text-lg font-bold text-white">
              {eventsToday !== null ? eventsToday.toLocaleString() : "--"}
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-black/40 p-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Services
            </div>
            <div className="mt-1 font-mono text-lg font-bold text-white">
              {monitoredServices}
            </div>
          </div>
        </div>
      </div>

      {/* System Health Card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-green-400" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              System Health
            </h3>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-green-400/30 bg-green-400/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-green-300">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            {systemHealth === "healthy"
              ? "Healthy"
              : systemHealth === "degraded"
              ? "Degraded"
              : "Critical"}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-white/50">Status</span>
          <span className="font-mono text-white/90">
            {activeIncidents === 0 ? "Operational" : `${activeIncidents} Active Issue(s)`}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-white/50">Backend Probe</span>
          <span className="font-mono text-green-400">Connected</span>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 backdrop-blur-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <Clock className="h-4 w-4 text-green-400" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
            Recent Activity
          </h3>
        </div>

        <div className="mt-3 flex flex-col gap-2.5">
          {activities.length === 0 ? (
            <div className="py-5 px-3 text-center rounded-xl border border-white/5 bg-black/30">
              <Clock className="h-4 w-4 text-white/20 mx-auto mb-1.5" />
              <p className="font-mono text-xs text-white/50">No activity yet</p>
              <p className="text-[11px] text-white/30 mt-0.5 leading-relaxed">
                Actions in this session will appear here.
              </p>
            </div>
          ) : (
            activities.slice(0, 4).map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/40 p-3 transition-colors hover:border-white/15"
              >
                <div className="mt-0.5 rounded-lg bg-white/5 p-1.5 shrink-0">
                  {getActivityIcon(act.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-xs font-bold text-white">
                      {act.title}
                    </span>
                    <span className="font-mono text-[10px] text-white/40 shrink-0 ml-1">
                      {act.time}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-white/50 leading-relaxed truncate">
                    {act.subtitle}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Integrations & API Activity */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 backdrop-blur-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <Zap className="h-4 w-4 text-green-400" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
            Integrations
          </h3>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-black/40 p-2.5 text-xs">
            <Cpu className="h-4 w-4 text-green-400 shrink-0" />
            <div className="min-w-0">
              <div className="font-mono text-[11px] font-bold text-white truncate">
                AI Engine
              </div>
              <div className="text-[10px] text-green-400 flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-green-400 animate-pulse" /> Ready
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-black/40 p-2.5 text-xs">
            <Database className="h-4 w-4 text-green-400 shrink-0" />
            <div className="min-w-0">
              <div className="font-mono text-[11px] font-bold text-white truncate">
                Supabase
              </div>
              <div className="text-[10px] text-green-400 flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-green-400" /> Connected
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-black/40 p-2.5 text-xs">
            <KeyRound className={`h-4 w-4 shrink-0 ${hasActiveApiKey ? "text-green-400" : "text-white/40"}`} />
            <div className="min-w-0">
              <div className="font-mono text-[11px] font-bold text-white truncate">
                API Auth
              </div>
              <div className={`text-[10px] flex items-center gap-1 ${hasActiveApiKey ? "text-green-400" : "text-white/40"}`}>
                <span className={`h-1 w-1 rounded-full ${hasActiveApiKey ? "bg-green-400" : "bg-white/30"}`} />
                {hasActiveApiKey ? "Configured" : "Pending"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-black/40 p-2.5 text-xs">
            <Radio className={`h-4 w-4 shrink-0 ${activeIncidents > 0 ? "text-green-400" : "text-amber-400"}`} />
            <div className="min-w-0">
              <div className="font-mono text-[11px] font-bold text-white truncate">
                Telemetry
              </div>
              <div className={`text-[10px] flex items-center gap-1 ${activeIncidents > 0 ? "text-green-400" : "text-amber-400"}`}>
                <span className={`h-1 w-1 rounded-full ${activeIncidents > 0 ? "bg-green-400 animate-pulse" : "bg-amber-400"}`} />
                {activeIncidents > 0 ? "Active" : "Standby"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
