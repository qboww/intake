'use client';

import { useEffect, useState } from 'react';

interface StatsSummary {
  today: number;
  sevenDayAverage: number;
  thirtyDayAverage: number;
  currentStreak: number;
}

export default function StatsCards() {
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/stats/summary');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const result = await response.json();
        setStats(result);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-gray-200 dark:bg-gray-800 rounded-lg h-24 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return null;
  }

  const cards = [
    {
      label: 'Today',
      value: Math.round(stats.today),
      unit: 'kcal',
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    },
    {
      label: '7-Day Avg',
      value: stats.sevenDayAverage,
      unit: 'kcal',
      color:
        'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    },
    {
      label: '30-Day Avg',
      value: stats.thirtyDayAverage,
      unit: 'kcal',
      color:
        'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Current Streak',
      value: stats.currentStreak,
      unit: 'days',
      color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
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
            {card.value.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            {card.unit}
          </div>
        </div>
      ))}
    </div>
  );
}
