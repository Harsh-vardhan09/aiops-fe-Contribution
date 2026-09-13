import LightPillar from "@/components/LightPillar";
import Navbar from "../components/Navbar";

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
    <main className="min-h-screen bg-black">
      <Navbar
        session={session}
        onAuthClick={onAuthClick}
        onDashboardClick={onDashboardClick}
      />

      <section className="relative top-10 border border-white/25 flex items-center p-3 lg:mx-5 min-h-120">
        <div className="max-w-5xl">
          <span className="inline-flex items-center gap-2 rounded-lg bg-green-400/15 py-2 px-3 text-xs text-green-300 ring-1 ring-green-400/25">
            The NO.1 AI-driven platform for intelligent operations
          </span>

          <h1 className="mt-2 max-w-2xl font-mono text-2xl font-bold uppercase leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-5xl">
            Comprehensive AI Ops solutions designed for every digital business
          </h1>

          <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/50 sm:text-base">
            We combine advanced technology with expert guidance to detect
            incidents early, analyze root causes instantly, and keep your
            operations running securely around the clock.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onAuthClick("signup")}
              className="bg-green-400 px-6 py-3 font-mono text-sm font-medium uppercase tracking-wide text-black transition-colors hover:bg-green-300 rounded-lg"
            >
              Get a demo
            </button>

            <button className="border border-white/25 px-6 py-3 font-mono text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-white/10 rounded-lg">
              Learn more
            </button>
          </div>
        </div>
        <div className="absolute inset-y-0 right-0 w-[45%] overflow-hidden border-l border-white/10 max-lg:hidden">
          {/* LightPillar here */}
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

      {/* Features */}
      <section className="relative top-20 border border-white/25 p-6 sm:p-10 lg:mx-5">
        <span className="inline-flex items-center gap-2 rounded-lg bg-green-400/15 px-3 py-2 text-xs text-green-300 ring-1 ring-green-400/25">
          Built for operations teams
        </span>

        <h2 className="mt-4 max-w-2xl font-mono text-2xl font-bold uppercase leading-[1.15] tracking-tight text-white sm:text-3xl lg:text-4xl">
          Why choose AI Ops?
        </h2>

        <div className="mt-10 grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-black p-6 transition-colors hover:bg-green-400/5"
            >
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-4 font-mono text-base font-bold uppercase tracking-tight text-white">
                {f.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative top-30 mb-40 border border-white/25 bg-linear-to-br from-green-400/10 to-transparent p-8 text-center sm:p-14 lg:mx-5">
        <h2 className="mx-auto max-w-3xl font-mono text-2xl font-bold uppercase leading-[1.15] tracking-tight text-white sm:text-3xl lg:text-4xl">
          Ready to transform your operations?
        </h2>

        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/50 sm:text-base">
          Join thousands of teams using AI Ops to manage their infrastructure
        </p>

        <button
          onClick={() => onAuthClick("signup")}
          className="mt-8 rounded-lg bg-green-400 px-8 py-4 font-mono text-sm font-medium uppercase tracking-wide text-black transition-colors hover:bg-green-300"
        >
          Start your free trial
        </button>
      </section>

      <footer className="flex h-30 items-center justify-center text-white border border-t-white/15">
        <p className="self-center">&copy; 2026 AI Ops. All rights reserved.</p>
      </footer>

    </main>
  );
}
