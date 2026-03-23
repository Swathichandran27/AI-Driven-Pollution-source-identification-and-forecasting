import { useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";

export default function RoutePlanner() {
  const [form, setForm] = useState({
    src_lat: "",
    src_lon: "",
    dest_lat: "",
    dest_lon: "",
  });

  const [routes, setRoutes] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getRoutes = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          src_lat: parseFloat(form.src_lat),
          src_lon: parseFloat(form.src_lon),
          dest_lat: parseFloat(form.dest_lat),
          dest_lon: parseFloat(form.dest_lon),
        }),
      });

      const data = await res.json();
      setRoutes(data);

    } catch (err) {
      console.error(err);
      alert("Failed to fetch routes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0B1120] to-[#050A16] text-white p-6">
      
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Smart Route Planner 🌿
      </h1>

      {/* INPUT FORM */}
      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        
        <div className="grid grid-cols-2 gap-4">
          <input name="src_lat" placeholder="Source Latitude" onChange={handleChange} className="input" />
          <input name="src_lon" placeholder="Source Longitude" onChange={handleChange} className="input" />
          <input name="dest_lat" placeholder="Destination Latitude" onChange={handleChange} className="input" />
          <input name="dest_lon" placeholder="Destination Longitude" onChange={handleChange} className="input" />
        </div>

        <button
          onClick={getRoutes}
          className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition"
        >
          {loading ? "Calculating..." : "Get Smart Routes"}
        </button>
      </div>

      {/* MAP */}
      {routes && (
        <div className="mt-10 rounded-2xl overflow-hidden border border-white/10">
          <MapContainer center={[28.61, 77.23]} zoom={11} style={{ height: "500px" }}>
            
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* ROUTES */}
            <Polyline positions={routes.shortest.path} color="blue" />
            <Polyline positions={routes.least_pollution.path} color="green" />
            <Polyline positions={routes.balanced.path} color="red" />

            {/* START MARKER */}
            <Marker position={routes.shortest.path[0]}>
              <Popup>Start</Popup>
            </Marker>

            {/* END MARKER */}
            <Marker position={routes.shortest.path.slice(-1)[0]}>
              <Popup>Destination</Popup>
            </Marker>

          </MapContainer>
        </div>
      )}

      {/* METRICS */}
      {routes && (
        <div className="grid md:grid-cols-3 gap-6 mt-8 max-w-5xl mx-auto">
          
          <Card title="🚗 Shortest" data={routes.shortest} color="blue" />
          <Card title="🌿 Least Pollution" data={routes.least_pollution} color="green" />
          <Card title="⚖️ Balanced" data={routes.balanced} color="red" />

        </div>
      )}
    </div>
  );
}

function Card({ title, data, color }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h3 className={`text-${color}-400 font-semibold mb-2`}>{title}</h3>
      <p className="text-gray-300">Distance: {data.distance.toFixed(2)} km</p>
      <p className="text-gray-300">Exposure: {data.exposure.toFixed(2)}</p>
    </div>
  );
}