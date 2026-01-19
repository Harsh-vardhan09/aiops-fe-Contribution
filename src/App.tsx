import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";

type PageState = "landing" | "auth" | "dashboard";

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<PageState>("landing");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load last visited page from localStorage
    const lastPage = localStorage.getItem("lastPage") as PageState | null;
    
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      
      // If user is logged in
      if (data.session) {
        // Go to the last page they were on, or dashboard if no previous page
        const pageToLoad = (lastPage && lastPage !== "auth") ? lastPage : "dashboard";
        setCurrentPage(pageToLoad);
        localStorage.setItem("lastPage", pageToLoad);
      } else {
        // If not logged in, show landing
        setCurrentPage("landing");
        if (lastPage && lastPage !== "auth") {
          localStorage.setItem("lastPage", "landing");
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
      
      if (session) {
        // When user logs in, go to dashboard
        setCurrentPage("dashboard");
        localStorage.setItem("lastPage", "dashboard");
      } else {
        // When user logs out, go to landing
        setCurrentPage("landing");
        localStorage.setItem("lastPage", "landing");
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleNavigateToPage = (page: PageState, mode?: "login" | "signup") => {
    setCurrentPage(page);
    if (mode) setAuthMode(mode);
    localStorage.setItem("lastPage", page);
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "#e2e8f0"
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (currentPage === "landing") {
    return (
      <Landing 
        session={session}
        onAuthClick={(mode) => handleNavigateToPage("auth", mode)}
        onDashboardClick={() => handleNavigateToPage("dashboard")}
      />
    );
  }

  if (currentPage === "auth") {
    return (
      <Auth 
        onNavigateHome={() => handleNavigateToPage("landing")}
        initialMode={authMode}
      />
    );
  }

  return session ? (
    <Dashboard 
      session={session}
      onNavigateHome={() => handleNavigateToPage("landing")}
    />
  ) : (
    <Auth 
      onNavigateHome={() => handleNavigateToPage("landing")}
    />
  );
}
