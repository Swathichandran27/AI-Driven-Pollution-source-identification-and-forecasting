const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

async function getJson(path, signal) {
  const res = await fetch(path, { signal });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed ${res.status}: ${text}`);
  }
  return res.json();
}

export async function getStations(signal) {
  // backend `citizen_bp` registers routes at root (no /api/citizen prefix)
  return getJson(`${BASE}/stations`, signal);
}

export async function getDashboard(signal) {
  return getJson(`${BASE}/dashboard`, signal);
}

export async function getSourceAnalysis({ station } = {}, signal) {
  const params = new URLSearchParams();
  if (station) params.set('station', station);
  return getJson(`${BASE}/source-analysis?${params.toString()}`, signal);
}

export async function getForecast({ station } = {}, signal) {
  const params = new URLSearchParams();
  if (station) params.set('station', station);
  return getJson(`${BASE}/forecast?${params.toString()}`, signal);
}

export async function getHealthAdvisory({ station } = {}, signal) {
  const params = new URLSearchParams();
  if (station) params.set('station', station);
  return getJson(`${BASE}/health-advisory?${params.toString()}`, signal);
}

export async function postHealthAdvisory({ station, profile } = {}, signal) {
  const url = `${BASE}/health-advisory`;
  const body = { station: station || null, profile: profile || null };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed ${res.status}: ${text}`);
  }
  return res.json();
}

export async function getRouteSuggestion({ source, destination } = {}, signal) {
  const params = new URLSearchParams();
  if (source) params.set('source', source);
  if (destination) params.set('destination', destination);
  return getJson(`${BASE}/route-suggestion?${params.toString()}`, signal);
}

export default {
  getStations,
  getDashboard,
  getSourceAnalysis,
  getForecast,
  getHealthAdvisory,
  getRouteSuggestion,
};
