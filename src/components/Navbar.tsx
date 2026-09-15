import { useState } from "react";
import { supabase } from "../lib/supabase";
import Logo from "./Logo";
import { btnGhost, btnPrimary, focusRing } from "../lib/ui";

export default function Navbar({
  session,
  onAuthClick,
  onDashboardClick,
  onLogoClick,
}: {
  session: any;
  onAuthClick?: (mode: "login" | "signup") => void;
  /** Omit to hide the Dashboard link (e.g. when already on the dashboard). */
  onDashboardClick?: () => void;
  /** Defaults to scrolling to the top of the current page. */
  onLogoClick?: () => void;
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

  /** Nav-sized variants of the shared button tokens. */
  const ghost = `${btnGhost} px-4 py-2 text-xs sm:text-sm`;
  const primary = `${btnPrimary} px-4 py-2 text-xs sm:text-sm`;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
        <button
          type="button"
          onClick={
            onLogoClick ??
            (() => window.scrollTo({ top: 0, behavior: "smooth" }))
          }
          className={`flex items-center gap-2 rounded-lg text-white ${focusRing}`}
        >
          <Logo className="h-6 w-6 text-green-400" />
          <span className="text-lg font-semibold tracking-tight">AI Ops</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {session ? (
            <>
              <span className="hidden max-w-[16rem] truncate text-sm text-white/50 sm:inline">
                {session.user?.email}
              </span>
              {onDashboardClick && (
                <button className={ghost} onClick={onDashboardClick}>
                  Dashboard
                </button>
              )}
              <button
                className={ghost}
                onClick={handleLogout}
                disabled={isLogoutLoading}
              >
                {isLogoutLoading ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <button className={ghost} onClick={() => onAuthClick?.("login")}>
                Login
              </button>
              <button
                className={primary}
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
