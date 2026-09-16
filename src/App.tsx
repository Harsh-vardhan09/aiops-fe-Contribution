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
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
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
    setLogoutLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Supabase signOut error:", err);
    }
    setSession(null);
    setCurrentPage("landing");
    localStorage.removeItem("lastPage");
    setLogoutLoading(false);
    setShowLogoutModal(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200">
        <p>Loading...</p>
      </div>
    );
  }

  const isModalOpen = currentPage === "auth" || showLogoutModal;

  return (
    <div className="relative min-h-screen bg-black">
      {/* Underlying layout and page content */}
      <div
        className={`transition-all duration-300 ease-out ${
          isModalOpen
            ? "filter blur-[6px] brightness-75 pointer-events-none select-none"
            : "filter blur-0 brightness-100"
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
              onRequestLogout={() => setShowLogoutModal(true)}
              currentPage={currentPage === "dashboard" ? "dashboard" : "landing"}
            />

            {currentPage === "dashboard" && session ? (
              <div key="dashboard-content" className="animate-fade-swift">
                <Dashboard />
              </div>
            ) : (
              <div key="landing-content" className="animate-fade-swift">
                <Landing onAuthClick={(mode) => handleNavigateToPage("auth", mode)} />
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

      {/* Logout confirmation card overlay */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-5 py-12 bg-black/60 backdrop-blur-md animate-fade-swift"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLogoutModal(false);
          }}
        >
          {/* ambient green glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-400/10 blur-[120px]" />

          <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-black/30 p-8 backdrop-blur-2xl sm:p-10 animate-scale-up shadow-2xl">
            <h2 className="font-mono text-2xl font-bold uppercase leading-tight tracking-tight text-white">
              Are you sure?
            </h2>

            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:border-white/30"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={logoutLoading}
                onClick={handleLogout}
                className="flex-1 rounded-lg bg-red-600/90 hover:bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
              >
                {logoutLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
