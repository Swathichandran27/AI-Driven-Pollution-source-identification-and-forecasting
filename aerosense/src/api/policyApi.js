const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

async function getJson(path, signal) {
  const res = await fetch(path, { signal });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed ${res.status}: ${text}`);
  }
  return res.json();
}

export async function getAverageAQI(signal) {
  return getJson(`${BASE}/api/policy/overview/average-aqi`, signal);
}

export async function getWorstStation(signal) {
  return getJson(`${BASE}/api/policy/overview/worst-station`, signal);
}

export async function getDominantSource(signal) {
  return getJson(`${BASE}/api/policy/overview/dominant-source`, signal);
}

export async function getHighRiskZones(signal) {
  return getJson(`${BASE}/api/policy/overview/high-risk-zones`, signal);
}

export async function getAlerts(signal) {
  return getJson(`${BASE}/api/policy/overview/alerts`, signal);
}

export async function getSourceIdentification({ location, date } = {}, signal) {
  const params = new URLSearchParams();
  if (location) params.set('location', location);
  if (date) params.set('date', date);
  return getJson(`${BASE}/api/policy/source-identification?${params.toString()}`, signal);
}

export async function getForecast({ location } = {}, signal) {
  const params = new URLSearchParams();
  if (location) params.set('location', location);
  return getJson(`${BASE}/api/policy/forecast?${params.toString()}`, signal);
}

export async function getRecommendations({ location } = {}, signal) {
  const params = new URLSearchParams();
  if (location) params.set('location', location);
  return getJson(`${BASE}/api/policy/recommendations?${params.toString()}`, signal);
}

export default {
  getAverageAQI,
  getWorstStation,
  getDominantSource,
  getHighRiskZones,
  getAlerts,
  getSourceIdentification,
  getForecast,
  getRecommendations,
};
