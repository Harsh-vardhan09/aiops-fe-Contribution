import { useState } from "react";
import { supabase } from "../lib/supabase";
import "../styles/landing.css";

export default function Landing({ 
  session, 
  onAuthClick, 
  onDashboardClick 
}: { 
  session: any;
  onAuthClick: (mode: "login" | "signup") => void;
  onDashboardClick: () => void;
}) {
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    try {
      await supabase.auth.signOut();
    } finally {
      setIsLogoutLoading(false);
    }
  };

  return (
    <div className="landing-container">
      {/* Navigation Header */}
      <nav className="landing-nav">
        <div className="nav-content">
          <div 
            className="logo"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{ cursor: "pointer" }}
          >
            <span className="logo-icon">⚡</span>
            <span className="logo-text">AI Ops</span>
          </div>
          <div className="nav-buttons">
            {session ? (
              <>
                <span className="nav-user-email">{session.user?.email}</span>
                <button 
                  className="nav-btn signup-btn"
                  onClick={onDashboardClick}
                >
                  Dashboard
                </button>
                <button 
                  className="nav-btn login-btn"
                  onClick={handleLogout}
                  disabled={isLogoutLoading}
                >
                  {isLogoutLoading ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <button 
                  className="nav-btn login-btn"
                  onClick={() => onAuthClick("login")}
                >
                  Login
                </button>
                <button 
                  className="nav-btn signup-btn"
                  onClick={() => onAuthClick("signup")}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Intelligent Operations <span className="highlight">Management</span>
          </h1>
          <p className="hero-subtitle">
            Harness the power of AI to detect, analyze, and resolve incidents in real-time. 
            Reduce mean time to resolution and keep your systems running smoothly.
          </p>
          <div className="hero-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => onAuthClick("signup")}
            >
              Get Started for Free
            </button>
            <button className="btn btn-secondary">
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="floating-card card-1">
            <div className="card-icon">📊</div>
            <p>Real-time Monitoring</p>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">🤖</div>
            <p>AI Analysis</p>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">⚙️</div>
            <p>Auto-Resolution</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose AI Ops?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Fast Incident Detection</h3>
            <p>Detect anomalies and incidents instantly with advanced AI algorithms</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Intelligent Analysis</h3>
            <p>Get AI-powered root cause analysis and insights for every incident</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>Reduce MTTR</h3>
            <p>Slash your mean time to resolution with automated recommendations</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Enterprise Security</h3>
            <p>Bank-grade security with encrypted data and compliance certifications</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Scalable Infrastructure</h3>
            <p>Handle millions of events with our distributed, scalable platform</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔗</div>
            <h3>Easy Integration</h3>
            <p>Integrate with your existing tools and workflows in minutes</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Transform Your Operations?</h2>
        <p>Join thousands of teams using AI Ops to manage their infrastructure</p>
        <button 
          className="btn btn-primary btn-large"
          onClick={() => onAuthClick("signup")}
        >
          Start Your Free Trial
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2026 AI Ops. All rights reserved.</p>
      </footer>
    </div>
  );
}
