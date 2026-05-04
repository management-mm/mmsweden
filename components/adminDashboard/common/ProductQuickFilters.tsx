'use client';

import { HiOutlineDocumentText } from 'react-icons/hi2';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import { RiDraftLine } from 'react-icons/ri';
import { TiThSmall } from 'react-icons/ti';

import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type FilterValue = 'all' | 'sold' | 'draft' | 'hasNotes';

const filters: {
  label: string;
  value: FilterValue;
  icon?: React.ReactNode;
}[] = [
  { label: 'All', value: 'all', icon: <TiThSmall size={22} /> },
  {
    label: 'Sold',
    value: 'sold',
    icon: <IoCheckmarkCircleOutline size={22} />,
  },
  {
    label: 'Drafts',
    value: 'draft',
    icon: <HiOutlineDocumentText size={22} />,
  },
  {
    label: 'Has notes',
    value: 'hasNotes',
    icon: <RiDraftLine size={22} />,
  },
];

export default function ProductQuickFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentFilter = searchParams.get('filter');

  const activeFilter: FilterValue =
    currentFilter === 'sold' ||
    currentFilter === 'draft' ||
    currentFilter === 'hasNotes'
      ? currentFilter
      : 'all';

  const handleChangeFilter = (value: FilterValue) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete('page');
    params.delete('filter');

    if (value !== 'all') {
      params.set('filter', value);
    }

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return (
    <div className="mb-[30px] flex flex-wrap gap-[8px] lg:gap-[16px]">
      {filters.map(filter => {
        const isActive = activeFilter === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => handleChangeFilter(filter.value)}
            className={clsx(
              'font-openSans flex items-center gap-[4px] rounded-[32px] border px-[34px] py-[10px] text-[16px] font-semibold transition',
              isActive
                ? 'border-primary bg-primary text-white'
                : 'border-primary text-primary hover:bg-primary bg-white hover:text-white'
            )}
          >
            {filter.icon}
            <span>{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
}
