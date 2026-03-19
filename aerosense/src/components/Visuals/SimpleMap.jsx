import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Real coordinates for Delhi monitoring stations
const STATION_COORDS = {
  'Mundka':             { lat: 28.6832, lon: 77.0151 },
  'Anand Vihar':        { lat: 28.6517, lon: 77.3152 },
  'Jahangirpuri':       { lat: 28.7330, lon: 77.1630 },
  'Punjabi Bagh':       { lat: 28.6726, lon: 77.1317 },
  'Pusa':               { lat: 28.6378, lon: 77.1525 },
  'Bawana':             { lat: 28.7930, lon: 77.0370 },
  'Ashok Vihar':        { lat: 28.6950, lon: 77.1833 },
  'Shadipur':           { lat: 28.6520, lon: 77.1490 },
  'Sirifort':           { lat: 28.5530, lon: 77.2197 },
  'Burari Crossing':    { lat: 28.7280, lon: 77.1950 },
  'R K Puram':          { lat: 28.5640, lon: 77.1730 },
  'Rohini':             { lat: 28.7350, lon: 77.1180 },
  'Vivek Vihar':        { lat: 28.6720, lon: 77.3150 },
  'Wazirpur':           { lat: 28.7010, lon: 77.1640 },
  'Dwarka-Sector 8':    { lat: 28.5869, lon: 77.0590 },
  'Okhla Phase-2':      { lat: 28.5300, lon: 77.2700 },
  'ITO':                { lat: 28.6289, lon: 77.2410 },
  'Mandir Marg':        { lat: 28.6380, lon: 77.1990 },
  'Narela':             { lat: 28.8560, lon: 77.0930 },
  'Lodhi Road':         { lat: 28.5930, lon: 77.2270 },
};

function getColor(aqi) {
  if (aqi <= 50)  return '#22c55e';
  if (aqi <= 100) return '#84cc16';
  if (aqi <= 200) return '#eab308';
  if (aqi <= 300) return '#f97316';
  return '#ef4444';
}

function getLabel(aqi) {
  if (aqi <= 50)  return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate';
  if (aqi <= 300) return 'Poor';
  return 'Severe';
}

// Match station name from DB to our coords key
function matchCoords(stationName) {
  for (const [key, coords] of Object.entries(STATION_COORDS)) {
    if (stationName.toLowerCase().includes(key.toLowerCase())) return coords;
  }
  return null;
}

export default function SimpleMap({ stations = [] }) {
  // Build markers: use passed stations if available, else fallback to defaults
  const markers = stations.length > 0
    ? stations.map(s => {
        const coords = matchCoords(s.name);
        if (!coords) return null;
        return { name: s.name.split(',')[0], lat: coords.lat, lon: coords.lon, aqi: s.aqi };
      }).filter(Boolean)
    : Object.entries(STATION_COORDS).slice(0, 15).map(([name, c]) => ({
        name, lat: c.lat, lon: c.lon, aqi: Math.floor(Math.random() * 100) + 250
      }));

  return (
    <div style={{ width: '100%', height: 340, borderRadius: 12, overflow: 'hidden' }}>
      <MapContainer center={[28.6500, 77.1500]} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m, i) => (
          <CircleMarker
            key={i}
            center={[m.lat, m.lon]}
            radius={12}
            pathOptions={{ color: getColor(m.aqi), fillColor: getColor(m.aqi), fillOpacity: 0.85, weight: 2 }}
          >
            <Popup>
              <div style={{ minWidth: 130 }}>
                <strong style={{ fontSize: 13 }}>{m.name}</strong>
                <div style={{ marginTop: 4, fontSize: 13 }}>AQI: <strong>{m.aqi}</strong></div>
                <div style={{ color: getColor(m.aqi), fontWeight: 600, fontSize: 12 }}>{getLabel(m.aqi)}</div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
