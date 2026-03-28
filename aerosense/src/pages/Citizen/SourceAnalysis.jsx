import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Info, Flame, Car, Factory, Building, Wind, MapPin } from 'lucide-react';
import citizenApi from '../../api/citizenApi';
import Card from '../../components/UI/Card';
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';

const SOURCE_COLORS = {
  vehicles: '#3B82F6',
  industry: '#8B5CF6',
  biomass: '#F97316',
  dust: '#EAB308',
  powerplant: '#64748B',
  domestic: '#10B981',
  secondary: '#EF4444'
};

const ICON_MAP = {
  vehicles: <Car size={18} />, 
  industry: <Factory size={18} />,
  biomass: <Flame size={18} />,
  dust: <Building size={18} />,
  powerplant: <Wind size={18} />,
  domestic: <Building size={18} />,
  secondary: <MapPin size={18} />
};

function formatSources(sourcesObj = {}) {
  return Object.entries(sourcesObj).map(([key, value]) => ({
    key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: Number(value) || 0,
    color: SOURCE_COLORS[key] || '#94A3B8'
  }));
}

export default function SourceAnalysis() {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('');
  const [data, setData] = useState(null);
  const [isLoadingStations, setIsLoadingStations] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState(null);

  // Try other stations when selected station has no data
  const tryOtherStations = async () => {
    if (!stations || stations.length === 0) return;
    setIsLoadingData(true);
    setError(null);
    setData(null);

    const others = stations.map(s => s.station).filter(s => s && s !== selectedStation);
    for (const st of others) {
      try {
        const res = await citizenApi.getSourceAnalysis({ station: st });
        if (res && res.sources && Object.keys(res.sources).length > 0) {
          setData(res);
          setSelectedStation(st);
          setError(null);
          setIsLoadingData(false);
          return true;
        }
      } catch (e) {
        // continue to next station
        console.warn('Fallback fetch failed for', st, e);
      }
    }

    setIsLoadingData(false);
    setError('No data available for selected or recent stations');
    return false;
  };

  useEffect(() => {
    let mounted = true;
    setIsLoadingStations(true);
    citizenApi.getStations()
      .then((res) => {
        if (!mounted) return;
        setStations(res || []);
        if (res && res.length > 0) {
          // select first station by default
          setSelectedStation(res[0].station);
        }
      })
      .catch((err) => {
        console.error('Failed to load stations', err);
        setError('Failed to load stations');
      })
      .finally(() => mounted && setIsLoadingStations(false));

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!selectedStation) return;
    let mounted = true;
    setIsLoadingData(true);
    setError(null);
    setData(null);

    const fetchWithFallback = async (station) => {
      try {
        const res = await citizenApi.getSourceAnalysis({ station });
        if (!mounted) return;
        if (res && res.sources && Object.keys(res.sources).length > 0) {
          setData(res);
          setError(null);
          return true;
        }
        return false;
      } catch (e) {
        console.error('Source analysis failed for', station, e);
        return false;
      }
    };

    (async () => {
      const ok = await fetchWithFallback(selectedStation);
      if (ok) {
        if (mounted) setIsLoadingData(false);
        return;
      }

      // try other recent stations in order
      const others = stations.map(s => s.station).filter(s => s && s !== selectedStation);
      for (const st of others) {
        if (!mounted) break;
        setError(`No data for ${selectedStation}. Trying ${st}...`);
        const found = await fetchWithFallback(st);
        if (found) {
          if (mounted) {
            setSelectedStation(st);
            setIsLoadingData(false);
          }
          return;
        }
      }

      if (mounted) {
        setIsLoadingData(false);
        setError('No data available for selected or recent stations');
        setData(null);
      }
    })();

    return () => { mounted = false; };
  }, [selectedStation, stations]);

  const chartData = data ? formatSources(data.sources) : [];
  const total = chartData.reduce((s, i) => s + i.value, 0);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-200">
      <main className="p-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 rounded-lg bg-transparent hover:bg-[#071526] transition-colors">
              <ArrowLeft size={20} className="text-gray-300" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Pollution Source Analysis</h1>
              <p className="text-sm text-gray-400">Understand where pollution is coming from</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="block text-xs text-gray-300">Station</label>
            <div className="relative">
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="p-2 rounded-md text-sm bg-[#071526] text-gray-200 outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                {isLoadingStations ? (
                  <option>Loading...</option>
                ) : (
                  stations.length ? stations.map((s) => (
                    <option key={s.station} value={s.station}>{s.station} — {s.city}</option>
                  )) : <option value="">No stations</option>
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-[#111827] rounded-xl p-6 shadow-sm h-full">
              <h2 className="text-lg font-semibold text-white">Basic Info</h2>

              {isLoadingData ? (
                <p className="text-sm text-gray-300 mt-4">Loading data…</p>
              ) : error ? (
                <p className="text-sm text-red-400 mt-4">{error}</p>
              ) : !data ? (
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-gray-300">No data available for this station.</p>
                  <button onClick={tryOtherStations} className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm">Try another recent station</button>
                </div>
              ) : (
                <div className="mt-4 space-y-2 text-sm text-gray-200">
                  <div><strong>Station:</strong> {data.station}</div>
                  <div><strong>City:</strong> {data.city}</div>
                  <div><strong>Datetime:</strong> {String(data.datetime)}</div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-400">Dominant</p>
                    <div className="mt-1 p-3 rounded-lg bg-[#071526] flex items-center gap-3">
                      <div className="text-2xl" style={{ color: SOURCE_COLORS[data.dominant_source] || '#94A3B8' }}>
                        {ICON_MAP[data.dominant_source] || <Info />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{data.dominant_source?.charAt(0).toUpperCase() + data.dominant_source?.slice(1)}</div>
                        <div className="text-xs text-gray-400">{total ? `${Math.round((data.sources[data.dominant_source]||0)/total*100)}% of identified sources` : ''}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-gray-400">Explanation</p>
                    <div className="mt-2 text-sm text-gray-200 bg-[#071526] rounded p-3">{data.explanation || 'No explanation available.'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#111827] rounded-xl p-6 shadow-sm h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Source Breakdown</h2>
                <div className="text-sm text-gray-300">{isLoadingData ? 'Loading…' : (data ? `${total} total` : '')}</div>
              </div>

              {isLoadingData ? (
                <div className="h-64 flex items-center justify-center">Loading chart…</div>
              ) : !data ? (
                <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                  <div className="mb-3">No data to display</div>
                  <button onClick={tryOtherStations} className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm">Try another recent station</button>
                </div>
              ) : (
                <div style={{ width: '100%', height: 360 }}>
                  <ResponsiveContainer>
                    <RePieChart>
                      <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={2}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip wrapperStyle={{ background: '#0B1220' }} />
                      <Legend verticalAlign="bottom" height={36} />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {data && (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {chartData.map((s) => (
                    <div key={s.key} className="flex items-center gap-3 p-3 rounded bg-[#071526]">
                      <div style={{ width: 12, height: 12, background: s.color, borderRadius: 6 }} />
                      <div className="flex-1 text-sm">
                        <div className="font-medium text-white">{s.name}</div>
                        <div className="text-xs text-gray-400">{s.value} units</div>
                      </div>
                      <div className="text-sm font-semibold text-gray-200">{total ? `${Math.round((s.value/total)*100)}%` : '–'}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
