'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import DailyEntryList from '@/components/DailyEntryList';
import UserSwitcher from '@/components/UserSwitcher';
import Link from 'next/link';
import { IEntry } from '@/lib/models/Entry';

export default function Home() {
  const { data: session, status } = useSession();
  const [entries, setEntries] = useState<IEntry[]>([]);
  const [dailyTarget, setDailyTarget] = useState(2000);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize with authenticated user's email on first load
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email && !selectedUserEmail) {
      setSelectedUserEmail(session.user.email);
    }
  }, [status, session, selectedUserEmail]);

  // Fetch data when selected user changes
  useEffect(() => {
    if (status !== 'authenticated' || !selectedUserEmail) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch user data by email to get daily target
        const userResponse = await fetch(`/api/users/me?email=${encodeURIComponent(selectedUserEmail)}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setDailyTarget(userData.user?.dailyCalorieTarget || 2000);
        } else {
          // If not found by email, default to 2000
          setDailyTarget(2000);
        }

        // Fetch today's entries for the selected user
        const today = new Date();
        const dateParam = today.toISOString().split('T')[0];

        const entriesResponse = await fetch(
          `/api/entries?date=${dateParam}&userId=${encodeURIComponent(selectedUserEmail)}`
        );

        if (entriesResponse.ok) {
          const entriesData = await entriesResponse.json();
          setEntries(entriesData.entries || []);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred';
        setError(message);
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [status, selectedUserEmail]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-4xl font-bold mb-4">Calorie Tracker</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8">
          Welcome to your personal calorie tracking application
        </p>
        <Link
          href="/auth/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header with User Switcher */}
        <div className="mb-6 flex justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Today's Meals</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {new Date().toLocaleDateString('en-GB', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <UserSwitcher
            currentUserEmail={selectedUserEmail}
            onUserChange={setSelectedUserEmail}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 rounded-lg">
            {error}
          </div>
        )}

        <DailyEntryList
          entries={entries}
          dailyCalorieTarget={dailyTarget}
          onEntryDeleted={() => {
            // Refetch entries after deletion
            window.location.reload();
          }}
        />

        <Link
          href="/entry/new"
          className="fixed bottom-20 right-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition"
        >
          + Add Entry
        </Link>
      </div>
    </div>
  );
}
