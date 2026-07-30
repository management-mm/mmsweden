'use client';

import { useCallback, useEffect, useState } from 'react';

import { getAllEmailSubscribers } from '@api/emailSubscribersService';
import { IEmailSubscriber } from '@interfaces/IEmailSubscriber';

import EmailSubscribersTable from './EmailSubscribersTable';

import { getErrorMessage } from '@utils/errors/getErrorMessage';
import { normalizeError } from '@utils/errors/normalizeError';

export default function Main() {
  const [subscribers, setSubscribers] = useState<IEmailSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadSubscribers = useCallback(async (isRefresh = false) => {
    try {
      setErrorMessage('');

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getAllEmailSubscribers();

      setSubscribers(data);
    } catch (error) {
      const normalizedError = normalizeError(error);

      setErrorMessage(getErrorMessage(normalizedError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadSubscribers();
  }, [loadSubscribers]);

  return (
    <section className="p-6">
      <div className="mx-auto max-w-[1200px]">
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Email Subscribers
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage people who agreed to receive email updates about new
                products.
              </p>
            </div>

            <button
              type="button"
              disabled={loading || refreshing}
              onClick={() => void loadSubscribers(true)}
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          <div className="mb-6 h-px bg-gray-200" />

          {!loading && !errorMessage && (
            <div className="mb-5 flex items-center gap-2">
              <span className="text-sm text-gray-500">Total subscribers:</span>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                {subscribers.length}
              </span>
            </div>
          )}

          {loading && (
            <div className="flex min-h-[240px] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-700" />

                <p className="text-sm text-gray-500">Loading subscribers...</p>
              </div>
            </div>
          )}

          {!loading && errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
              <h2 className="font-semibold text-red-800">
                Failed to load subscribers
              </h2>

              <p className="mt-1 text-sm text-red-600">{errorMessage}</p>

              <button
                type="button"
                onClick={() => void loadSubscribers()}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !errorMessage && subscribers.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 px-6 py-14 text-center">
              <h2 className="font-semibold text-gray-800">
                No subscribers yet
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                People who agree to receive marketing emails will appear here.
              </p>
            </div>
          )}

          {!loading && !errorMessage && subscribers.length > 0 && (
            <EmailSubscribersTable subscribers={subscribers} />
          )}
        </div>
      </div>
    </section>
  );
}
