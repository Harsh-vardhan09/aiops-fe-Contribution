import { supabase } from "../lib/supabase";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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

export async function createProject(name: string) {
  const headers = await getAuthHeader();

  const res = await fetch(`${BACKEND_URL}/projects`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function fetchIncidents() {
  const headers = await getAuthHeader();

  const res = await fetch(`${BACKEND_URL}/incidents`, { headers });

  if (!res.ok) {
    throw new Error(`Failed to fetch incidents: ${res.status}`);
  }

  return res.json();
}

export async function analyzeIncident(incidentId: string) {
  const headers = await getAuthHeader();

  const res = await fetch(
    `${BACKEND_URL}/agents/analyze/${incidentId}`,
    {
      method: "POST",
      headers,
    }
  );

  if (!res.ok) {
    throw new Error(`Analysis failed: ${res.status}`);
  }

  return res.json();
}
