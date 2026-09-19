export type ThemePaletteId = "emerald" | "cyan_blue" | "violet" | "amber" | "blue";

export interface ThemePalette {
  id: ThemePaletteId;
  name: string;
  description: string;
  accent: string;
  accentHover: string;
  accentSoft: string;
  accentText: string;
}

export const THEME_PALETTES: ThemePalette[] = [
  {
    id: "emerald",
    name: "Emerald",
    description: "Current emerald green",
    accent: "#00E676",
    accentHover: "#00C853",
    accentSoft: "#06351F",
    accentText: "#70F0B0",
  },
  {
    id: "cyan_blue",
    name: "Cyan",
    description: "Cool technical cyan/blue",
    accent: "#00D9FF",
    accentHover: "#00B8D9",
    accentSoft: "#05333B",
    accentText: "#6DEBFF",
  },
  {
    id: "violet",
    name: "Violet",
    description: "Futuristic violet/purple",
    accent: "#B76CFF",
    accentHover: "#9C4DFF",
    accentSoft: "#28123D",
    accentText: "#D09AFF",
  },
  {
    id: "amber",
    name: "Amber",
    description: "Warm amber/gold",
    accent: "#FFC247",
    accentHover: "#E6A82F",
    accentSoft: "#382A08",
    accentText: "#FFD978",
  },
  {
    id: "blue",
    name: "Blue",
    description: "Clean electric blue",
    accent: "#3B9CFF",
    accentHover: "#1976D2",
    accentSoft: "#092746",
    accentText: "#7DBDFF",
  },
];

export interface AppSettings {
  compactButtons: boolean;
  theme: ThemePaletteId;
  offlineMode: boolean;
  cacheSizeBytes: number; // in bytes (e.g. 512KB, 1MB, 2MB, 5MB)
  cacheDurationMinutes: number; // in minutes
  cacheDurationText: string; // raw input e.g. "60m", "1h", "24h"
}

export const CACHE_SIZE_STOPS = [
  { label: "512 KB", bytes: 512 * 1024 },
  { label: "1 MB", bytes: 1024 * 1024 },
  { label: "2 MB", bytes: 2 * 1024 * 1024 },
  { label: "5 MB", bytes: 5 * 1024 * 1024 },
];

const SETTINGS_KEY = "aiops_app_settings";

export const DEFAULT_SETTINGS: AppSettings = {
  compactButtons: false,
  theme: "emerald",
  offlineMode: false,
  cacheSizeBytes: 512 * 1024, // 512 KB default
  cacheDurationMinutes: 60, // 60 minutes default
  cacheDurationText: "60m",
};

export function parseDurationToMinutes(input: string): number {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return 60;

  // Match numbers followed by optional units (m, min, h, hr, d, day)
  const match = trimmed.match(/^(\d+(?:\.\d+)?)\s*(m|min|mins|h|hr|hrs|d|day|days)?$/);
  if (!match) {
    const num = parseFloat(trimmed);
    return isNaN(num) || num <= 0 ? 60 : Math.round(num);
  }

  const val = parseFloat(match[1]);
  const unit = match[2];

  if (!unit || unit.startsWith("m")) {
    return Math.max(1, Math.round(val));
  }
  if (unit.startsWith("h")) {
    return Math.max(1, Math.round(val * 60));
  }
  if (unit.startsWith("d")) {
    return Math.max(1, Math.round(val * 1440));
  }
  return 60;
}

export function formatMinutesToText(minutes: number): string {
  if (minutes >= 1440 && minutes % 1440 === 0) {
    return `${minutes / 1440}d`;
  }
  if (minutes >= 60 && minutes % 60 === 0) {
    return `${minutes / 60}h`;
  }
  return `${minutes}m`;
}

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
      };
    }
  } catch (err) {
    console.warn("Failed to load settings:", err);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    applyCompactMode(settings.compactButtons);
    applyTheme(settings.theme);
    // Dispatch custom event for reactive listeners
    window.dispatchEvent(new CustomEvent("aiops-settings-changed", { detail: settings }));
  } catch (err) {
    console.warn("Failed to save settings:", err);
  }
}

export function applyCompactMode(compact: boolean): void {
  if (typeof document === "undefined") return;
  if (compact) {
    document.documentElement.classList.add("compact-mode");
  } else {
    document.documentElement.classList.remove("compact-mode");
  }
}

export function applyTheme(theme: ThemePaletteId): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme || "emerald");
}
