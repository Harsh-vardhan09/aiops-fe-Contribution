import { useState } from "react";
import { supabase } from "../lib/supabase";
import Logo from "./Logo";

export default function Navbar({
  session,
  onAuthClick,
  onDashboardClick,
  onLogoClick,
  onLogout,
}: {
  session: any;
  onAuthClick?: (mode: "login" | "signup") => void;
  /** Omit to hide the Dashboard link (e.g. when already on the dashboard). */
  onDashboardClick?: () => void;
  /** Defaults to scrolling to the top of the current page. */
  onLogoClick?: () => void;
  onLogout?: () => void;
}) {
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    try {
      await supabase.auth.signOut();
      onLogout?.();
    } catch (err) {
      console.warn("Sign out error:", err);
      onLogout?.();
    } finally {
      setIsLogoutLoading(false);
    }
  };

  return (
    <nav className="w-full rounded-2xl border border-white/20 bg-black/60 px-4 py-3 sm:px-6">
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onLogoClick ?? (() => window.scrollTo({ top: 0, behavior: "smooth" }))}
          className="flex items-center gap-2 text-white"
        >
          <Logo className="h-6 w-6 text-green-400" />
          <span className="text-lg font-semibold tracking-tight">AI Ops</span>
        </button>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="hidden text-sm text-white/60 sm:inline">
                {session.user?.email}
              </span>
              {onDashboardClick && (
                <button
                  className="rounded-lg border border-green-400/30 px-4 py-2 text-sm font-medium text-green-200 transition-colors hover:bg-green-500/30 hover:text-white"
                  onClick={onDashboardClick}
                >
                  Dashboard
                </button>
              )}
              <button
                className="rounded-lg border border-red-500/35 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/30 hover:text-white disabled:opacity-50"
                onClick={handleLogout}
                disabled={isLogoutLoading}
              >
                {isLogoutLoading ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <button
                className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:border-white/30"
                onClick={() => onAuthClick?.("login")}
              >
                Login
              </button>
              <button
                className="rounded-lg border border-transparent bg-green-400 px-3.5 py-2 text-sm font-medium text-black transition-colors hover:bg-green-300"
                onClick={() => onAuthClick?.("signup")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
