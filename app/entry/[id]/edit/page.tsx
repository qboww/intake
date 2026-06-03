'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import EntryForm, { EntryFormData } from '@/components/EntryForm';
import { IEntry } from '@/lib/models/Entry';

export default function EditEntry() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [entry, setEntry] = useState<IEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/entries/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch entry');
        }

        const data = await response.json();
        setEntry(data.entry);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred';
        setError(message);
        console.error('Error fetching entry:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEntry();
    }
  }, [id]);

  const handleSubmit = async (data: EntryFormData) => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/entries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update entry');
      }

      // Redirect to home page on success
      router.push('/');
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Error updating entry:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-red-500 mb-4">Entry not found</p>
        <button
          onClick={() => router.push('/')}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Entry</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 rounded-lg">
            {error}
          </div>
        )}

        <EntryForm
          onSubmit={handleSubmit}
          initialData={{
            mode: entry.mode,
            foodName: entry.foodName,
            caloriesPer100g: entry.caloriesPer100g,
            weightGrams: entry.weightGrams,
            recipeName: entry.recipeName,
            ingredients: entry.ingredients,
            manualTotalCalories: entry.manualTotalCalories,
            mealTag: entry.mealTag,
            id: id,
          }}
          isLoading={isSaving}
        />
      </div>
    </div>
  );
}
