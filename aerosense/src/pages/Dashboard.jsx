import Sidebar from "../components/Sidebar"
import AQICard from "../components/AQICard"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

// Fix Leaflet marker issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

export default function Dashboard() {

  const forecastData = {
    labels: ["00:00", "06:00", "12:00", "18:00", "+24h", "+36h", "+48h"],
    datasets: [
      {
        label: "AQI Forecast",
        data: [180, 160, 170, 150, 120, 90, 70],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.4,
      },
    ],
  }

  return (
    <div className="flex h-screen">

      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Air Quality Dashboard</h2>
            <p className="text-gray-500">Real-time air quality for Delhi</p>
          </div>

          <div className="flex items-center gap-4">
            <select className="border rounded-lg px-4 py-2">
              <option>Delhi</option>
              <option>Mumbai</option>
              <option>Bangalore</option>
            </select>

            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Export Data
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AQICard title="Air Quality Index" value="187 AQI" status="Unhealthy" />
          <AQICard title="PM2.5 Level" value="58 µg/m³" status="Unhealthy" />
          <AQICard title="Humidity" value="68 %" status="Sensitive" />
          <AQICard title="Temperature" value="32 °C" status="Sensitive" />
        </div>

        {/* Map & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Map */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Real-time AQI Map - Delhi</h3>

            <div className="h-96 rounded-xl overflow-hidden">
              <MapContainer
                center={[28.6139, 77.2090]}
                zoom={11}
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[28.6139, 77.2090]}>
                  <Popup>Delhi AQI: 187 (Unhealthy)</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* Forecast */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold mb-4">AQI Forecast (Next 72 Hours)</h3>
            <Line data={forecastData} />
          </div>

        </div>

      </div>
    </div>
  )
}