import { useState } from "react";
import { Check, Copy, Eye, EyeOff, ShieldCheck } from "lucide-react";

interface Props {
  apiKey: string;
}

export default function ApiKeyCard({ apiKey }: Props) {
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
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-green-400" /> API Credential (Sensitive)
        </h3>
        <span className="rounded bg-green-400/10 px-2 py-0.5 font-mono text-[10px] uppercase text-green-300 border border-green-400/20">
          Encrypted
        </span>
      </div>

      <p className="mt-2 text-xs text-white/50 leading-relaxed">
        Use this write key in your microservices to stream error events. Kept secret and protected.
      </p>

      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 overflow-x-auto rounded-lg border border-white/10 bg-black/60 p-2.5 font-mono text-xs text-green-400 tracking-wider">
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
