'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { getAllEmailSubscribers } from '@api/emailSubscribersService';
import { IEmailSubscriber } from '@interfaces/IEmailSubscriber';

import EmailSubscribersTable from './EmailSubscribersTable';

import { getErrorMessage } from '@utils/errors/getErrorMessage';
import { normalizeError } from '@utils/errors/normalizeError';

const getMonthValue = (dateValue: string) => {
  const date = new Date(dateValue);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}`;
};

const escapeCsvValue = (value: string) => {
  return `"${value.replace(/"/g, '""')}"`;
};

export default function Main() {
  const [subscribers, setSubscribers] = useState<IEmailSubscriber[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('all');

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

  const months = useMemo(() => {
    const uniqueMonths = new Map<
      string,
      {
        value: string;
        label: string;
        timestamp: number;
      }
    >();

    subscribers.forEach(subscriber => {
      const date = new Date(subscriber.createdAt);

      if (Number.isNaN(date.getTime())) {
        return;
      }

      const year = date.getFullYear();
      const month = date.getMonth();

      const value = `${year}-${String(month + 1).padStart(2, '0')}`;

      if (!uniqueMonths.has(value)) {
        uniqueMonths.set(value, {
          value,
          label: new Intl.DateTimeFormat('en-US', {
            month: 'long',
            year: 'numeric',
          }).format(date),
          timestamp: new Date(year, month, 1).getTime(),
        });
      }
    });

    return Array.from(uniqueMonths.values()).sort(
      (a, b) => b.timestamp - a.timestamp
    );
  }, [subscribers]);

  const filteredSubscribers = useMemo(() => {
    const filtered =
      selectedMonth === 'all'
        ? subscribers
        : subscribers.filter(
            subscriber => getMonthValue(subscriber.createdAt) === selectedMonth
          );

    return [...filtered].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [subscribers, selectedMonth]);

  const handleExportCsv = useCallback(() => {
    if (filteredSubscribers.length === 0) {
      return;
    }

    const headers = ['Email Address', 'First Name', 'Source', 'Signup Date'];

    const rows = filteredSubscribers.map(subscriber => [
      subscriber.email,
      subscriber.name,
      subscriber.source,
      new Date(subscriber.createdAt).toISOString().split('T')[0],
    ]);

    const csv = [
      headers.map(escapeCsvValue).join(','),
      ...rows.map(row =>
        row.map(value => escapeCsvValue(String(value))).join(',')
      ),
    ].join('\n');

    const blob = new Blob(['\uFEFF', csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;

    link.download =
      selectedMonth === 'all'
        ? 'email-subscribers-all.csv'
        : `email-subscribers-${selectedMonth}.csv`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
  }, [filteredSubscribers, selectedMonth]);

  useEffect(() => {
    void loadSubscribers();
  }, [loadSubscribers]);

  useEffect(() => {
    if (
      selectedMonth !== 'all' &&
      !months.some(month => month.value === selectedMonth)
    ) {
      setSelectedMonth('all');
    }
  }, [months, selectedMonth]);

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
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Subscribers:</span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                  {filteredSubscribers.length}
                </span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="month"
                    className="text-sm font-medium text-gray-600"
                  >
                    Month
                  </label>

                  <select
                    id="month"
                    value={selectedMonth}
                    onChange={event => setSelectedMonth(event.target.value)}
                    className="min-w-[180px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  >
                    <option value="all">All months</option>

                    {months.map(month => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  disabled={filteredSubscribers.length === 0}
                  onClick={handleExportCsv}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Export CSV
                </button>
              </div>
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

          {!loading && !errorMessage && filteredSubscribers.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 px-6 py-14 text-center">
              <h2 className="font-semibold text-gray-800">
                {selectedMonth === 'all'
                  ? 'No subscribers yet'
                  : 'No subscribers found'}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {selectedMonth === 'all'
                  ? 'People who agree to receive marketing emails will appear here.'
                  : 'There are no subscribers for the selected month.'}
              </p>
            </div>
          )}

          {!loading && !errorMessage && filteredSubscribers.length > 0 && (
            <EmailSubscribersTable subscribers={filteredSubscribers} />
          )}
        </div>
      </div>
    </section>
  );
}
