import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const monitors = [
  { id: 1, name: 'Anand Vihar', lat: 28.6517, lon: 77.3029, aqi: 412 },
  { id: 2, name: 'Okhla', lat: 28.5450, lon: 77.2690, aqi: 398 },
  { id: 3, name: 'Rohini', lat: 28.7350, lon: 77.1180, aqi: 356 },
  { id: 4, name: 'Dwarka', lat: 28.5869, lon: 77.0410, aqi: 345 },
];

function getColor(aqi) {
  if (aqi <= 50) return '#16a34a';
  if (aqi <= 100) return '#f59e0b';
  if (aqi <= 200) return '#f97316';
  if (aqi <= 300) return '#f43f5e';
  return '#7f1d1d';
}

export default function SimpleMap({ center = [28.6139, 77.2090], zoom = 10 }) {
  return (
    <div className="w-full h-72 rounded overflow-hidden">
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {monitors.map((m) => (
          <CircleMarker
            key={m.id}
            center={[m.lat, m.lon]}
            radius={10}
            pathOptions={{ color: getColor(m.aqi), fillColor: getColor(m.aqi), fillOpacity: 0.8 }}
          >
            <Popup>
              <div>
                <strong>{m.name}</strong>
                <div>AQI: {m.aqi}</div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
