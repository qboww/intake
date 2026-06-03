'use client';

import { useEffect, useState } from 'react';
import { IEntry } from '@/lib/models/Entry';
import { EntryFormData } from './EntryForm';

interface RecentFoodsDropdownProps {
  onSelectFood: (data: EntryFormData) => void;
}

export default function RecentFoodsDropdown({
  onSelectFood,
}: RecentFoodsDropdownProps) {
  const [recentEntries, setRecentEntries] = useState<IEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchRecentEntries = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/entries/recent?limit=8');
        if (!response.ok) {
          throw new Error('Failed to fetch recent entries');
        }
        const data = await response.json();
        setRecentEntries(data.entries);
      } catch (err) {
        console.error('Error fetching recent entries:', err);
        setError('Failed to load recent foods');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentEntries();
  }, []);

  const handleSelectFood = (entry: IEntry) => {
    if (entry.mode === 'simple') {
      onSelectFood({
        mode: 'simple',
        foodName: entry.foodName,
        caloriesPer100g: entry.caloriesPer100g,
        weightGrams: entry.weightGrams,
        mealTag: undefined, // Let user choose meal tag
      });
    } else {
      onSelectFood({
        mode: 'recipe',
        recipeName: entry.recipeName,
        ingredients: entry.ingredients?.map(ing => ({
          name: ing.name,
          caloriesPer100g: ing.caloriesPer100g,
          weight: ing.weight,
          manualCalories: ing.manualCalories,
        })),
        manualTotalCalories: entry.manualTotalCalories,
        mealTag: undefined, // Let user choose meal tag
      });
    }
    setIsOpen(false);
  };

  if (isLoading || error || recentEntries.length === 0) {
    return null;
  }

  return (
    <div className="relative mb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
      >
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Quick add from recent
        </div>
        <div className="text-lg font-medium text-gray-900 dark:text-white flex items-center justify-between">
          Recent Foods
          <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          <div className="max-h-64 overflow-y-auto">
            {recentEntries.map((entry) => {
              const foodName =
                entry.mode === 'simple' ? entry.foodName : entry.recipeName;
              const displayDetails =
                entry.mode === 'simple'
                  ? `${entry.weightGrams}g × ${entry.caloriesPer100g} cal/100g`
                  : `${entry.ingredients?.length} ingredients`;
              const calories = entry.calculatedCalories;

              return (
                <button
                  key={entry._id?.toString()}
                  type="button"
                  onClick={() => handleSelectFood(entry)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {foodName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {displayDetails}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-blue-600 dark:text-blue-400">
                      {Math.round(calories)} cal
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {entry.mode === 'simple' ? 'Simple' : 'Recipe'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
