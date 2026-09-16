import Logo from "./Logo";
import { Home, User, LogOut } from "lucide-react";

export default function Navbar({
  session,
  onAuthClick,
  onDashboardClick,
  onHomeClick,
  onLogoClick,
  onRequestLogout,
  currentPage = "landing",
}: {
  session: any;
  onAuthClick?: (mode: "login" | "signup") => void;
  onDashboardClick?: () => void;
  onHomeClick?: () => void;
  onLogoClick?: () => void;
  onRequestLogout?: () => void;
  currentPage?: "landing" | "dashboard";
}) {
  const isDashboard = currentPage === "dashboard";

  return (
    <nav className="w-full rounded-2xl border border-white/20 bg-black/60 px-4 py-3 sm:px-6">
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onLogoClick ?? onHomeClick ?? (() => window.scrollTo({ top: 0, behavior: "smooth" }))}
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

              {/* Home & Dashboard nav group with sliding green circle */}
              <div className="relative flex items-center gap-2">
                {/* Sliding green circle active indicator */}
                <div
                  className={`absolute top-0 left-0 h-9 w-9 rounded-full bg-green-400/15 transition-transform duration-300 ease-out pointer-events-none ${
                    isDashboard ? "translate-x-[calc(100%+0.5rem)]" : "translate-x-0"
                  }`}
                />

                {/* Home Button (unfilled) */}
                <button
                  type="button"
                  title="Home"
                  aria-label="Home"
                  onClick={onHomeClick ?? onLogoClick ?? (() => window.scrollTo({ top: 0, behavior: "smooth" }))}
                  className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                    !isDashboard
                      ? "text-green-300"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <Home className="h-5 w-5" />
                </button>

                {/* Dashboard / User Button (unfilled) */}
                <button
                  type="button"
                  title="Dashboard"
                  aria-label="Dashboard"
                  onClick={onDashboardClick}
                  className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                    isDashboard
                      ? "text-green-300"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <User className="h-5 w-5" />
                </button>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                title="Logout"
                aria-label="Logout"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:text-red-400"
                onClick={onRequestLogout}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <>
              <button
                className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:border-white/30"
                onClick={() => onAuthClick?.("login")}
              >
                Login
              </button>
              <button
                className="rounded-lg border border bg-green-400 px-3.5 py-2 text-sm font-medium text-black transition-colors hover:bg-green-300"
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
