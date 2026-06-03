'use client';

import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-white dark:bg-slate-950">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold mb-4 text-red-600">Access Denied</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Your email address is not whitelisted for this application.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
          Please contact the administrator if you believe this is an error.
        </p>
        <Link
          href="/api/auth/signin"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Another Account
        </Link>
      </div>
    </div>
  );
}
