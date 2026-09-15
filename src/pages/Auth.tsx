import { useState } from "react";
import { supabase } from "../lib/supabase";
import Logo from "../components/Logo";
import {
  alertError,
  alertSuccess,
  btnPrimary,
  focusRing,
  glow,
  h2,
  input,
  label,
  panelPad,
} from "../lib/ui";

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

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-5 py-12">
      <div className={`${glow} top-1/2 -translate-y-1/2`} />

      <div className={`relative w-full max-w-md ${panelPad}`}>
        <button
          type="button"
          onClick={onNavigateHome}
          className={`flex items-center gap-2 rounded-lg text-white ${focusRing}`}
        >
          <Logo className="h-6 w-6 text-green-400" />
          <span className="text-lg font-semibold tracking-tight">AI Ops</span>
        </button>

        <h2 className={`mt-8 ${h2}`}>
          {isSignUp ? "Create account" : "Welcome back"}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/50">
          {isSignUp 
            ? "Sign up to start managing incidents intelligently" 
            : "Login to your AI Ops account"}
        </p>

        {message && (
          <div
            role="alert"
            className={`mt-6 ${
              message.type === "error" ? alertError : alertSuccess
            }`}
          >
            {message.text}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={isSignUp ? handleSignUp : handleSignIn}>
          <div>
            <label htmlFor="email" className={`mb-2 block ${label}`}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className={input}
            />
          </div>

          <div>
            <label htmlFor="password" className={`mb-2 block ${label}`}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className={input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${btnPrimary} w-full`}
          >
            {loading ? "Loading..." : (isSignUp ? "Create Account" : "Login")}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-white/40">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            type="button"
            className={`rounded font-medium text-green-400 transition-colors hover:text-green-300 ${focusRing}`}
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
