import { useState } from "react";
import { Check, Copy, Eye, EyeOff, KeyRound } from "lucide-react";

interface Props {
  name: string;
  apiKey: string;
}

export default function ProjectCard({ name, apiKey }: Props) {
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy API key", err);
    }
  };

  const maskedKey = apiKey
    ? apiKey.slice(0, 4) + "•".repeat(Math.max(16, apiKey.length - 8)) + apiKey.slice(-4)
    : "••••••••••••••••••••••••••••••••";

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-sm font-bold uppercase tracking-tight text-white">
          {name}
        </h3>
        <span className="flex items-center gap-1 font-mono text-[10px] uppercase text-green-400">
          <KeyRound className="h-3 w-3" /> API Key
        </span>
      </div>

      <p className="mt-2 text-xs text-white/50">
        API Credentials (Sensitive — Masked for security)
      </p>

      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 overflow-x-auto rounded-lg border border-white/10 bg-black/60 p-2.5 font-mono text-xs text-green-400">
          {showKey ? apiKey : maskedKey}
        </div>

        <button
          onClick={() => setShowKey(!showKey)}
          type="button"
          title={showKey ? "Hide API key" : "Reveal API key"}
          className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>

        <button
          onClick={copyToClipboard}
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 font-mono text-xs text-white hover:bg-white/10 hover:border-green-400/30 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-400" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-white/70" /> Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}
