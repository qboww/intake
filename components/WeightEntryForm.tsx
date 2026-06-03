'use client';

import { useState } from 'react';

interface WeightEntryFormProps {
  onSubmit: (data: { weightKg: number }) => Promise<void>;
  isLoading?: boolean;
}

export default function WeightEntryForm({ onSubmit, isLoading = false }: WeightEntryFormProps) {
  const [weight, setWeight] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const weightNum = parseFloat(weight);

    // Validation
    if (!weight || isNaN(weightNum)) {
      setError('Please enter a valid weight');
      return;
    }

    if (weightNum < 20) {
      setError('Weight must be at least 20 kg');
      return;
    }

    if (weightNum > 500) {
      setError('Weight cannot exceed 500 kg');
      return;
    }

    try {
      await onSubmit({ weightKg: weightNum });
      setWeight(''); // Reset form on success
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save weight';
      setError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Log Weight
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="number"
          step="0.1"
          min="20"
          max="500"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Enter weight in kg"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
