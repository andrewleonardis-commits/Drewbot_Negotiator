import React from 'react';
import type { ChartData } from '../src/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


interface MidpointChartProps {
  data: ChartData[];
}

const MidpointChart: React.FC<MidpointChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
        <div className="flex items-center justify-center h-64 bg-slate-900/50 rounded-lg">
            <p className="text-slate-500">Negotiation history will be visualized here.</p>
        </div>
    );
  }
  
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 229, 229, 0.2)" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value.toLocaleString()}`} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #00E5E5', color: '#e2e8f0', borderRadius: '0.5rem' }}
            formatter={(value: number) => `$${value.toLocaleString()}`}
            cursor={{ stroke: '#00E5E5', strokeWidth: 1, strokeDasharray: '3 3' }}
          />
          <Legend wrapperStyle={{ color: '#e2e8f0' }} />
          <Line type="monotone" dataKey="debtorTotalOffer" name="Debtor Offer" stroke="#F022A8" strokeWidth={2} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="ourOffer" name="Our Offer" stroke="#00E5E5" strokeWidth={2} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="midpoint" name="Midpoint" stroke="#39FF14" strokeWidth={3} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MidpointChart;