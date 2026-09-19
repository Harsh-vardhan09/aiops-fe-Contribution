import { useState, useEffect, useCallback } from "react";
import Logo from "./Logo";
import { ArrowLeft, LogOut, Check, Sliders, HardDrive, Clock } from "lucide-react";
import {
  loadSettings,
  saveSettings,
  CACHE_SIZE_STOPS,
  parseDurationToMinutes,
  THEME_PALETTES,
  type AppSettings,
  type ThemePaletteId,
} from "../lib/settings";

interface SettingsModalProps {
  userEmail?: string;
  onClose: () => void;
  onLogout: () => void;
  isClosing?: boolean;
}

export default function SettingsModal({
  userEmail,
  onClose,
  onLogout,
  isClosing: externalIsClosing,
}: SettingsModalProps) {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [durationInput, setDurationInput] = useState<string>(() => loadSettings().cacheDurationText);
  const [internalIsClosing, setInternalIsClosing] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const isClosing = Boolean(externalIsClosing || internalIsClosing);

  const triggerClose = useCallback(() => {
    if (isClosing) return;
    setInternalIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 240);
  }, [isClosing, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerClose]);

  // Find slider stop index (0 = 512KB, 1 = 1MB, 2 = 2MB, 3 = 5MB)
  const currentStopIndex = CACHE_SIZE_STOPS.findIndex(
    (s) => s.bytes === settings.cacheSizeBytes
  );
  const activeIndex = currentStopIndex !== -1 ? currentStopIndex : 2;

  const handleToggleCompact = () => {
    const next = { ...settings, compactButtons: !settings.compactButtons };
    setSettings(next);
    saveSettings(next);
    showFeedback();
  };

  const handleThemeChange = (themeId: ThemePaletteId) => {
    const next = { ...settings, theme: themeId };
    setSettings(next);
    saveSettings(next);
    showFeedback();
  };

  const handleToggleOffline = () => {
    const next = { ...settings, offlineMode: !settings.offlineMode };
    setSettings(next);
    saveSettings(next);
    showFeedback();
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value, 10);
    const selectedStop = CACHE_SIZE_STOPS[idx] || CACHE_SIZE_STOPS[2];
    const next = { ...settings, cacheSizeBytes: selectedStop.bytes };
    setSettings(next);
    saveSettings(next);
    showFeedback();
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDurationInput(val);
    const parsedMinutes = parseDurationToMinutes(val);
    const next = {
      ...settings,
      cacheDurationText: val,
      cacheDurationMinutes: parsedMinutes,
    };
    setSettings(next);
    saveSettings(next);
  };

  const showFeedback = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 1500);
  };

  const parsedMinutes = parseDurationToMinutes(durationInput);

  const field =
    "w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white backdrop-blur-sm transition-colors placeholder:text-white/30 focus:border-green-400/50 focus:bg-white/10 focus:outline-none";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8 sm:py-12 bg-black/60 backdrop-blur-md ${
        isClosing ? "animate-fade-out-swift pointer-events-none" : "animate-fade-swift"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) triggerClose();
      }}
    >
      {/* ambient green glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-400/10 blur-[120px]" />

      <div
        className={`relative w-full max-w-[420px] rounded-2xl border border-white/15 bg-black/40 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl ${
          isClosing ? "animate-scale-down pointer-events-none" : "animate-scale-up"
        }`}
      >
        {/* Top Header Row: <- AI Ops on Left, Username on Right */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={triggerClose}
            className="group inline-flex items-center gap-2 text-white transition-colors hover:text-green-400"
          >
            <ArrowLeft className="h-4 w-4 text-white/70 transition-transform group-hover:-translate-x-1 group-hover:text-green-400" />
            <Logo className="h-5 w-5 text-green-400" />
            <span className="text-base font-semibold tracking-tight">AI Ops</span>
          </button>

          {userEmail && (
            <span
              className="font-mono text-xs text-white/60 truncate max-w-[170px]"
              title={userEmail}
            >
              {userEmail}
            </span>
          )}
        </div>

        <div className="animate-fade-swift">
          <div className="mt-6 flex items-center justify-between">
            <h2 className="font-mono text-xl sm:text-2xl font-bold uppercase leading-tight tracking-tight text-white">
              Settings
            </h2>
            {saveToast && (
              <span className="flex items-center gap-1 font-mono text-[11px] text-green-400 animate-fade-swift">
                <Check className="h-3 w-3" /> Saved
              </span>
            )}
          </div>
          <p className="compact-hide mt-1 text-xs sm:text-sm leading-relaxed text-white/50">
            Workspace configuration & offline telemetry storage
          </p>

          <div className="mt-6 space-y-6">
            {/* Header 1: Appearance */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-white/60" />
                <h3 className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/70 font-semibold">
                  Appearance
                </h3>
              </div>

              {/* Less Verbose with Toggle */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-sm">
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-xs font-semibold text-white">
                    Less Verbose
                  </div>
                  <div className="compact-hide text-[11px] text-white/40 mt-0.5">
                    Hides text labels on action buttons & chips
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.compactButtons}
                  onClick={handleToggleCompact}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.compactButtons ? "bg-green-400" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
                      settings.compactButtons ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Accent Theme Selector: Accent O O O O O with selected name beneath Accent */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-sm">
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-xs font-semibold text-white">
                    Accent
                  </div>
                  <div className="compact-hide text-[11px] text-green-400 mt-0.5 font-mono capitalize">
                    {THEME_PALETTES.find((p) => p.id === (settings.theme || "emerald"))?.name || "Emerald"}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {THEME_PALETTES.map((palette) => {
                    const isSelected = (settings.theme || "emerald") === palette.id;
                    return (
                      <button
                        key={palette.id}
                        type="button"
                        onClick={() => handleThemeChange(palette.id)}
                        className={`group relative h-6 w-6 rounded-full border transition-all flex items-center justify-center ${
                          isSelected
                            ? "border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)] ring-2 ring-white/40"
                            : "border-black/50 hover:scale-110 hover:border-white/50 opacity-80 hover:opacity-100"
                        }`}
                        style={{
                          backgroundColor: palette.accent,
                        }}
                        title={`${palette.name} — ${palette.description}`}
                      >
                        {isSelected && (
                          <Check className="h-3 w-3 text-black stroke-[3]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Header 2: Offline */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2">
                <HardDrive className="h-3.5 w-3.5 text-white/60" />
                <h3 className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/70 font-semibold">
                  Offline
                </h3>
              </div>

              {/* Item 1: Offline Mode with Toggle */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-sm">
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-xs font-semibold text-white">
                    Offline Mode
                  </div>
                  <div className="compact-hide text-[11px] text-white/40 mt-0.5">
                    Cache workspace & telemetry locally
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.offlineMode}
                  onClick={handleToggleOffline}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.offlineMode ? "bg-green-400" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
                      settings.offlineMode ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Animated Offline Sub-Options (Cache Size & Duration) */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  settings.offlineMode
                    ? "grid-rows-[1fr] opacity-100 mt-3.5"
                    : "grid-rows-[0fr] opacity-0 pointer-events-none mt-0"
                }`}
              >
                <div className="overflow-hidden space-y-3.5">
                  {/* Item 2: Cache Size Stepped Slider */}
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <label className="font-mono text-xs font-semibold text-white">
                        Cache Size Limit
                      </label>
                      <span className="font-mono text-[11px] text-green-400 font-bold">
                        {CACHE_SIZE_STOPS[activeIndex]?.label || "512 KB"}
                      </span>
                    </div>

                    <div className="mt-3 px-1">
                      {/* Stepped visual slider track */}
                      <div className="relative flex items-center">
                        <input
                          type="range"
                          min={0}
                          max={3}
                          step={1}
                          value={activeIndex}
                          onChange={handleSliderChange}
                          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer transition-opacity bg-white/20 accent-green-400"
                        />
                      </div>

                      {/* Stepped stops o----o----o----o indicator labels exactly aligned under thumb stops */}
                      <div className="relative h-8 cache-slider-stops mt-2 select-none w-full transition-[height] duration-200">
                        {CACHE_SIZE_STOPS.map((stop, idx) => (
                          <button
                            key={stop.label}
                            type="button"
                            onClick={() => {
                              const next = { ...settings, cacheSizeBytes: stop.bytes };
                              setSettings(next);
                              saveSettings(next);
                              showFeedback();
                            }}
                            style={{
                              left: `calc(8px + (100% - 16px) * ${idx / (CACHE_SIZE_STOPS.length - 1)})`,
                            }}
                            className={`absolute top-0 -translate-x-1/2 transition-colors flex flex-col items-center gap-0.5 text-[10px] font-mono ${
                              idx === activeIndex
                                ? "text-green-300 font-bold"
                                : "text-white/40 hover:text-white/70"
                            }`}
                          >
                            <span className="text-[9px] leading-none">•</span>
                            <span className="whitespace-nowrap compact-hide">{stop.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Item 3: Duration with Text Input Field */}
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-mono text-xs font-semibold text-white">
                        Cache Duration
                      </label>
                      <span className="font-mono text-[11px] text-white/50 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-green-400" />
                        {parsedMinutes >= 60
                          ? `${(parsedMinutes / 60).toFixed(parsedMinutes % 60 === 0 ? 0 : 1)} hr(s)`
                          : `${parsedMinutes} min(s)`}
                      </span>
                    </div>

                    <input
                      type="text"
                      value={durationInput}
                      onChange={handleDurationChange}
                      placeholder="e.g. 30m, 1h, 24h"
                      className={`${field} font-mono text-xs`}
                    />
                    <p className="compact-hide text-[10px] text-white/40">
                      Data expires automatically after this duration.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: Log Out Button (Logs out on first press) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  triggerClose();
                  onLogout();
                }}
                className="w-full rounded-lg border border-red-500/30 bg-red-500/10 py-2.5 px-4 text-sm font-semibold text-red-300 transition-all hover:bg-red-500/20 hover:border-red-500/50 flex items-center justify-center gap-2 group shadow-lg"
              >
                <LogOut className="h-4 w-4 text-red-400 transition-transform group-hover:translate-x-0.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
