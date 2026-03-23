// import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
// import { useEffect, useState } from "react";
// import Papa from "papaparse";

// export default function BubbleMap() {
//   const [stations, setStations] = useState([]);

//   useEffect(() => {
//     fetch("/real_time_aqi_data.csv")
//       .then((res) => res.text())
//       .then((csvText) => {
//         const parsed = Papa.parse(csvText, {
//           header: true,
//           skipEmptyLines: true, // ✅ important
//         });

//         const data = parsed.data;
//         const stationMap = {};

//         data.forEach((row) => {
//           const lat = parseFloat(row.latitude);
//           const lng = parseFloat(row.longitude);
//           const value = parseFloat(row.avg_value);

//           if (!isNaN(lat) && !isNaN(lng) && !isNaN(value)) {
//             const key = `${lat}_${lng}`;

//             if (!stationMap[key]) {
//               stationMap[key] = {
//                 lat,
//                 lng,
//                 values: [],
//                 station: row.station || "Unknown",
//                 city: row.city || "Unknown",
//               };
//             }

//             stationMap[key].values.push(value);
//           }
//         });

//         const finalStations = Object.values(stationMap)
//           .map((station) => {
//             if (station.values.length === 0) return null;

//             const overallAQI = Math.max(...station.values);

//             return {
//               ...station,
//               overallAQI,
//             };
//           })
//           .filter(Boolean); // ✅ remove null stations

//         setStations(finalStations);
//       })
//       .catch((error) => {
//         console.error("Error loading CSV:", error);
//       });
//   }, []);

//   const getColor = (aqi) => {
//     if (aqi <= 50) return "green";
//     if (aqi <= 100) return "yellow";
//     if (aqi <= 200) return "orange";
//     if (aqi <= 300) return "red";
//     if (aqi <= 400) return "purple";
//     return "maroon";
//   };

//   const getRadius = (aqi) => {
//     return Math.sqrt(aqi) * 2.5;
//   };

//   return (
//     <MapContainer
//       center={[28.6139, 77.2090]}
//       zoom={10}
//       style={{ height: "600px", width: "100%" }}
//     >
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//       {stations.map((station, index) => (
//         <CircleMarker
//           key={index}
//           center={[station.lat, station.lng]}
//           radius={getRadius(station.overallAQI)}
//           pathOptions={{
//             color: getColor(station.overallAQI),
//             fillColor: getColor(station.overallAQI),
//             fillOpacity: 0.6,
//           }}
//         >
//           <Popup>
//             <b>Station:</b> {station.station} <br />
//             <b>City:</b> {station.city} <br />
//             <b>Overall AQI:</b>{" "}
//             {station.overallAQI
//               ? station.overallAQI.toFixed(2)
//               : "Data not available"}
//           </Popup>
//         </CircleMarker>
//       ))}
//     </MapContainer>
//   );
// }




import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function BubbleMap() {
  const [stations, setStations] = useState([]);
  const [useBackend, setUseBackend] = useState(false);

  useEffect(() => {
    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    let mounted = true;

    const tryBackend = async () => {
      try {
        const res = await fetch(`${API_BASE}/stations`);
        if (!res.ok) throw new Error('No stations');
        const json = await res.json();

        // Check if backend provides coordinates
        const hasCoords = json && json.length && (json[0].lat || json[0].latitude || json[0].lng || json[0].lon);
        if (hasCoords) {
          const mapped = json.map((s) => ({
            lat: s.lat || s.latitude,
            lng: s.lon || s.longitude || s.lng,
            station: s.station || s.name || 'Station',
            city: s.city || '',
            overallAQI: s.aqi || s.aqi_value || 0
          })).filter(s => s.lat && s.lng);

          if (mounted && mapped.length) {
            setStations(mapped);
            setUseBackend(true);
            return;
          }
        }
      } catch (e) {
        // ignore and fallback to CSV
      }

      // fallback to CSV
      try {
        const res = await fetch('/real_time_aqi_data.csv');
        const csvText = await res.text();
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        const data = parsed.data;
        const stationMap = {};

        data.forEach((row) => {
          const lat = parseFloat(row.latitude);
          const lng = parseFloat(row.longitude);
          const value = parseFloat(row.avg_value);

          if (!isNaN(lat) && !isNaN(lng) && !isNaN(value)) {
            const key = `${lat}_${lng}`;
            if (!stationMap[key]) {
              stationMap[key] = {
                lat,
                lng,
                values: [],
                station: row.station || 'Unknown',
                city: row.city || 'Unknown'
              };
            }
            stationMap[key].values.push(value);
          }
        });

        const finalStations = Object.values(stationMap).map((station) => {
          if (!station.values.length) return null;
          return { ...station, overallAQI: Math.max(...station.values) };
        }).filter(Boolean);

        if (mounted) {
          setStations(finalStations);
          setUseBackend(false);
        }
      } catch (err) {
        console.error('Error loading CSV:', err);
      }
    };

    tryBackend();
    return () => { mounted = false; };
  }, []);

  const getColor = (aqi) => {
    if (aqi <= 50) return "#4caf50"; // Good - Green
    if (aqi <= 100) return "#ffeb3b"; // Satisfactory - Yellow
    if (aqi <= 200) return "#ff9800"; // Moderate - Orange
    if (aqi <= 300) return "#f44336"; // Poor - Red
    if (aqi <= 400) return "#9c27b0"; // Very Poor - Purple
    return "#800000"; // Severe - Maroon
  };

  const getRadius = (aqi) => {
    // Adjust radius scaling for better visualization
    return Math.sqrt(aqi) * 3;
  };

  const getAQICategory = (aqi) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Satisfactory";
    if (aqi <= 200) return "Moderate";
    if (aqi <= 300) return "Poor";
    if (aqi <= 400) return "Very Poor";
    return "Severe";
  };

  // Custom popup styles
  const popupStyles = {
    padding: "8px",
    borderRadius: "4px",
    fontFamily: "Arial, sans-serif",
  };

  return (
    <>
      {!useBackend && (
        <div className="mb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-md bg-yellow-50 border-l-4 border-yellow-400 p-3 text-yellow-800">
            <strong>Mock data:</strong> Map is using local CSV data (real-time backend does not provide station coordinates).
          </div>
        </div>
      )}

      <MapContainer
      center={[28.6139, 77.2090]} // Delhi center coordinates
      zoom={10}
      minZoom={7}
      maxBounds={[
        [28.0, 76.5], // Southwest coordinates
        [29.5, 78.5], // Northeast coordinates
      ]}
      style={{ height: "600px", width: "100%", borderRadius: "8px" }}
    >
      {/* Base Map Layer */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Optional: Add another tile layer for better contrast */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        opacity={0.4}
      />

      {stations.map((station, index) => (
        <CircleMarker
          key={index}
          center={[station.lat, station.lng]}
          radius={getRadius(station.overallAQI)}
          pathOptions={{
            color: getColor(station.overallAQI),
            fillColor: getColor(station.overallAQI),
            fillOpacity: 0.7,
            weight: 1,
            opacity: 0.8,
          }}
        >
          <Popup>
            <div style={{ minWidth: "200px" }}>
              <h3 style={{ margin: "0 0 8px 0", color: "#333" }}>
                {station.station}
              </h3>
              <p style={{ margin: "4px 0", fontSize: "14px" }}>
                <strong>City:</strong> {station.city}
              </p>
              <p style={{ margin: "4px 0", fontSize: "14px" }}>
                <strong>AQI:</strong>{" "}
                <span style={{ 
                  color: getColor(station.overallAQI),
                  fontWeight: "bold",
                  fontSize: "16px"
                }}>
                  {station.overallAQI ? station.overallAQI.toFixed(0) : "N/A"}
                </span>
              </p>
              <p style={{ 
                margin: "4px 0", 
                padding: "4px 8px",
                backgroundColor: getColor(station.overallAQI) + "20",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: "500"
              }}>
                Category: {getAQICategory(station.overallAQI)}
              </p>
              <p style={{ margin: "4px 0", fontSize: "12px", color: "#666" }}>
                <strong>Coordinates:</strong> {station.lat.toFixed(4)}, {station.lng.toFixed(4)}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* Optional: Add a scale control */}
      {typeof window !== "undefined" && (
        <div className="leaflet-bottom leaflet-right">
          <div className="leaflet-control leaflet-bar">
            <div
              style={{
                backgroundColor: "white",
                padding: "6px 12px",
                border: "2px solid rgba(0,0,0,0.2)",
                borderRadius: "4px",
                margin: "10px",
                fontSize: "12px",
                boxShadow: "0 1px 5px rgba(0,0,0,0.2)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span>AQI Scale:</span>
                <span style={{ color: "#4caf50" }}>● Good</span>
                <span style={{ color: "#ffeb3b" }}>● Satisfactory</span>
                <span style={{ color: "#ff9800" }}>● Moderate</span>
                <span style={{ color: "#f44336" }}>● Poor</span>
                <span style={{ color: "#9c27b0" }}>● Very Poor</span>
                <span style={{ color: "#800000" }}>● Severe</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </MapContainer>
    </>
  );
}