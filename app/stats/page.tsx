'use client';

import StatsCards from '@/components/StatsCards';
import CalorieChart7Day from '@/components/CalorieChart7Day';
import CalorieChart30Day from '@/components/CalorieChart30Day';

export default function Stats() {
  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Statistics</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Track your calorie intake trends and progress
        </p>

        <StatsCards />

        <div className="space-y-6">
          <CalorieChart7Day />
          <CalorieChart30Day />
        </div>
      </div>
    </div>
  );
}
