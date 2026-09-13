import { useState } from "react";

interface Props {
  name: string;
  apiKey: string;
}

export default function ProjectCard({ name, apiKey }: Props) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy API key", err);
    }
  };

  return (
    <div className="card mb-6">
      <h3 className="mt-0">{name}</h3>

      <p className="text-muted-foreground text-sm">
        API Key (keep this secret)
      </p>

      <div className="mt-3 flex items-center gap-3">
        <pre className="m-0 flex-1 overflow-x-auto rounded-lg bg-slate-950 p-3 text-[13px] text-green-400">
          {apiKey}
        </pre>

        <button onClick={copyToClipboard}>
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
    </div>
  );
}
