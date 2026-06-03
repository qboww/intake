'use client';

import { IEntry, MealTag } from '@/lib/models/Entry';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DailyEntryListProps {
  entries: IEntry[];
  dailyCalorieTarget?: number;
  onEntryDeleted?: () => void;
}

const MEAL_TAG_COLORS: Record<MealTag, string> = {
  breakfast: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  lunch: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  dinner: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  snack: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
};

export default function DailyEntryList({
  entries,
  dailyCalorieTarget = 2000,
  onEntryDeleted,
}: DailyEntryListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totalCalories = entries.reduce((sum, entry) => sum + entry.calculatedCalories, 0);
  const remainingCalories = dailyCalorieTarget - totalCalories;
  const caloriePercentage = (totalCalories / dailyCalorieTarget) * 100;

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/entries/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onEntryDeleted?.();
        router.refresh();
      } else {
        alert('Failed to delete entry');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting entry');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/entry/${id}/edit`);
  };

  // Group entries by meal tag
  const groupedEntries = entries.reduce(
    (acc, entry) => {
      const tag = entry.mealTag || 'other';
      if (!acc[tag]) {
        acc[tag] = [];
      }
      acc[tag].push(entry);
      return acc;
    },
    {} as Record<string, IEntry[]>
  );

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">Total Calories:</span>
            <span className="text-2xl font-bold text-blue-600">
              {totalCalories.toFixed(0)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">Daily Target:</span>
            <span className="text-lg text-gray-600 dark:text-gray-400">
              {dailyCalorieTarget}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">Remaining:</span>
            <span
              className={`text-lg font-semibold ${
                remainingCalories >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {remainingCalories.toFixed(0)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all ${
                  caloriePercentage <= 100
                    ? 'bg-blue-600'
                    : 'bg-orange-600'
                }`}
                style={{
                  width: `${Math.min(caloriePercentage, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {caloriePercentage.toFixed(0)}% of daily target
            </p>
          </div>
        </div>
      </div>

      {/* Entries list */}
      {entries.length === 0 ? (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            No entries for today. Add your first entry!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedEntries).map(([mealTag, mealEntries]) => (
            <div key={mealTag}>
              {mealTag !== 'other' && (
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 capitalize">
                  {mealTag}
                </h3>
              )}
              <div className="space-y-2">
                {mealEntries.map((entry) => (
                  <div
                    key={entry._id?.toString()}
                    className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow flex justify-between items-start gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {entry.mode === 'simple' ? entry.foodName : entry.recipeName}
                        </p>
                        {entry.mealTag && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                              MEAL_TAG_COLORS[entry.mealTag]
                            }`}
                          >
                            {entry.mealTag}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {entry.mode === 'simple' ? (
                          <>
                            {entry.weightGrams}g × {entry.caloriesPer100g} cal/100g
                          </>
                        ) : (
                          <>
                            {entry.ingredients?.length || 0} ingredient{(entry.ingredients?.length || 0) !== 1 ? 's' : ''}
                            {entry.manualTotalCalories && ' (manual override)'}
                          </>
                        )}
                      </p>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-lg font-semibold text-blue-600">
                          {entry.calculatedCalories.toFixed(0)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          kcal
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(entry._id?.toString() || '')}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                          disabled={deletingId === entry._id?.toString()}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(entry._id?.toString() || '')
                          }
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                          disabled={deletingId === entry._id?.toString()}
                        >
                          {deletingId === entry._id?.toString()
                            ? 'Deleting...'
                            : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
