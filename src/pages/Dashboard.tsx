import { useState, useEffect, useRef, useCallback } from "react";
import { fetchProjects, createProject, fetchIncidents, type Project, type Incident } from "../api/backend";
import { supabase } from "../lib/supabase";
import IncidentsList from "../components/IncidentsList";
import LeftRail, { type DashboardProject } from "../components/dashboard/LeftRail";
import RightRail, { type ActivityItem } from "../components/dashboard/RightRail";
import { Check, Bolt, Sparkles, Eye, EyeOff, Copy, ShieldCheck, KeyRound, Loader2, FolderGit2, Radio, Activity } from "lucide-react";

export default function Dashboard({
  onGuideTextChange,
}: {
  onGuideTextChange?: (text: string | null) => void;
} = {}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [projectName, setProjectName] = useState("");
  const [isSyncing, setIsSyncing] = useState(true);
  const [isSyncFading, setIsSyncFading] = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [activeQuickAccess, setActiveQuickAccess] = useState("incidents");
  const [selectedProjectIdFilter, setSelectedProjectIdFilter] = useState<string | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Mobile carousel slide state: 0 = Left Rail, 1 = Center Stage (default), 2 = Right Rail
  const [mobileSlide, setMobileSlide] = useState<number>(1);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const createInputRef = useRef<HTMLInputElement>(null);
  const [dashboardFadeKey, setDashboardFadeKey] = useState<number>(0);
  const guideTimers = useRef<number[]>([]);

  const cancelGuide = useCallback(() => {
    if (guideTimers.current.length > 0) {
      guideTimers.current.forEach(clearTimeout);
      guideTimers.current = [];
      onGuideTextChange?.(null);
    }
  }, [onGuideTextChange]);

  useEffect(() => {
    return () => {
      guideTimers.current.forEach(clearTimeout);
      guideTimers.current = [];
      onGuideTextChange?.(null);
    };
  }, [onGuideTextChange]);

  const addActivity = useCallback((act: ActivityItem) => {
    setActivities((prev) => [act, ...prev.slice(0, 8)]);
  }, []);

  // Fetch projects and incidents directly from backend API (per authenticated user)
  const loadData = useCallback(async () => {
    try {
      setIsSyncing(true);
      setIsSyncFading(false);
      setError(null);

      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setError("User session not found. Please log in.");
        setIsSyncing(false);
        return;
      }

      // 1. Fetch user-scoped projects from backend
      const fetchedProjects = await fetchProjects();
      setProjects(fetchedProjects || []);

      if (fetchedProjects && fetchedProjects.length > 0) {
        // Keep current active project or default to first
        setActiveProject((current) => {
          if (current) {
            const found = fetchedProjects.find((p) => p.id === current.id);
            if (found) return found;
          }
          return fetchedProjects[0];
        });
      } else {
        setActiveProject(null);
      }

      // 2. Fetch user-scoped incidents from backend
      const fetchedIncidents = await fetchIncidents();
      setIncidents(fetchedIncidents || []);

      addActivity({
        id: `act-${Date.now()}`,
        title: "Session Synchronized",
        subtitle: `Loaded ${fetchedProjects.length} project(s) & ${fetchedIncidents.length} incident(s)`,
        time: "Just now",
        type: "health",
      });
    } catch (err: any) {
      console.error("Failed to load dashboard data:", err);
      setError(err.message || "Failed to load projects from backend API");
    } finally {
      // Smooth fade-out of sync screen before swift dashboard fade-in
      setIsSyncFading(true);
      setTimeout(() => {
        setIsSyncing(false);
        setIsSyncFading(false);

        // Guide animation for first-time login on mobile
        const isMobile =
          typeof window !== "undefined" &&
          (window.innerWidth < 1024 ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        const hasSeenGuide = sessionStorage.getItem("hasSeenMobileSwipeGuide");

        if (isMobile && !hasSeenGuide) {
          sessionStorage.setItem("hasSeenMobileSwipeGuide", "true");
          onGuideTextChange?.("Swipe to change views");

          // Start at Workspace (1)
          setMobileSlide(1);

          // 5 seconds total divided equally across 4 animations (1.25s per step):
          // Step 1: Workspace -> Projects
          const t1 = window.setTimeout(() => {
            setMobileSlide(0);
          }, 100);

          // Step 2: Projects -> Workspace
          const t2 = window.setTimeout(() => {
            setMobileSlide(1);
          }, 1350);

          // Step 3: Workspace -> System
          const t3 = window.setTimeout(() => {
            setMobileSlide(2);
          }, 2600);

          // Step 4: System -> Workspace
          const t4 = window.setTimeout(() => {
            setMobileSlide(1);
          }, 3850);

          // Return all to normal after 5.1s and re-trigger dashboard fade in animation
          const t5 = window.setTimeout(() => {
            onGuideTextChange?.(null);
            setDashboardFadeKey((prev) => prev + 1);
          }, 5100);

          guideTimers.current = [t1, t2, t3, t4, t5];
        }
      }, 160);
    }
  }, [addActivity, onGuideTextChange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      setError("Please enter a project name");
      return;
    }
    setCreatingProject(true);
    setError(null);
    try {
      const created = await createProject(projectName.trim());
      setProjects((prev) => [created, ...prev]);
      setActiveProject(created);
      setProjectName("");

      addActivity({
        id: `act-${Date.now()}`,
        title: "Project Created",
        subtitle: `${created.name} registered with API credentials`,
        time: "Just now",
        type: "project",
      });
    } catch (e: any) {
      console.error("Project creation failed", e);
      setError(e?.message || "Failed to create project");
    } finally {
      setCreatingProject(false);
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
    setMobileSlide(1);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      createInputRef.current?.focus({ preventScroll: true });
    }, 100);
  };

  // Convert Project to DashboardProject with computed incident counts & status
  const dashboardProjects: DashboardProject[] = projects.map((p) => {
    const projectIncidents = incidents.filter((inc) => inc.project_id === p.id);
    const incCount = projectIncidents.length;
    const isDegraded = projectIncidents.some(
      (inc) => inc.status !== "resolved" && (inc.severity === "high" || inc.severity === "critical")
    );

    return {
      id: p.id,
      name: p.name,
      incidentCount: incCount,
      status: incCount === 0 ? "healthy" : isDegraded ? "degraded" : "active",
      api_key: p.api_key,
      created_at: p.created_at,
    };
  });

  // Calculate metrics
  const totalProjectsCount = projects.length;
  const activeIncidentsCount = incidents.filter((i) => i.status !== "resolved").length;
  const eventsTodayCount = incidents.length > 0
    ? incidents.reduce((sum, inc) => sum + (Number(inc.occurrence_count) || 1), 0)
    : null;
  const monitoredServicesCount = new Set(incidents.map((i) => i.service).filter(Boolean)).size;

  const maskedKey = activeProject?.api_key
    ? activeProject.api_key.slice(0, 4) + "•".repeat(Math.max(16, activeProject.api_key.length - 8)) + activeProject.api_key.slice(-4)
    : "••••••••••••••••••••••••••••••••";

  // Touch handlers for mobile horizontal swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    cancelGuide();
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsSwiping(false);
    setTouchDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX.current;
    const diffY = currentY - touchStartY.current;

    // Trigger horizontal swipe if horizontal movement is greater than vertical movement
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 8) {
      setIsSwiping(true);
      setTouchDeltaX(diffX);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && isSwiping) {
      if (touchDeltaX < -45 && mobileSlide < 2) {
        setMobileSlide((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (touchDeltaX > 45 && mobileSlide > 0) {
        setMobileSlide((prev) => prev - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
    setIsSwiping(false);
    setTouchDeltaX(0);
  };

  if (isSyncing) {
    return (
      <div
        className={`w-full flex min-h-[450px] items-center justify-center transition-all duration-200 ease-out ${
          isSyncFading ? "opacity-0 scale-95 filter blur-xs" : "opacity-100 scale-100 filter blur-none"
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-green-400" />
          <p className="font-mono text-xs uppercase tracking-wider text-white/50">
            Synchronizing Projects
          </p>
        </div>
      </div>
    );
  }

  const scrollToTargetSection = (target: "incidents" | "activity") => {
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
    const sectionId = target === "incidents" ? "live-incidents-section" : "recent-activity-section";

    const performScroll = () => {
      // Find all elements with this section ID
      const elements = Array.from(document.querySelectorAll<HTMLElement>(`[id="${sectionId}"]`));
      
      // Select the element that is actually inside the active visible layout
      let targetEl: HTMLElement | null = null;
      for (const el of elements) {
        const isInsideDesktop = !!el.closest(".desktop-layout-container");
        const isInsideMobile = !!el.closest(".mobile-layout-container");
        
        if (isDesktop && isInsideDesktop) {
          targetEl = el;
          break;
        } else if (!isDesktop && isInsideMobile) {
          targetEl = el;
          break;
        }
      }

      // Fallback: pick any visible element
      if (!targetEl) {
        targetEl = elements.find((el) => el.offsetParent !== null || el.getBoundingClientRect().height > 0) || elements[0] || null;
      }

      if (targetEl) {
        const navOffset = 90; // Fixed navbar clearance
        const elementRect = targetEl.getBoundingClientRect();
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
        const targetY = elementRect.top + currentScrollY - navOffset;

        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: "smooth",
        });
      }
    };

    if (isDesktop) {
      // On desktop, execute immediately
      performScroll();
    } else {
      // On mobile, switch to the proper slide first (1 = Workspace, 2 = System)
      const targetSlide = target === "incidents" ? 1 : 2;
      setMobileSlide(targetSlide);
      // Wait for slide translation animation to start and complete before settling scroll
      setTimeout(performScroll, 50);
      setTimeout(performScroll, 360);
    }
  };

  // Left Rail Component
  const renderLeftRail = () => (
    <LeftRail
      projects={dashboardProjects}
      activeProjectId={activeProject?.id || null}
      onSelectProject={(proj) => {
        cancelGuide();
        const matched = projects.find((p) => p.id === proj.id) || null;
        setActiveProject(matched);
        setSelectedProjectIdFilter(proj.id);
        // On mobile, selecting a project takes you to the center view and scrolls to top!
        setMobileSlide(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
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
        cancelGuide();
        setActiveQuickAccess(key);
        if (key === "projects") {
          handleNewProjectClick();
        } else if (key === "incidents") {
          setSelectedProjectIdFilter(null);
          scrollToTargetSection("incidents");
        } else if (key === "activity") {
          scrollToTargetSection("activity");
        }
      }}
      incidentCount={activeIncidentsCount}
    />
  );

  // Center Main Workspace Component
  const renderCenterStage = () => (
    <main className="w-full max-w-[920px] flex flex-col gap-6 shrink-1 min-w-0">
      {/* Create Project Section */}
      <section className="w-full rounded-2xl overflow-hidden bg-black p-5 sm:p-8 border border-white/10">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-lg bg-green-400/15 px-3 py-1.5 text-xs text-green-300 ring-1 ring-green-400/25">
            <Bolt className="h-3.5 w-3.5 text-green-400" />
            Project Setup
          </span>
        </div>

        <h2 className="mt-4 font-mono text-2xl font-bold uppercase leading-[1.15] tracking-tight text-white sm:text-3xl">
          Create Project
        </h2>

        <p className="mt-2.5 max-w-xl text-xs sm:text-sm leading-relaxed text-white/50">
          Spin up an isolated project to generate a secure write key and start streaming microservice logs into AI Ops.
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
              placeholder="e.g. Production Payment Gateway"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCreateProject()}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white backdrop-blur-sm transition-colors placeholder:text-white/30 focus:border-green-400/50 focus:bg-white/10 focus:outline-none"
            />
          </div>
          <button
            onClick={handleCreateProject}
            disabled={creatingProject}
            className="rounded-lg border bg-green-400 px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-green-300 disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="h-4 w-4" />
            {creatingProject ? "Creating..." : "Create"}
          </button>
        </div>

        {/* SENSITIVE API Key Card with MASKING and Security Notice */}
        {activeProject?.api_key && (
          <div className="mt-6 rounded-xl border border-green-400/20 bg-green-400/[0.06] p-4 backdrop-blur-xl sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wide text-green-300">
                <ShieldCheck className="h-4 w-4 text-green-400 shrink-0" />
                API Credentials
              </h3>
              <span className="flex items-center gap-1 rounded bg-green-400/10 px-2 py-0.5 font-mono text-[10px] uppercase text-green-300 border border-green-400/20">
                <KeyRound className="h-3 w-3" /> Encrypted
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 border-b border-white/10 pb-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
                Active Context
              </span>
              <span className="text-sm font-medium text-white font-mono">
                {activeProject.name}
              </span>
            </div>

            <div className="mt-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
                  API Write Key
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    type="button"
                    className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    title={showApiKey ? "Hide API key" : "Reveal API key"}
                  >
                    {showApiKey ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5 text-white/60" /> Hide
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5 text-white/60" /> Reveal
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCopyApiKey}
                    className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {copyFeedback ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-white/60" /> Copy Key
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-white/10 bg-black/60 p-2.5 font-mono text-xs text-green-400 tracking-wider">
                {showApiKey ? activeProject.api_key : maskedKey}
              </div>

              <p className="mt-2 text-[11px] leading-relaxed text-white/40">
                Confidential write-only token. Never share your credential in public repositories.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Incidents Section */}
      <IncidentsList
        activeProject={activeProject}
        selectedProjectId={selectedProjectIdFilter}
        onActivityAdd={addActivity}
      />
    </main>
  );

  // Right Rail Component
  const renderRightRail = () => (
    <RightRail
      totalProjects={totalProjectsCount}
      activeIncidents={activeIncidentsCount}
      eventsToday={eventsTodayCount}
      monitoredServices={monitoredServicesCount}
      systemHealth={activeIncidentsCount > 0 ? "degraded" : "healthy"}
      activities={activities}
      hasActiveApiKey={Boolean(activeProject?.api_key || projects.some((p) => Boolean(p.api_key)))}
    />
  );

  return (
    <div key={`dashboard-view-${dashboardFadeKey}`} className="w-full flex flex-col gap-6 animate-dashboard-fade">
      {/* 1. Desktop 3-Column Layout (Hidden on Mobile) */}
      <div className="hidden lg:flex desktop-layout-container w-full flex-row justify-center items-start gap-6 xl:gap-8 mx-auto pt-3 lg:pt-5">
        {/* Left Rail: Navigation / Project Context */}
        <aside className="w-[280px] xl:w-[310px] 2xl:w-[320px] shrink-0 sticky top-28 lg:top-[116px] space-y-4 pt-1">
          {renderLeftRail()}
        </aside>

        {/* Center: Main Visual Focus */}
        {renderCenterStage()}

        {/* Right Rail: System Context & Monitoring */}
        <aside className="w-[280px] xl:w-[310px] 2xl:w-[320px] shrink-0 sticky top-28 lg:top-[116px] space-y-4 pt-1">
          {renderRightRail()}
        </aside>
      </div>

      {/* 2. Mobile Full-Width Rail Carousel View (Hidden on Desktop) */}
      <div className="block lg:hidden mobile-layout-container w-full overflow-hidden">
        {/* Mobile Stage Selector Indicator */}
        <div className="flex items-center justify-center gap-2 pt-2.5 pb-4.5 font-mono text-[11px] uppercase tracking-wider">
          <button
            onClick={() => {
              cancelGuide();
              setMobileSlide(0);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              mobileSlide === 0
                ? "bg-green-400/20 text-green-300 border border-green-400/40 shadow-[0_0_12px_rgba(34,197,94,0.15)] font-bold"
                : "text-white/40 hover:text-white/70 border border-transparent"
            }`}
          >
            <FolderGit2 className="h-3 w-3" />
            <span>Projects</span>
          </button>

          <button
            onClick={() => {
              cancelGuide();
              setMobileSlide(1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              mobileSlide === 1
                ? "bg-green-400/20 text-green-300 border border-green-400/40 shadow-[0_0_12px_rgba(34,197,94,0.15)] font-bold"
                : "text-white/40 hover:text-white/70 border border-transparent"
            }`}
          >
            <Radio className="h-3 w-3" />
            <span>Workspace</span>
          </button>

          <button
            onClick={() => {
              cancelGuide();
              setMobileSlide(2);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              mobileSlide === 2
                ? "bg-green-400/20 text-green-300 border border-green-400/40 shadow-[0_0_12px_rgba(34,197,94,0.15)] font-bold"
                : "text-white/40 hover:text-white/70 border border-transparent"
            }`}
          >
            <Activity className="h-3 w-3" />
            <span>System</span>
          </button>
        </div>

        {/* Swipeable Carousel Track with Full-Width Translation Animation */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full min-w-0 max-w-full overflow-hidden touch-pan-y"
        >
          <div
            className="flex items-start w-full"
            style={{
              transform: `translate3d(calc(-${mobileSlide * 100}% + ${touchDeltaX}px), 0, 0)`,
              transition: isSwiping ? "none" : "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
              willChange: isSwiping ? "transform" : "auto",
            }}
          >
            {/* Slide 0: Left Rail (Projects) */}
            <div className="w-full min-w-full shrink-0">
              {renderLeftRail()}
            </div>

            {/* Slide 1: Center Stage (Workspace - Default on Mobile) */}
            <div className="w-full min-w-full shrink-0">
              {renderCenterStage()}
            </div>

            {/* Slide 2: Right Rail (System) */}
            <div className="w-full min-w-full shrink-0">
              {renderRightRail()}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto w-full py-6 text-center text-xs sm:text-sm text-white/40">
        <p>&copy; 2026 AI Ops Copilot. End-to-end user isolation & bank-grade token encryption.</p>
      </footer>
    </div>
  );
}