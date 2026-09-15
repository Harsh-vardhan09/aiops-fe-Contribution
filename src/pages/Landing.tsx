import LightPillar from "@/components/LightPillar";
import Navbar from "../components/Navbar";
import {
  badgeAccent,
  body,
  btnGhost,
  btnPrimary,
  card,
  h1,
  h2,
  h3,
  panelPad,
} from "../lib/ui";

const features = [
  {
    icon: "\u{1F680}",
    title: "Fast Incident Detection",
    body: "Detect anomalies and incidents instantly with advanced AI algorithms",
  },
  {
    icon: "\u{1F9E0}",
    title: "Intelligent Analysis",
    body: "Get AI-powered root cause analysis and insights for every incident",
  },
  {
    icon: "⏱️",
    title: "Reduce MTTR",
    body: "Slash your mean time to resolution with automated recommendations",
  },
  {
    icon: "\u{1F512}",
    title: "Enterprise Security",
    body: "Bank-grade security with encrypted data and compliance certifications",
  },
  {
    icon: "\u{1F4C8}",
    title: "Scalable Infrastructure",
    body: "Handle millions of events with our distributed, scalable platform",
  },
  {
    icon: "\u{1F517}",
    title: "Easy Integration",
    body: "Integrate with your existing tools and workflows in minutes",
  },
];

export default function Landing({
  session,
  onAuthClick,
  onDashboardClick,
}: {
  session: any;
  onAuthClick: (mode: "login" | "signup") => void;
  onDashboardClick: () => void;
}) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black">
      <Navbar
        session={session}
        onAuthClick={onAuthClick}
        onDashboardClick={onDashboardClick}
      />

      <div className="mx-auto w-full max-w-7xl space-y-12 px-5 py-12 sm:px-8 lg:space-y-20 lg:py-20">
        {/* Hero -------------------------------------------------------- */}
        <section className="relative flex min-h-[30rem] items-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl sm:p-10">
          <div className="relative z-10 max-w-2xl">
            <span className={badgeAccent}>
              The NO.1 AI-driven platform for intelligent operations
            </span>

            <h1 className={`mt-5 ${h1}`}>
              Comprehensive AI Ops solutions designed for every digital business
            </h1>

            <p className={`mt-6 max-w-lg ${body}`}>
              We combine advanced technology with expert guidance to detect
              incidents early, analyze root causes instantly, and keep your
              operations running securely around the clock.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => onAuthClick("signup")}
                className={btnPrimary}
              >
                Get a demo
              </button>

              <button className={btnGhost}>Learn more</button>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 w-[45%] overflow-hidden border-l border-white/10 max-lg:hidden">
            <LightPillar
              topColor="#27d036"
              bottomColor="#d5bdd4"
              intensity={1}
              rotationSpeed={0.3}
              glowAmount={0.002}
              pillarWidth={3}
              pillarHeight={0.4}
              noiseIntensity={0.5}
              pillarRotation={25}
              interactive={false}
              mixBlendMode="screen"
              quality="high"
              className=""
            />
          </div>
        </section>

        {/* Features ---------------------------------------------------- */}
        <section className={panelPad}>
          <span className={badgeAccent}>Built for operations teams</span>

          <h2 className={`mt-5 max-w-2xl ${h2}`}>Why choose AI Ops?</h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className={`${card} hover:border-green-400/30 hover:bg-green-400/[0.06]`}
              >
                <div className="text-2xl">{f.icon}</div>
                <h3 className={`mt-4 ${h3}`}>{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA --------------------------------------------------------- */}
        <section
          className={`${panelPad} bg-linear-to-br from-green-400/10 to-transparent text-center`}
        >
          <h2 className={`mx-auto max-w-3xl ${h2}`}>
            Ready to transform your operations?
          </h2>

          <p className={`mx-auto mt-5 max-w-lg ${body}`}>
            Join thousands of teams using AI Ops to manage their infrastructure
          </p>

          <button
            onClick={() => onAuthClick("signup")}
            className={`${btnPrimary} mt-8 px-8 py-4`}
          >
            Start your free trial
          </button>
        </section>
      </div>

      <footer className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-5 py-10 text-center text-sm text-white/40 sm:px-8">
          &copy; 2026 AI Ops. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
