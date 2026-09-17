import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import Logo from "../components/Logo";
import { ArrowLeft } from "lucide-react";

export default function Auth({
  onNavigateHome,
  onCloseStart,
  isClosing: externalIsClosing,
  initialMode = "login"
}: {
  onNavigateHome: () => void;
  onCloseStart?: () => void;
  isClosing?: boolean;
  initialMode?: "login" | "signup";
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(initialMode === "signup");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [internalIsClosing, setInternalIsClosing] = useState(false);
  const isClosing = Boolean(externalIsClosing || internalIsClosing);

  const triggerClose = useCallback(() => {
    if (isClosing) return;
    setInternalIsClosing(true);
    onCloseStart?.();
    setTimeout(() => {
      onNavigateHome();
    }, 240);
  }, [isClosing, onCloseStart, onNavigateHome]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerClose]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Signup successful! Please check your email to verify your account." });
      setEmail("");
      setPassword("");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Login successful!" });
      triggerClose();
    }
  };

  const field =
    "w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white backdrop-blur-sm transition-colors placeholder:text-white/30 focus:border-green-400/50 focus:bg-white/10 focus:outline-none";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8 sm:py-12 bg-black/60 backdrop-blur-md ${
        isClosing ? "animate-fade-out-swift pointer-events-none" : "animate-fade-swift"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) triggerClose();
      }}
    >
      {/* ambient green glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-400/10 blur-[120px]" />

      <div
        className={`relative w-full max-w-[420px] rounded-2xl border border-white/15 bg-black/40 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl ${
          isClosing ? "animate-scale-down pointer-events-none" : "animate-scale-up"
        }`}
      >
        <button
          type="button"
          onClick={triggerClose}
          className="group inline-flex items-center gap-2 text-white transition-colors hover:text-green-400"
        >
          <ArrowLeft className="h-4 w-4 text-white/70 transition-transform group-hover:-translate-x-1 group-hover:text-green-400" />
          <Logo className="h-5 w-5 text-green-400" />
          <span className="text-base font-semibold tracking-tight">AI Ops</span>
        </button>

        <div key={isSignUp ? "signup" : "login"} className="animate-fade-swift">
          <h2 className="mt-6 font-mono text-xl sm:text-2xl font-bold uppercase leading-tight tracking-tight text-white">
            {isSignUp ? "Create account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/50">
            {isSignUp
              ? "Sign up to start managing incidents intelligently"
              : "Login to your AI Ops account"}
          </p>

          {message && (
            <div
              className={`mt-4 rounded-lg border px-3.5 py-2.5 text-xs sm:text-sm ${
                message.type === "error"
                  ? "border-red-400/25 bg-red-400/10 text-red-300"
                  : "border-green-400/25 bg-green-400/10 text-green-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={isSignUp ? handleSignUp : handleSignIn}>
            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={field}
              />
            </div>

            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={field}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-lg bg-green-400 py-2.5 px-4 text-sm font-semibold text-black transition-colors hover:bg-green-300 disabled:opacity-50"
            >
              {loading ? "Loading..." : isSignUp ? "Create Account" : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs sm:text-sm text-white/40">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              className="font-medium text-green-400 transition-colors hover:text-green-300"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage(null);
              }}
            >
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
