import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useEffect,
  useState,
} from 'react';

import clsx from 'clsx';
import { type FormikValues, useFormikContext } from 'formik';

import TimeSelector from './TimeSelector';

import timeframeList from '@constants/timeframeList';

interface IDeleteOrSoldProps {
  setIsDelete: (value: boolean) => void;
  isDelete: boolean;
  setDeletionDate: (value: string | null | boolean) => void;
  deletionDate: string | null | boolean;
}

const DeleteOrSold: FC<IDeleteOrSoldProps> = ({
  setIsDelete,
  isDelete,
  setDeletionDate,
  deletionDate,
}) => {
  const { setFieldValue, values, isSubmitting } = useFormikContext<FormikValues>();

  const [numbr, setNumbr] = useState<number>(1);
  const [timeframe, setTimeframe] = useState<string>('month');

  const numberList = Array.from({ length: 6 }, (_, index) => {
    return { value: index + 1, label: index + 1 };
  });

    useEffect(() => {
    console.log(isSubmitting)
  }, [isSubmitting])


  useEffect(() => {
    if (deletionDate) {
      const deletionDate = new Date();
      switch (timeframe) {
        case 'day':
          deletionDate.setDate(deletionDate.getDate() + numbr);
          break;
        case 'week':
          deletionDate.setDate(deletionDate.getDate() + numbr * 7);
          break;
        case 'month':
          deletionDate.setMonth(deletionDate.getMonth() + numbr);
          break;
      }
      setDeletionDate(
        new Date(deletionDate).toLocaleString('en', { dateStyle: 'long' })
      );
      setFieldValue('deletionDate', deletionDate.toISOString(), false);
    }
  }, [deletionDate, timeframe, numbr]);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setIsDelete(!isDelete);
          if (!isDelete) {
            setDeletionDate(null);
          }
        }}
        className={clsx(
          'mb-[20px] w-full rounded-[32px] py-[10px] text-center',
          isDelete
            ? 'border border-red-900 bg-red-900 text-secondary'
            : 'border border-primary bg-transparent text-primary'
        )}
      >
        Delete
      </button>
      <div className="flex justify-between gap-[12px]">
        <button
          type="button"
          onClick={() => {
            setDeletionDate(!deletionDate);
            if (deletionDate) {
              setFieldValue('deletionDate', null, false);
              return;
            }
            setIsDelete(false);
          }}
          className={clsx(
            'mb-[20px] w-[100px] rounded-[32px] py-[10px] text-center md:w-[calc((100%-12px)/2)]',
            values.deletionDate
              ? 'border border-red-900 bg-red-900 text-secondary'
              : 'border border-primary bg-transparent text-primary'
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
