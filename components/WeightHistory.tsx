'use client';

import { useEffect, useState } from 'react';
import { IWeightEntry } from '@/lib/models/WeightEntry';

interface WeightHistoryProps {
  onDelete?: (id: string) => Promise<void>;
  refreshTrigger?: number;
}

export default function WeightHistory({ onDelete, refreshTrigger = 0 }: WeightHistoryProps) {
  const [entries, setEntries] = useState<IWeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/weight-entries');
        if (!response.ok) {
          throw new Error('Failed to fetch weight entries');
        }
        const data = await response.json();
        setEntries(data.entries);
      } catch (err) {
        console.error('Error fetching entries:', err);
        setError('Failed to load weight history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this weight entry?')) {
      return;
    }

    try {
      setDeletingId(id);
      if (onDelete) {
        await onDelete(id);
      }
      setEntries(entries.filter((e) => e._id?.toString() !== id));
    } catch (err) {
      console.error('Error deleting entry:', err);
      setError('Failed to delete weight entry');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Loading weight history...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No weight entries yet. Start tracking to see your history!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Weight History
      </h3>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {entries.map((entry, idx) => {
          const entryId = entry._id ? (typeof entry._id === 'string' ? entry._id : entry._id.toString()) : `entry-${idx}`;
          return (
            <div
              key={entryId}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {entry.weightKg} kg
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(entry.createdAt).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </div>
              </div>
              <button
                onClick={() => handleDelete(entryId)}
                disabled={deletingId === entryId}
                className="px-3 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition text-sm disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
