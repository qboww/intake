'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EntryForm, { EntryFormData } from '@/components/EntryForm';
import RecentFoodsDropdown from '@/components/RecentFoodsDropdown';

export default function EntryNew() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EntryFormData | undefined>(undefined);

  const handleSelectRecentFood = (data: EntryFormData) => {
    setFormData(data);
  };

  const handleSubmit = async (data: EntryFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.message || errorData.error || 'Failed to create entry';
        throw new Error(errorMsg);
      }

      // Redirect to home page on success
      router.push('/');
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Error creating entry:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add Entry</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 rounded-lg">
            {error}
          </div>
        )}

        <RecentFoodsDropdown onSelectFood={handleSelectRecentFood} />

        <EntryForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          initialData={formData}
        />
      </div>
    </div>
  );
}
