import { useState } from "react";
import { supabase } from "../lib/supabase";
import Logo from "./Logo";

export default function Navbar({
  session,
  onAuthClick,
  onDashboardClick,
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

  const btn =
    "rounded-lg px-4 py-2 border border-white/15 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-50";

  return (
    <nav className="relative top-5 z-50  bg-black flex justify-center border border-white/25 mx-5">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap gap-3  items-center justify-between px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
              <button className={btn} onClick={onDashboardClick}>
                Dashboard
              </button>
              <button
                className={btn}
                onClick={handleLogout}
                disabled={isLogoutLoading}
              >
                {isLogoutLoading ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <button className={btn} onClick={() => onAuthClick("login")}>
                Login
              </button>
              <button
                className="rounded-lg bg-green-500 px-4 py-2  text-sm font-medium text-black transition-colors hover:bg-white/90"
                onClick={() => onAuthClick("signup")}
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
