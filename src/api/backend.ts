import { supabase } from "../lib/supabase";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://aiops-api.onrender.com";

export interface Project {
  id: string;
  name: string;
  api_key: string;
  created_at: string;
}

export interface Incident {
  id: string;
  project_id: string;
  service: string;
  summary: string;
  severity: "low" | "medium" | "high" | "critical" | string;
  status: "open" | "investigating" | "resolved" | string;
  occurrence_count: number;
  created_at: string;
}

export interface RCAAnalysis {
  root_cause: string;
  confidence: number;
  severity: string;
  suggested_fixes: string[];
  needs_human: boolean;
}

export interface AgentDecision {
  incident_id: string;
  action: string;
  executed: boolean;
  message: string | null;
}

export interface AnalyzeIncidentResponse {
  incident_id: string;
  analysis: RCAAnalysis;
  decision?: AgentDecision;
}

export interface LogPayload {
  api_key: string;
  service: string;
  level: "ERROR" | "WARN" | "INFO" | "DEBUG" | string;
  message: string;
  idempotency_key?: string | null;
}

export interface LogIngestResponse {
  id: string;
  project_id: string;
  incident_created: boolean;
  incident_id: string | null;
  deduplicated: boolean;
}

async function getAuthHeader() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error("User not authenticated");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function checkHealth(): Promise<{ status: string; service: string }> {
  const res = await fetch(`${BACKEND_URL}/health`);
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchProjects(): Promise<Project[]> {
  const headers = await getAuthHeader();

  const res = await fetch(`${BACKEND_URL}/projects`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch projects: ${res.status}`);
  }

  return res.json();
}

export async function createProject(name: string): Promise<Project> {
  const headers = await getAuthHeader();

  const res = await fetch(`${BACKEND_URL}/projects`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Failed to create project: ${res.status}`);
  }

  return res.json();
}

export async function fetchIncidents(): Promise<Incident[]> {
  const headers = await getAuthHeader();

  const res = await fetch(`${BACKEND_URL}/incidents`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch incidents: ${res.status}`);
  }

  return res.json();
}

export async function analyzeIncident(incidentId: string): Promise<AnalyzeIncidentResponse> {
  const headers = await getAuthHeader();

  const res = await fetch(`${BACKEND_URL}/agents/analyze/${incidentId}`, {
    method: "POST",
    headers,
  });

  if (!res.ok) {
    throw new Error(`Analysis failed: ${res.status}`);
  }

  return res.json();
}

export async function ingestLog(payload: LogPayload): Promise<LogIngestResponse> {
  const res = await fetch(`${BACKEND_URL}/logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Log ingestion failed: ${res.status}`);
  }

  return res.json();
}
