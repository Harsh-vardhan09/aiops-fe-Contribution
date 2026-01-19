import { useState } from "react";
import { supabase } from "../lib/supabase";
import "../styles/auth.css";

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
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div 
            className="auth-logo"
            onClick={onNavigateHome}
            style={{ cursor: "pointer" }}
          >
            <span className="auth-logo-icon">⚡</span>
            <span className="auth-logo-text">AI Ops</span>
          </div>
          <h2 className="auth-title">{isSignUp ? "Create Account" : "Welcome Back"}</h2>
          <p className="auth-subtitle">
            {isSignUp 
              ? "Sign up to start managing incidents intelligently" 
              : "Login to your AI Ops account"}
          </p>
        </div>

        {message && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        <form className="auth-form" onSubmit={isSignUp ? handleSignUp : handleSignIn}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-buttons">
            <button 
              type="submit"
              className="auth-btn auth-btn-primary"
              disabled={loading}
            >
              {loading ? "Loading..." : (isSignUp ? "Create Account" : "Login")}
            </button>
          </div>
        </form>

        <div className="auth-toggle">
          <span className="auth-toggle-text">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <span 
              className="auth-toggle-link"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage(null);
              }}
            >
              {isSignUp ? "Login" : "Sign Up"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
