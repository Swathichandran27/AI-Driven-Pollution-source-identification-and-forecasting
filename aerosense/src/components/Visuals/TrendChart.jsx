import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { day: 'D-6', aqi: 260 },
  { day: 'D-5', aqi: 275 },
  { day: 'D-4', aqi: 290 },
  { day: 'D-3', aqi: 300 },
  { day: 'D-2', aqi: 312 },
  { day: 'D-1', aqi: 298 },
  { day: 'Today', aqi: 287 },
  { day: 'F+1', aqi: 302 },
  { day: 'F+2', aqi: 315 },
  { day: 'F+3', aqi: 330 },
];

export default function TrendChart() {
  return (
    <div style={{ width: '100%', height: 256 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
          <XAxis dataKey="day" stroke="#9aa4b2" />
          <YAxis stroke="#9aa4b2" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="aqi" stroke="#1e90ff" strokeWidth={2} dot={{ r: 3 }} />
          <Line
            type="monotone"
            dataKey="aqi"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5"
            activeDot={{ r: 4 }}
            // render forecast segment differently by filtering later if needed
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
