'use client';

import { useEffect, useState } from 'react';
import { IUser } from '@/lib/models/User';

interface UserSwitcherProps {
  currentUserEmail?: string;
  onUserChange?: (userEmail: string) => void;
}

export default function UserSwitcher({
  currentUserEmail,
  onUserChange,
}: UserSwitcherProps) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | undefined>(currentUserEmail);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users || []);

          // Set default to first user if not set
          if (!selectedUserEmail && data.users?.[0]) {
            setSelectedUserEmail(data.users[0].email);
          }
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (userEmail: string) => {
    setSelectedUserEmail(userEmail);
    onUserChange?.(userEmail);
    setIsOpen(false);
  };

  const selectedUser = users.find((u) => u.email === selectedUserEmail);

  if (isLoading) {
    return null;
  }

  if (users.length <= 1) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
      >
        <span>👤</span>
        <span>{selectedUser?.name || 'Select User'}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-1">
            {users.map((user) => (
              <button
                key={user.email}
                onClick={() => handleUserSelect(user.email)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  user.email === selectedUserEmail
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {user.email}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Target: {user.dailyCalorieTarget} kcal
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
