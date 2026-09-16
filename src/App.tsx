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
    
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data?.session ?? null);
        
        // If user is logged in
        if (data?.session) {
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
      })
      .catch((err) => {
        console.warn("Supabase auth getSession error:", err);
        setCurrentPage("landing");
        setLoading(false);
      });

    // Listen for auth changes
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    try {
      const response = supabase.auth.onAuthStateChange((_e, session) => {
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
      authListener = response.data;
    } catch (err) {
      console.warn("Supabase onAuthStateChange error:", err);
    }

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleNavigateToPage = (page: PageState, mode?: "login" | "signup") => {
    setCurrentPage(page);
    if (mode) setAuthMode(mode);
    localStorage.setItem("lastPage", page);
  };

  const handleLogout = () => {
    setSession(null);
    setCurrentPage("landing");
    localStorage.removeItem("lastPage");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black">
      {/* Landing page in background */}
      {(currentPage === "landing" || currentPage === "auth") && (
        <div
          className={`transition-all duration-300 ${
            currentPage === "auth"
              ? "filter blur-[6px] brightness-75 pointer-events-none select-none"
              : ""
          }`}
        >
          <Landing
            session={session}
            onAuthClick={(mode) => handleNavigateToPage("auth", mode)}
            onDashboardClick={() => handleNavigateToPage("dashboard")}
          />
        </div>
      )}

      {/* Auth card overlay floating above landing */}
      {currentPage === "auth" && (
        <Auth
          onNavigateHome={() => handleNavigateToPage("landing")}
          initialMode={authMode}
        />
      )}

      {/* Dashboard page */}
      {currentPage === "dashboard" &&
        (session ? (
          <div className="animate-fade-swift">
            <Dashboard
              session={session}
              onNavigateHome={() => handleNavigateToPage("landing")}
              onLogout={handleLogout}
            />
          </div>
        ) : (
          <div className="relative">
            <div className="filter blur-[6px] brightness-75 pointer-events-none select-none">
              <Landing
                session={session}
                onAuthClick={(mode) => handleNavigateToPage("auth", mode)}
                onDashboardClick={() => handleNavigateToPage("dashboard")}
              />
            </div>
            <Auth
              onNavigateHome={() => handleNavigateToPage("landing")}
              initialMode={authMode}
            />
          </div>
        ))}
    </div>
  );
}
