import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Stubble', value: 42 },
  { name: 'Traffic', value: 28 },
  { name: 'Industry', value: 18 },
  { name: 'Dust', value: 12 },
];
const COLORS = ['#fb923c', '#60a5fa', '#a78bfa', '#facc15'];

export default function DonutChart() {
  return (
    <div style={{ width: '100%', height: 192 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
