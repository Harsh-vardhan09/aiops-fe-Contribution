export default function IncidentAnalysis({ data }: { data: any }) {
  if (!data || !data.analysis) {
    return (
      <div style={{ marginTop: 30, color: "red" }}>
        <h4>AI Analysis</h4>
        <p>Error: Failed to analyze incident</p>
      </div>
    );
  }

  const { analysis, decision } = data;

  return (
    <div style={{ marginTop: 30 }}>
      <h4>AI Analysis</h4>

      <p><b>Root Cause:</b> {analysis.root_cause || "N/A"}</p>
      <p><b>Confidence:</b> {analysis.confidence || "N/A"}</p>
      <p><b>Severity:</b> {analysis.severity || "N/A"}</p>

      <b>Suggested Fixes:</b>
      <ul>
        {Array.isArray(analysis.suggested_fixes) && analysis.suggested_fixes.map((f: string, i: number) => (
          <li key={i}>{f}</li>
        ))}
      </ul>

      <p><b>Needs Human:</b> {String(analysis.needs_human || false)}</p>

      {decision && (
        <>
          <h4>Agent Decision</h4>
          <p>{decision.message || "No message available"}</p>
        </>
      )}
    </div>
  );
}
