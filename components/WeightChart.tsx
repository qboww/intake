'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { WeightChartPoint } from '@/lib/services/WeightEntryService';

interface WeightChartProps {
  refreshTrigger?: number;
}

export default function WeightChart({ refreshTrigger = 0 }: WeightChartProps) {
  const [data, setData] = useState<WeightChartPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/weight-entries/chart');
        if (!response.ok) {
          throw new Error('Failed to fetch weight chart data');
        }
        const result = await response.json();
        setData(result.data || []);
      } catch (err) {
        console.error('Error fetching weight data:', err);
        setError('Failed to load weight chart');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <div className="h-80 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading chart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-80 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        30-Day Weight Trend
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            stroke="#d1d5db"
            interval={4}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            stroke="#d1d5db"
            domain={['dataMin - 1', 'dataMax + 1']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#000' }}
            formatter={(value) => [
              `${Number(value).toFixed(1)} kg`,
              'Weight',
            ]}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
