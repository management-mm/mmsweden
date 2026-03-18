'use client';

import { useEffect, useState } from 'react';

import { getProductCounter, updateNextProductId } from '@api/countersService';
import axios from 'axios';

import TextImportant from './TextImportant';

import { useNotify } from '@hooks/useNotify';

export default function IdNumberEdit() {
  const [value, setValue] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const { notifySuccess, notifyError } = useNotify();

  useEffect(() => {
    if (value !== '') return;

    const loadId = async () => {
      try {
        const id = await getProductCounter();
        setValue(id);
      } catch (error) {
        console.error(error);
      }
    };

    loadId();
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val === '' ? '' : Number(val));
  };

  const handleSave = async () => {
    if (value === '' || value < 0) return;

    try {
      setIsLoading(true);
      await updateNextProductId(value);
      notifySuccess('You have successfully updated next product id number');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        notifyError(
          error.response?.data?.message || 'Oops... Something went wrong'
        );
      } else {
        notifyError('Unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <input
          type="number"
          className="input"
          value={value}
          onChange={handleChange}
          disabled={isLoading}
        />

        <button
          onClick={handleSave}
          disabled={isLoading}
          className="btn btn-primary text-secondary rounded-[22px]"
        >
          Save
        </button>
      </div>

      <TextImportant value={value} />
    </>
  );
}
