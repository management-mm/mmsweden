'use client';

import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';

import clsx from 'clsx';

import TimeSelector from './TimeSelector';

import timeframeList from '@constants/timeframeList';

type Timeframe = 'day' | 'week' | 'month';

interface IDeleteOrSoldProps {
  isDelete: boolean;
  formDeletionDate: string | null | Date;

  onOpenDeleteModal: () => void;
  onOpenSoldModal: () => void;

  setPendingSold: (payload: { iso: string; label: string }) => void;

  onClearSold: () => void;

  setIsDelete: Dispatch<SetStateAction<boolean>>;
}

const DeleteOrSold: FC<IDeleteOrSoldProps> = ({
  isDelete,
  formDeletionDate,
  onOpenDeleteModal,
  onOpenSoldModal,
  setPendingSold,
  onClearSold,
  setIsDelete,
}) => {
  const [numbr, setNumbr] = useState<number>(1);
  const [timeframe, setTimeframe] = useState<Timeframe>('month');

  const numberList = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => ({
        value: index + 1,
        label: index + 1,
      })),
    []
  );

  useEffect(() => {
    const d = new Date();

    if (timeframe === 'day') d.setDate(d.getDate() + numbr);
    if (timeframe === 'week') d.setDate(d.getDate() + numbr * 7);
    if (timeframe === 'month') d.setMonth(d.getMonth() + numbr);

    setPendingSold({
      iso: d.toISOString(),
      label: d.toLocaleString('en', { dateStyle: 'long' }),
    });
  }, [numbr, timeframe, setPendingSold]);

  return (
    <div>
      <button
        type="button"
        onClick={() => onOpenDeleteModal()}
        className={clsx(
          'mb-[20px] w-full cursor-pointer rounded-[32px] py-[10px] text-center',
          isDelete
            ? 'text-secondary border border-red-900 bg-red-900'
            : 'border-primary text-primary border bg-transparent'
        )}
      >
        Delete
      </button>

      <div className="flex justify-between gap-[12px]">
        <button
          type="button"
          onClick={() => {
            if (formDeletionDate) {
              onClearSold();
              return;
            }

            setIsDelete(false);
            onOpenSoldModal();
          }}
          className={clsx(
            'mb-[20px] w-[100px] cursor-pointer rounded-[32px] py-[10px] text-center md:w-[calc((100%-12px)/2)]',
            formDeletionDate
              ? 'text-secondary border border-red-900 bg-red-900'
              : 'border-primary text-primary border bg-transparent'
          )}
        >
          Sold
        </button>

        <div className="flex justify-end gap-[12px] md:w-[calc((100%-12px)/2)]">
          <TimeSelector
            defaultValue={numberList[0]}
            options={numberList}
            setValue={
              setNumbr as Dispatch<SetStateAction<string | number | undefined>>
            }
          />
          <TimeSelector
            defaultValue={timeframeList[2]}
            options={timeframeList}
            setValue={
              setTimeframe as Dispatch<
                SetStateAction<string | number | undefined>
              >
            }
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteOrSold;
