'use client';

import { useState, useCallback } from 'react';
import WeightEntryForm from '@/components/WeightEntryForm';
import WeightStats from '@/components/WeightStats';
import WeightHistory from '@/components/WeightHistory';
import WeightChart from '@/components/WeightChart';

export default function Weight() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleAddWeight = async (data: { weightKg: number }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/weight-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg =
          errorData.message || errorData.error || 'Failed to save weight';
        throw new Error(errorMsg);
      }

      triggerRefresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Error saving weight:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWeight = async (id: string) => {
    try {
      const response = await fetch(`/api/weight-entries/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete weight entry');
      }

      triggerRefresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete';
      throw new Error(message);
    }
  };

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Weight Tracking</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Monitor your physical progress over time
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 rounded-lg">
            {error}
          </div>
        )}

        <WeightEntryForm onSubmit={handleAddWeight} isLoading={isLoading} />

        <WeightStats refreshTrigger={refreshTrigger} />

        <WeightChart refreshTrigger={refreshTrigger} />

        <WeightHistory refreshTrigger={refreshTrigger} onDelete={handleDeleteWeight} />
      </div>
    </div>
  );
}
