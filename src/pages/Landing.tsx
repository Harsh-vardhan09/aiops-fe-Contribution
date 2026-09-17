import { useState, useEffect } from "react";
import LightPillar from "@/components/LightPillar";
import {
  Rocket,
  Brain,
  Timer,
  Lock,
  TrendingUp,
  Link as LinkIcon,
  Radio,
  Bolt,
  Bot,
  Target,
  SearchCode,
  Lightbulb,
  User,
} from "lucide-react";

const HEADLINE_TEXT = "Comprehensive AI Ops solutions designed for every digital business";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(min-width: 1024px)").matches;
  });

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}

function useTypewriter(text: string, speed = 32, startDelay = 150) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayedText(text);
      return;
    }

    let timeoutId: number;
    let currentIndex = 0;

    const startTimeout = window.setTimeout(() => {
      const intervalId = window.setInterval(() => {
        currentIndex++;
        setDisplayedText(text.slice(0, currentIndex));
        if (currentIndex >= text.length) {
          window.clearInterval(intervalId);
        }
      }, speed);

      timeoutId = intervalId;
    }, startDelay);

    return () => {
      window.clearTimeout(startTimeout);
      if (timeoutId) window.clearInterval(timeoutId);
    };
  }, [text, speed, startDelay]);

  return displayedText;
}

const features = [
  {
    icon: Rocket,
    title: "Fast Incident Detection",
    body: "Detect anomalies and incidents instantly with advanced AI algorithms",
  },
  {
    icon: Brain,
    title: "Intelligent Analysis",
    body: "Get AI-powered root cause analysis and insights for every incident",
  },
  {
    icon: Timer,
    title: "Reduce MTTR",
    body: "Slash your mean time to resolution with automated recommendations",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    body: "Bank-grade security with encrypted data and compliance certifications",
  },
  {
    icon: TrendingUp,
    title: "Scalable Infrastructure",
    body: "Handle millions of events with our distributed, scalable platform",
  },
  {
    icon: LinkIcon,
    title: "Easy Integration",
    body: "Integrate with your existing tools and workflows in minutes",
  },
];

export default function Landing({
  session,
  onAuthClick,
  onDashboardClick,
  paused,
}: {
  session?: any;
  onAuthClick: (mode: "login" | "signup") => void;
  onDashboardClick?: () => void;
  paused?: boolean;
}) {
  const isDesktop = useIsDesktop();
  const displayedHeadline = useTypewriter(HEADLINE_TEXT, 32, 150);

  const handlePrimaryCta = () => {
    if (session) {
      onDashboardClick?.();
    } else {
      onAuthClick("signup");
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative w-full rounded-2xl overflow-hidden bg-black flex flex-col lg:flex-row min-h-[380px] lg:min-h-[460px]">
        <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center z-10">
          <span className="inline-flex items-center gap-2 self-start rounded-lg bg-green-400/15 py-1.5 px-3 text-xs text-green-300 ring-1 ring-green-400/25">
            The #1 AI-driven platform for intelligent operations
          </span>

          <h1
            aria-label={HEADLINE_TEXT}
            className="mt-4 grid grid-cols-1 grid-rows-1 font-mono text-2xl font-bold uppercase leading-[1.15] tracking-tight text-white sm:text-3xl lg:text-4xl"
          >
            <span className="invisible select-none pointer-events-none col-start-1 row-start-1" aria-hidden="true">
              {HEADLINE_TEXT}_
            </span>
            <span className="col-start-1 row-start-1">
              <span>{displayedHeadline}</span>
              <span className="inline-block text-green-400 animate-cursor-blink ml-0.5" aria-hidden="true">
                _
              </span>
            </span>
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-white/50 sm:text-base">
            Detect incidents instantly, isolate root causes in real time, and eliminate downtime 24/7.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handlePrimaryCta}
              className="rounded-lg border border-transparent bg-green-400 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-green-300"
            >
              Get a demo
            </button>

            <button
              onClick={() => document.getElementById("learn-more")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:border-white/30"
            >
              Learn more
            </button>
          </div>
        </div>

        <div className="hidden lg:block relative lg:w-[46%] overflow-hidden pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]">
          {isDesktop && (
            <LightPillar
              topColor="#27d036"
              bottomColor="#d5bdd4"
              intensity={0.9}
              rotationSpeed={0.3}
              glowAmount={0.0014}
              pillarWidth={1.8}
              pillarHeight={0.4}
              noiseIntensity={0.4}
              pillarRotation={25}
              interactive={false}
              mixBlendMode="screen"
              quality="high"
              paused={paused}
              className="filter blur-[0.5px]"
            />
          )}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black via-transparent to-transparent opacity-70" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/30" />
        </div>
      </section>

      {/* Features */}
      <section className="w-full rounded-2xl overflow-hidden bg-black p-6 sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-lg bg-green-400/15 px-3 py-1.5 text-xs text-green-300 ring-1 ring-green-400/25">
          Built for operations teams
        </span>

        <h2 className="mt-4 font-mono text-2xl font-bold uppercase leading-[1.15] tracking-tight text-white sm:text-3xl">
          Why choose AI Ops?
        </h2>

        <div className="mt-8 grid gap-px bg-white/15 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 rounded-lg overflow-hidden border border-white/15">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="bg-black p-6 transition-colors hover:bg-green-400/5 flex flex-col justify-between"
              >
                <div>
                  <div className="text-green-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-mono text-sm sm:text-base font-bold uppercase tracking-tight text-white">
                    {f.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-white/50">
                    {f.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works & Operational Deep Dive */}
      <section id="learn-more" className="scroll-mt-24 w-full rounded-2xl overflow-hidden bg-black p-6 sm:p-8">
        <span className="inline-flex items-center rounded-lg bg-green-400/15 px-3 py-1.5 text-xs text-green-300 ring-1 ring-green-400/25">
          Intelligent Operations Workflow
        </span>

        <h2 className="mt-4 font-mono text-2xl font-bold uppercase leading-[1.15] tracking-tight text-white sm:text-3xl">
          From Incident Signal to Resolution
        </h2>

        <p className="mt-2.5 max-w-xl text-xs sm:text-sm leading-relaxed text-white/50">
          Automate triage and accelerate root cause resolution with autonomous AI agents.
        </p>

        {/* 3-Step Lifecycle Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 hover:border-green-400/25 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-green-400">01. INGESTION</span>
              <Bolt className="h-4 w-4 text-green-400" />
            </div>
            <h3 className="mt-3 font-mono text-sm font-bold uppercase text-white">Project Setup</h3>
            <p className="mt-2 text-xs leading-relaxed text-white/60">
              Stream service events and metrics in real time with secure API keys.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 hover:border-green-400/25 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-green-400">02. LIVE TRIAGE</span>
              <Radio className="h-4 w-4 text-green-400" />
            </div>
            <h3 className="mt-3 font-mono text-sm font-bold uppercase text-white">Live Monitoring</h3>
            <p className="mt-2 text-xs leading-relaxed text-white/60">
              Track health metrics and automatically classify incident severity.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 hover:border-green-400/25 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-green-400">03. AI ANALYSIS</span>
              <Bot className="h-4 w-4 text-green-400" />
            </div>
            <h3 className="mt-3 font-mono text-sm font-bold uppercase text-white">Remediation</h3>
            <p className="mt-2 text-xs leading-relaxed text-white/60">
              Pinpoint root causes, score confidence, and receive ordered fixes.
            </p>
          </div>
        </div>

        {/* Deep Dive Breakdown Cards */}
        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <h3 className="font-mono text-sm sm:text-base font-bold uppercase tracking-tight text-white flex items-center gap-2">
            <Target className="h-4 w-4 text-green-400" /> What the AI Ops Engine Provides
          </h3>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-green-400/10 p-2 text-green-400 shrink-0">
                <SearchCode className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-mono text-xs font-bold uppercase text-white">Root Cause Analysis</h4>
                <p className="mt-1 text-xs text-white/50 leading-relaxed">
                  Pinpoints the exact failure mechanism across logs, traces, and metrics.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-green-400/10 p-2 text-green-400 shrink-0">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-mono text-xs font-bold uppercase text-white">Confidence Scoring</h4>
                <p className="mt-1 text-xs text-white/50 leading-relaxed">
                  Probabilistic ratings to validate diagnostic certainty before taking action.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-green-400/10 p-2 text-green-400 shrink-0">
                <Lightbulb className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-mono text-xs font-bold uppercase text-white">Suggested Fixes</h4>
                <p className="mt-1 text-xs text-white/50 leading-relaxed">
                  Ordered, step-by-step remediation procedures to reduce MTTR.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-green-400/10 p-2 text-green-400 shrink-0">
                <User className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-mono text-xs font-bold uppercase text-white">Human Safeguards</h4>
                <p className="mt-1 text-xs text-white/50 leading-relaxed">
                  Flags high-impact actions that require human review and sign-off.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full rounded-2xl border border-white/20 bg-gradient-to-br from-green-400/10 to-transparent p-8 sm:p-12 text-center">
        <h2 className="mx-auto max-w-2xl font-mono text-2xl font-bold uppercase leading-[1.15] tracking-tight text-white sm:text-3xl">
          Ready to transform your operations?
        </h2>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/50 sm:text-base">
          Join thousands of teams using AI Ops to manage their infrastructure
        </p>

        <button
          onClick={handlePrimaryCta}
          className="mt-6 rounded-lg border border-transparent bg-green-400 px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-green-300"
        >
          Start your free trial
        </button>
      </section>

      {/* Footer */}
      <footer className="mt-auto w-full py-6 text-center text-xs sm:text-sm text-white/40">
        <p>&copy; 2026 AI Ops. All rights reserved.</p>
      </footer>
    </>
  );
}
