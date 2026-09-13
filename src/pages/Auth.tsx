import { useState } from "react";
import { supabase } from "../lib/supabase";
<<<<<<< Updated upstream
import "../styles/auth.css";
import Logo from "../components/Logo";
=======
import Logo from "../components/Logo";
>>>>>>> Stashed changes

export default function Auth({ 
  onNavigateHome,
  initialMode = "login"
}: { 
  onNavigateHome: () => void;
  initialMode?: "login" | "signup";
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(initialMode === "signup");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

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
    }
  };

  const field =
    "w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white backdrop-blur-sm transition-colors placeholder:text-white/30 focus:border-green-400/50 focus:bg-white/10 focus:outline-none";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-5 py-12">
      {/* ambient green glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-400/10 blur-[120px]" />

      <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-white/[0.04] p-8 backdrop-blur-xl sm:p-10">
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-white"
        >
          <Logo className="h-6 w-6 text-green-400" />
          <span className="text-lg font-semibold tracking-tight">AI Ops</span>
        </button>

        <h2 className="mt-8 font-mono text-2xl font-bold uppercase leading-tight tracking-tight text-white">
          {isSignUp ? "Create account" : "Welcome back"}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/50">
          {isSignUp 
            ? "Sign up to start managing incidents intelligently" 
            : "Login to your AI Ops account"}
        </p>

        {message && (
          <div
            className={`mt-6 rounded-lg border px-4 py-3 text-sm ${
              message.type === "error"
                ? "border-red-400/25 bg-red-400/10 text-red-300"
                : "border-green-400/25 bg-green-400/10 text-green-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={isSignUp ? handleSignUp : handleSignIn}>
          <div>
            <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className={field}
            />
          </div>

          <div>
            <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className={field}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-400 px-6 py-3 font-mono text-sm font-medium uppercase tracking-wide text-black transition-colors hover:bg-green-300 disabled:opacity-50"
          >
            {loading ? "Loading..." : (isSignUp ? "Create Account" : "Login")}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-white/40">
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
    </main>
  );
}
