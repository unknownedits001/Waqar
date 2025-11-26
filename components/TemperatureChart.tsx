import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ForecastDay } from '../types';

interface TemperatureChartProps {
  forecast: ForecastDay[];
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ forecast }) => {
  const data = forecast.map(day => ({
    name: day.date,
    min: day.min_temp_c,
    max: day.max_temp_c,
    avg: (day.min_temp_c + day.max_temp_c) / 2
  }));

  return (
    <div className="w-full h-[200px] mt-8 bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
      <h3 className="text-sm font-medium text-slate-300 mb-4 ml-2">Temperature Trend (°C)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
            unit="°"
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#fbbf24' }}
            labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
          />
          <Area 
            type="monotone" 
            dataKey="max" 
            stroke="#f59e0b" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorMax)" 
          />
          <Area 
            type="monotone" 
            dataKey="min" 
            stroke="#38bdf8" 
            strokeWidth={2}
            fill="transparent"
            strokeDasharray="5 5"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
