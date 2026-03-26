'use client';

import { type FC, useState } from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { type Dayjs } from 'dayjs';

import formatDateRange from '@utils/formatDateRange';

interface IWeekPickerProps {
  setDateRangeText: (value: string) => void;
}

const WeekPicker: FC<IWeekPickerProps> = ({ setDateRangeText }) => {
  const [startWeek, setStartWeek] = useState<Dayjs>(dayjs().subtract(7, 'day'));
  const [endWeek, setEndWeek] = useState<Dayjs>(dayjs());

  const updateRangeText = (start: Dayjs, end: Dayjs) => {
    setDateRangeText(formatDateRange(start.toDate(), end.toDate()));
  };

  return (
    <div className="flex w-full flex-wrap items-center gap-2 md:flex-nowrap">
      <DatePicker
        label="From"
        value={startWeek}
        onChange={newValue => {
          if (!newValue) return;

          setStartWeek(newValue);
          updateRangeText(newValue, endWeek);
        }}
      />

      <DatePicker
        label="To"
        value={endWeek}
        onChange={newValue => {
          if (!newValue) return;

          setEndWeek(newValue);
          updateRangeText(startWeek, newValue);
        }}
      />
    </div>
  );
};

export default WeekPicker;
