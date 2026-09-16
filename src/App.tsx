import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Navbar from "./components/Navbar";

type PageState = "landing" | "auth" | "dashboard";

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<PageState>("landing");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [isSignOutMenuOpen, setIsSignOutMenuOpen] = useState(false);
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
          const pageToLoad = lastPage && lastPage !== "auth" ? lastPage : "dashboard";
          setCurrentPage(pageToLoad);
          localStorage.setItem("lastPage", pageToLoad);
        } else {
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
          setCurrentPage("dashboard");
          localStorage.setItem("lastPage", "dashboard");
        } else {
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Supabase signOut error:", err);
    }
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

  const isModalOpen = currentPage === "auth";

  return (
    <div className="relative min-h-screen bg-black">
      {/* Underlying layout and page content */}
      <div
        key={session ? "auth-session" : "guest-session"}
        className={`page-blur-transition ${isModalOpen ? "page-blurred" : "page-unblurred"
          }`}
      >
        <main className="min-h-screen bg-black text-white py-6">
          <div className="mx-auto w-full max-w-[920px] px-4 flex flex-col gap-6">
            <Navbar
              session={session}
              onAuthClick={(mode) => handleNavigateToPage("auth", mode)}
              onDashboardClick={() => {
                if (!session) {
                  handleNavigateToPage("auth", "login");
                } else {
                  handleNavigateToPage("dashboard");
                }
              }}
              onHomeClick={() => handleNavigateToPage("landing")}
              onLogoClick={() => handleNavigateToPage("landing")}
              onLogout={handleLogout}
              onMenuOpenChange={setIsSignOutMenuOpen}
              currentPage={currentPage === "dashboard" ? "dashboard" : "landing"}
            />

            {currentPage === "dashboard" && session ? (
              <div
                key="dashboard-content"
                className={`flex flex-col gap-6 animate-fade-swift page-blur-transition ${isSignOutMenuOpen ? "page-blurred" : "page-unblurred"
                  }`}
              >
                <Dashboard />
              </div>
            ) : (
              <div
                key="landing-content"
                className={`flex flex-col gap-6 animate-fade-swift page-blur-transition ${isSignOutMenuOpen ? "page-blurred" : "page-unblurred"
                  }`}
              >
                <Landing
                  session={session}
                  onAuthClick={(mode) => handleNavigateToPage("auth", mode)}
                  onDashboardClick={() => handleNavigateToPage("dashboard")}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Auth card overlay floating above */}
      {currentPage === "auth" && (
        <Auth
          onNavigateHome={() => handleNavigateToPage(session ? "dashboard" : "landing")}
          initialMode={authMode}
        />
      )}
    </div>
  );
}
