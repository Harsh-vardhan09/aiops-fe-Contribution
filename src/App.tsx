import { useEffect, useState, useRef } from "react";
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
  const [isPillarPaused, setIsPillarPaused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthClosing, setIsAuthClosing] = useState(false);
  const navTimeoutRef = useRef<number | null>(null);
  const currentPageRef = useRef<PageState>("landing");

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    return () => {
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          if (currentPageRef.current === "auth") {
            setIsAuthClosing(true);
            setTimeout(() => {
              setCurrentPage("dashboard");
              localStorage.setItem("lastPage", "dashboard");
              setIsAuthClosing(false);
            }, 260);
          } else {
            setCurrentPage("dashboard");
            localStorage.setItem("lastPage", "dashboard");
          }
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
    setIsAuthClosing(false);
    if (navTimeoutRef.current) {
      clearTimeout(navTimeoutRef.current);
      navTimeoutRef.current = null;
    }

    if (currentPage === "landing" && page !== "landing") {
      // First pause the lightpillar animation, then transition to target page
      setIsPillarPaused(true);
      if (mode) setAuthMode(mode);

      navTimeoutRef.current = window.setTimeout(() => {
        setCurrentPage(page);
        localStorage.setItem("lastPage", page);
        setIsPillarPaused(false);
        navTimeoutRef.current = null;
      }, 150);
    } else {
      setCurrentPage(page);
      if (mode) setAuthMode(mode);
      localStorage.setItem("lastPage", page);
    }
  };

  const handleLogoClick = () => {
    if (currentPage === "landing") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleNavigateToPage("landing");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleHomeClick = () => {
    if (currentPage === "landing") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleNavigateToPage("landing");
    }
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

  const isModalOpen = currentPage === "auth" && !isAuthClosing;

  return (
    <div className="relative min-h-screen flex flex-col bg-black">
      {/* Underlying layout and page content */}
      <div
        key={session ? "auth-session" : "guest-session"}
        className={`flex-1 flex flex-col page-blur-transition ${isModalOpen ? "page-blurred" : "page-unblurred"
          }`}
      >
        <main className="min-h-screen flex-1 flex flex-col bg-black text-white pb-6">
          {/* Sticky Header Layer */}
          <header className="sticky top-0 z-40 w-full flex justify-center pointer-events-none">
            <div
              className={`w-full flex justify-center pointer-events-auto transition-all duration-300 ease-out ${
                isScrolled
                  ? "max-w-full sm:max-w-[990px] px-0 sm:px-4 pt-0 sm:pt-3"
                  : "max-w-[920px] px-4 pt-4 sm:pt-6"
              }`}
            >
              <Navbar
                session={session}
                isScrolled={isScrolled}
                onAuthClick={(mode) => handleNavigateToPage("auth", mode)}
                onDashboardClick={() => {
                  handleNavigateToPage("dashboard");
                }}
                onHomeClick={handleHomeClick}
                onLogoClick={handleLogoClick}
                onLogout={handleLogout}
                onMenuOpenChange={setIsSignOutMenuOpen}
                currentPage={currentPage === "dashboard" ? "dashboard" : "landing"}
              />
            </div>
          </header>

          {/* Page Content Container */}
          <div
            className={`mx-auto w-full px-4 flex flex-col flex-1 gap-6 pt-4 sm:pt-5 transition-all duration-300 ${
              currentPage === "dashboard"
                ? "max-w-[1700px] 2xl:max-w-[1800px] sm:px-6 lg:px-8 xl:px-10"
                : "max-w-[920px]"
            }`}
          >
            {currentPage === "dashboard" ? (
              <div
                key="dashboard-content"
                className={`flex flex-col flex-1 gap-6 animate-fade-swift page-blur-transition ${
                  isSignOutMenuOpen ? "page-blurred" : "page-unblurred"
                }`}
              >
                <Dashboard />
              </div>
            ) : (
              <div
                key="landing-content"
                className={`flex flex-col flex-1 gap-6 animate-fade-swift page-blur-transition ${
                  isSignOutMenuOpen ? "page-blurred" : "page-unblurred"
                }`}
              >
                <Landing
                  session={session}
                  onAuthClick={(mode) => handleNavigateToPage("auth", mode)}
                  onDashboardClick={() => handleNavigateToPage("dashboard")}
                  paused={isSignOutMenuOpen || isModalOpen || isPillarPaused}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Auth card overlay floating above */}
      {currentPage === "auth" && (
        <Auth
          onNavigateHome={() => {
            setIsAuthClosing(false);
            handleNavigateToPage(session ? "dashboard" : "landing");
          }}
          onCloseStart={() => setIsAuthClosing(true)}
          isClosing={isAuthClosing}
          initialMode={authMode}
        />
      )}
    </div>
  );
}
