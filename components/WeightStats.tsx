'use client';

import { useEffect, useState } from 'react';

interface WeightSummary {
  currentWeight: number;
  goalWeight: number;
  weightChange30Day: number;
  lastUpdated: string | null;
  entryCount: number;
}

interface WeightStatsProps {
  refreshTrigger?: number;
}

export default function WeightStats({ refreshTrigger = 0 }: WeightStatsProps) {
  const [stats, setStats] = useState<WeightSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/weight-entries/summary');
        if (!response.ok) {
          throw new Error('Failed to fetch weight stats');
        }
        const result = await response.json();
        setStats(result);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load weight statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 mb-6">
        {['skeleton-1', 'skeleton-2', 'skeleton-3', 'skeleton-4'].map((id) => (
          <div
            key={id}
            className="bg-gray-200 dark:bg-gray-800 rounded-lg h-24 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return null;
  }

  const weightToGo = stats.goalWeight - stats.currentWeight;
  const isWeightIncreasing = stats.weightChange30Day > 0;

  const cards = [
    {
      label: 'Current Weight',
      value: stats.currentWeight,
      unit: 'kg',
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Goal Weight',
      value: stats.goalWeight,
      unit: 'kg',
      color:
        'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    },
    {
      label: 'Progress',
      value: Math.abs(weightToGo),
      unit: weightToGo > 0 ? 'kg to go' : 'kg ahead',
      color:
        'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    },
    {
      label: '30-Day Change',
      value: Math.abs(stats.weightChange30Day),
      unit: isWeightIncreasing ? '📈' : '📉',
      color: isWeightIncreasing
        ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
        : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.color} rounded-lg p-4 border border-gray-200 dark:border-gray-700`}
        >
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {card.label}
          </div>
          <div className="text-2xl font-bold">
            {typeof card.value === 'number' ? card.value.toFixed(1) : card.value}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            {card.unit}
          </div>
        </div>
      ))}
    </div>
  );
}
