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
    <div className="card" style={{ marginBottom: 24 }}>
      <h3 style={{ marginTop: 0 }}>{name}</h3>

      <p style={{ color: "var(--muted)", fontSize: 14 }}>
        API Key (keep this secret)
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginTop: 12,
        }}
      >
        <pre
          style={{
            flex: 1,
            background: "#020617",
            padding: 12,
            borderRadius: 8,
            overflowX: "auto",
            fontSize: 13,
            color: "var(--success)",
            margin: 0,
          }}
        >
          {apiKey}
        </pre>

        <button onClick={copyToClipboard}>
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
    </div>
  );
}
