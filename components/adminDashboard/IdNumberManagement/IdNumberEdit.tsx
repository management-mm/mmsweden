'use client';

import { useCallback, useEffect, useState } from 'react';

import { getProductCounter, updateNextProductId } from '@api/countersService';

import TextImportant from './TextImportant';

import RetryBlock from '@components/common/error/RetryBlock';

import { useNotify } from '@hooks/useNotify';

import { AppError } from '@utils/errors/AppError';
import { getErrorMessage } from '@utils/errors/getErrorMessage';
import { logError } from '@utils/errors/logError';
import { normalizeError } from '@utils/errors/normalizeError';

export default function IdNumberEdit() {
  const [value, setValue] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<AppError | null>(null);

  const { notifySuccess, notifyError } = useNotify();

  const loadId = useCallback(async () => {
    setLoadError(null);

    try {
      const id = await getProductCounter();
      setValue(id);
    } catch (error) {
      const normalizedError = normalizeError(error);

      logError(normalizedError, {
        scope: 'getProductCounter',
      });

      setLoadError(normalizedError);
    }
  }, []);

  useEffect(() => {
    if (value !== '') return;
    loadId();
  }, [value, loadId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (rawValue === '') {
      setValue('');
      return;
    }

    const nextValue = Number(rawValue);

    if (Number.isNaN(nextValue)) {
      return;
    }

    setValue(nextValue);
  };

  const handleSave = async () => {
    if (value === '' || Number.isNaN(value) || value < 0) {
      notifyError('Please enter a valid non-negative number.');
      return;
    }

    try {
      setIsLoading(true);

      await updateNextProductId(value);

      notifySuccess('You have successfully updated next product id number');
    } catch (error) {
      const normalizedError = normalizeError(error);

      logError(normalizedError, {
        scope: 'updateNextProductId',
        details: {
          nextProductId: value,
        },
      });

      notifyError(getErrorMessage(normalizedError));
    } finally {
      setIsLoading(false);
    }
  };

  if (loadError) {
    return (
      <RetryBlock
        error={loadError}
        message="Failed to load current product counter."
        onRetry={loadId}
        className="max-w-[520px]"
      />
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <input
          type="number"
          className="input"
          value={value}
          onChange={handleChange}
          disabled={isLoading}
          min={0}
        />

        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className="btn btn-primary text-secondary rounded-[22px] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>

      <TextImportant value={value} />
    </>
  );
}
