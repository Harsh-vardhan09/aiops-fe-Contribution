/**
 * Shared design tokens as Tailwind class strings.
 * One place for surfaces, type, buttons, inputs, badges and alerts so every
 * page (landing / auth / dashboard) renders the same visual language.
 */

/** Keyboard focus ring, applied to every interactive token. */
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

/* Surfaces -------------------------------------------------------------- */

/** Page-level glass panel. */
export const panel =
  "rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl";
export const panelPad = `${panel} p-6 sm:p-8 lg:p-10`;
/** Nested neutral glass card. */
export const card =
  "rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-colors";
/** Nested accent (green) glass card. */
export const cardAccent =
  "rounded-xl border border-green-400/20 bg-green-400/[0.06] p-5 backdrop-blur-sm transition-colors";
/** Ambient green glow, drop inside a `relative overflow-hidden` parent. */
export const glow =
  "pointer-events-none absolute left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-green-400/10 blur-[120px]";

/* Typography ------------------------------------------------------------ */

export const h1 =
  "font-mono text-2xl font-bold uppercase leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-5xl";
export const h2 =
  "font-mono text-2xl font-bold uppercase leading-tight tracking-tight text-white sm:text-3xl";
export const h3 =
  "font-mono text-base font-bold uppercase tracking-tight text-white";
export const h4 =
  "font-mono text-xs font-bold uppercase tracking-wide text-green-300";
export const body = "text-sm leading-relaxed text-white/50 sm:text-base";
export const bodySm = "text-xs leading-relaxed text-white/40";
/** Micro label above fields and metadata rows. */
export const label =
  "font-mono text-[11px] uppercase tracking-[0.15em] text-white/50";

/* Controls -------------------------------------------------------------- */

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-lg font-mono text-sm font-medium uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export const btnPrimary = `${btnBase} ${focusRing} bg-green-400 px-6 py-3 text-black hover:bg-green-300`;
export const btnGhost = `${btnBase} ${focusRing} border border-white/15 px-6 py-3 text-white hover:bg-white/10`;
export const btnSmall = `${btnBase} ${focusRing} border border-white/15 px-3 py-1.5 text-[11px] text-white/70 hover:bg-white/10 hover:text-white`;

export const input = `w-full rounded-lg border border-green-400/20 bg-green-400/[0.06] px-4 py-3 text-sm text-white backdrop-blur-sm transition-colors placeholder:text-white/30 focus:border-green-400/50 focus:bg-green-400/10 ${focusRing}`;

/* Badges & alerts ------------------------------------------------------- */

export const badge =
  "inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide";
export const badgeAccent = `${badge} border-green-400/25 bg-green-400/10 text-green-300`;

const alertBase = "rounded-lg border px-4 py-3 text-sm";
export const alertError = `${alertBase} border-red-400/25 bg-red-400/10 text-red-300`;
export const alertSuccess = `${alertBase} border-green-400/25 bg-green-400/10 text-green-300`;
export const alertWarn = `${alertBase} border-amber-400/25 bg-amber-400/10 text-amber-300`;

/** Severity pill colors, shared by incident lists. */
export const severityClass = (severity: string) => {
  const sev = severity?.toLowerCase();
  if (sev === "high" || sev === "critical")
    return "border-red-400/25 bg-red-400/10 text-red-300";
  if (sev === "medium")
    return "border-amber-400/25 bg-amber-400/10 text-amber-300";
  return "border-green-400/25 bg-green-400/10 text-green-300";
};
