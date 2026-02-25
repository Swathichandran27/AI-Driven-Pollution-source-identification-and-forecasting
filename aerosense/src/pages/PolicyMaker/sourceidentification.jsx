import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SourceIdentification = () => {
  const [station, setStation] = useState("");
  const [result, setResult] = useState(null);

  const stations = [
    "Anand Vihar",
    "RK Puram",
    "Punjabi Bagh",
    "ITO",
    "Dwarka Sector 8",
    "Okhla Phase 2",
    "Mandir Marg",
    "Bawana",
    "Wazirpur",
    "Jahangirpuri",
  ];

  const handleAnalyze = () => {
    setResult({
      dominant: "Traffic",
      traffic: 52,
      industry: 18,
      dust: 20,
      biomass: 10,
      explanation:
        "High NO2 and CO levels indicate vehicular emissions as dominant.",
    });
  };

  const chartData = result
    ? [
        { name: "Traffic", value: result.traffic },
        { name: "Industry", value: result.industry },
        { name: "Dust", value: result.dust },
        { name: "Biomass", value: result.biomass },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">
        Source Identification
      </h1>

      {/* Dropdown */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <select
            value={station}
            onChange={(e) => setStation(e.target.value)}
            className="border p-3 rounded-lg"
          >
            <option>Select Monitoring Station</option>
            {stations.map((s, i) => (
              <option key={i}>{s}</option>
            ))}
          </select>

          <button
            onClick={handleAnalyze}
            className="bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Analyze Source
          </button>
        </div>
      </div>

      {result && (
        <>
          {/* Result Text */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Dominant Source: {result.dominant}
            </h2>
            <p>{result.explanation}</p>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold mb-4">
                Source Contribution (Pie)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    outerRadius={100}
                    label
                  >
                    {chartData.map((_, i) => (
                      <Cell key={i} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Graph */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold mb-4">
                Pollution Distribution (Bar)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SourceIdentification;
