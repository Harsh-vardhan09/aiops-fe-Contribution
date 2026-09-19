import { useState, useEffect, useRef } from "react";
import Logo from "./Logo";
import { Home, User, LogOut, WifiOff } from "lucide-react";

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
  guideOverlayText = null,
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
  guideOverlayText?: string | null;
}) {
  const [logoutMenuOpen, setLogoutMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof window === "undefined") return true;
    return navigator.onLine;
  });
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const isDashboard = currentPage === "dashboard";

  // Online / Offline event listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineAlert(false);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineAlert(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // When offline, cycle alert: show for 3 seconds every 15 seconds
  useEffect(() => {
    if (isOnline) {
      setShowOfflineAlert(false);
      return;
    }

    // Initial 3s display
    setShowOfflineAlert(true);
    const initialHide = setTimeout(() => {
      setShowOfflineAlert(false);
    }, 3000);

    const interval = setInterval(() => {
      setShowOfflineAlert(true);
      setTimeout(() => {
        setShowOfflineAlert(false);
      }, 3000);
    }, 15000);

    return () => {
      clearTimeout(initialHide);
      clearInterval(interval);
    };
  }, [isOnline]);

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
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    }

    if (logoutMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [logoutMenuOpen]);

  // Determine active indicator position and background color
  const getIndicatorStyle = () => {
    if (logoutMenuOpen) {
      return {
        transform: "translateX(88px)",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
      };
    }
    if (isDashboard) {
      return {
        transform: "translateX(44px)",
        backgroundColor: "rgba(74, 222, 128, 0.15)",
      };
    }
    return {
      transform: "translateX(0px)",
      backgroundColor: "rgba(74, 222, 128, 0.15)",
    };
  };

  return (
    <nav
      ref={navRef}
      className={`relative w-full navbar-blur-60 transition-[background-color,border-color,box-shadow,padding,border-radius] duration-700 ease-in-out will-change-[transform,backdrop-filter] ${
        !isOnline
          ? isScrolled
            ? "rounded-none border-b border-red-500/40 border-t-0 border-x-0 bg-red-950/40 px-4 py-4 shadow-[0_4px_25px_rgba(239,68,68,0.2)] sm:rounded-2xl sm:border sm:border-red-500/40 sm:px-6 sm:py-4"
            : "rounded-2xl border border-red-500/40 bg-red-950/30 px-4 py-3 sm:px-6 shadow-[0_0_20px_rgba(239,68,68,0.18)]"
          : guideOverlayText
          ? "rounded-2xl border border-white/20 bg-black px-4 py-3 sm:px-6 shadow-none"
          : isScrolled
          ? "rounded-none border-b border-white/20 border-t-0 border-x-0 bg-black/75 px-4 py-4 shadow-xl sm:rounded-2xl sm:border sm:border-white/20 sm:px-6 sm:py-4 sm:shadow-2xl"
          : "rounded-2xl border border-white/20 bg-black/60 px-4 py-3 sm:px-6 shadow-none"
      }`}
    >
      {/* Blurred Guided Swipe Overlay for First-Time Mobile Login with Smooth Fade-In and Fade-Out */}
      <div
        className={`absolute inset-0 z-30 flex items-center justify-center rounded-2xl bg-black px-4 pointer-events-none transition-opacity duration-500 ease-in-out ${
          guideOverlayText ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-green-300">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span>{guideOverlayText || "Swipe to change views"}</span>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
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

          {/* Offline indicator: Displays for 3s every 15s with smooth fade */}
          <div
            className={`inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/15 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-red-300 transition-all duration-500 ease-in-out ${
              !isOnline && showOfflineAlert
                ? "opacity-100 scale-100 max-w-[130px]"
                : "opacity-0 scale-95 pointer-events-none max-w-0 px-0 border-transparent overflow-hidden"
            }`}
          >
            <WifiOff className="h-2.5 w-2.5 text-red-400 shrink-0" />
            <span className="whitespace-nowrap">No Internet</span>
          </div>
        </div>

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
                  className="absolute top-0 left-0 h-9 w-9 rounded-full pointer-events-none will-change-transform"
                  style={{
                    ...getIndicatorStyle(),
                    transition: "transform 320ms cubic-bezier(0.16, 1, 0.3, 1), background-color 250ms ease",
                  }}
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
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              closeMenu();
              onLogout?.();
            }}
            className="group flex min-w-[6rem] items-center justify-center rounded-xl border border-white/20 bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-2xl transition-all hover:border-white/30 hover:bg-neutral-900 hover:text-red-400 cursor-pointer select-none"
          >
            <span className="block group-hover:hidden">Sign Out?</span>
            <span className="hidden group-hover:block">Sign Out</span>
          </button>
        </div>
      )}
    </nav>
  );
}
