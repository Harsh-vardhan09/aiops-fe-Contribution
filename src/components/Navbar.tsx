import { useState, useEffect, useRef } from "react";
import Logo from "./Logo";
import { Home, User, LogOut } from "lucide-react";

export default function Navbar({
  session,
  isScrolled = false,
  onAuthClick,
  onDashboardClick,
  onHomeClick,
  onLogoClick,
  onLogout,
  onMenuOpenChange,
  currentPage = "landing",
}: {
  session: any;
  isScrolled?: boolean;
  onAuthClick?: (mode: "login" | "signup") => void;
  onDashboardClick?: () => void;
  onHomeClick?: () => void;
  onLogoClick?: () => void;
  onLogout?: () => void;
  onMenuOpenChange?: (open: boolean) => void;
  currentPage?: "landing" | "dashboard";
}) {
  const [logoutMenuOpen, setLogoutMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const isDashboard = currentPage === "dashboard";

  const toggleMenu = () => {
    setLogoutMenuOpen((prev) => {
      const next = !prev;
      onMenuOpenChange?.(next);
      return next;
    });
  };

  const closeMenu = () => {
    setLogoutMenuOpen(false);
    onMenuOpenChange?.(false);
  };

  // Close logout menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    }

    if (logoutMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [logoutMenuOpen]);

  // Determine active indicator position and color
  let indicatorTransform = "translate-x-0";
  let indicatorBg = "bg-green-400/15";

  if (logoutMenuOpen) {
    indicatorTransform = "translate-x-[calc(200%+1rem)]";
    indicatorBg = "bg-red-500/20";
  } else if (isDashboard) {
    indicatorTransform = "translate-x-[calc(100%+0.5rem)]";
    indicatorBg = "bg-green-400/15";
  }

  return (
    <nav
      ref={navRef}
      className={`relative w-full backdrop-blur-[60px] navbar-blur-60 transition-all duration-300 ease-out ${
        isScrolled
          ? "rounded-none border-b border-white/20 border-t-0 border-x-0 bg-black/75 px-4 py-4 shadow-xl sm:rounded-2xl sm:border sm:border-white/20 sm:px-6 sm:py-4 sm:shadow-2xl"
          : "rounded-2xl border border-white/20 bg-black/60 px-4 py-3 sm:px-6 shadow-none"
      }`}
    >
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            closeMenu();
            if (onLogoClick) onLogoClick();
            else if (onHomeClick) onHomeClick();
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2 text-white"
        >
          <Logo className="h-6 w-6 text-green-400" />
          <span className="text-lg font-semibold tracking-tight">AI Ops</span>
        </button>

        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-white/60 sm:inline mr-1">
                {session.user?.email}
              </span>

              {/* Nav group with Home, Dashboard, and Logout with sliding indicator */}
              <div className="relative flex items-center gap-2">
                {/* Sliding circle active indicator */}
                <div
                  className={`absolute top-0 left-0 h-9 w-9 rounded-full ${indicatorBg} transition-all duration-300 ease-out pointer-events-none ${indicatorTransform}`}
                />

                {/* Home Button */}
                <button
                  type="button"
                  title="Home"
                  aria-label="Home"
                  onClick={() => {
                    closeMenu();
                    if (onHomeClick) onHomeClick();
                    else if (onLogoClick) onLogoClick();
                    else window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full transition-colors ${!isDashboard && !logoutMenuOpen
                    ? "text-green-300"
                    : "text-white/70 hover:text-white"
                    }`}
                >
                  <Home className="h-5 w-5" />
                </button>

                {/* Dashboard / User Button */}
                <button
                  type="button"
                  title="Dashboard"
                  aria-label="Dashboard"
                  onClick={() => {
                    closeMenu();
                    onDashboardClick?.();
                  }}
                  className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full transition-colors ${isDashboard && !logoutMenuOpen
                    ? "text-green-300"
                    : "text-white/70 hover:text-white"
                    }`}
                >
                  <User className="h-5 w-5" />
                </button>

                {/* Logout Button */}
                <button
                  type="button"
                  title="Logout"
                  aria-label="Logout"
                  onClick={toggleMenu}
                  className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full transition-colors ${logoutMenuOpen
                    ? "text-red-400"
                    : "text-white/70 hover:text-red-400"
                    }`}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                className="inline-flex h-9 items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:border-white/30"
                onClick={() => onAuthClick?.("login")}
              >
                Login
              </button>
              <button
                className="inline-flex h-9 items-center justify-center rounded-lg border border-transparent bg-green-400 px-3.5 text-sm font-medium text-black transition-colors hover:bg-green-300"
                onClick={() => onAuthClick?.("signup")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {/* Dropdown Menu Item aligned to the edge of the navbar */}
      {logoutMenuOpen && (
        <div className={`absolute top-[calc(100%+0.35rem)] z-50 animate-drop-down ${isScrolled ? "right-3 sm:right-0" : "right-0"}`}>
          <button
            type="button"
            onClick={() => {
              closeMenu();
              onLogout?.();
            }}
            className="group flex min-w-[6rem] items-center justify-center rounded-xl border border-white/20 bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-2xl transition-all hover:border-white/30 hover:bg-neutral-900 hover:text-red-400"
          >
            <span className="block group-hover:hidden">Sign Out?</span>
            <span className="hidden group-hover:block">Sign Out</span>
          </button>
        </div>
      )}
    </nav>
  );
}
