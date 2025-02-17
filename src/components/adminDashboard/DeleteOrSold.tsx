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
}

const DeleteOrSold: FC<IDeleteOrSoldProps> = ({ setIsDelete, isDelete }) => {
  const [isSold, setIsSold] = useState(false);
  const { setFieldValue } = useFormikContext<FormikValues>();

  const [numbr, setNumbr] = useState<number>(1);
  const [timeframe, setTimeframe] = useState<string>('month');

  const numberList = Array.from({ length: 6 }, (_, index) => {
    return { value: index + 1, label: index + 1 };
  });

  useEffect(() => {
    if (isSold) {
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
      console.log(deletionDate.toISOString());
      setFieldValue('deletionDate', deletionDate.toISOString(), false);
    }
  }, [isSold, timeframe, numbr]);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setIsDelete(!isDelete);
          if (!isDelete) {
            setIsSold(false);
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
            setIsSold(!isSold);
            if (isSold) {
              setFieldValue('deletionDate', null, false);
              return;
            }
            setIsDelete(false);
          }}
          className={clsx(
            'mb-[20px] w-[100px] rounded-[32px] py-[10px] text-center md:w-[calc((100%-12px)/2)]',
            isSold
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
