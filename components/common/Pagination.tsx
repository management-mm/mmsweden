'use client';

import { type FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import SvgIcon from './SvgIcon';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

const Next = () => {
  const { t } = useTranslation();
  return (
    <>
      <span className="mr-[8px] hidden md:block">{t('Pagination.Next')}</span>
      <SvgIcon iconId={IconId.ArrowRight} size={{ width: 8, height: 8 }} />
    </>
  );
};

const Previous = () => {
  const { t } = useTranslation();
  return (
    <>
      <SvgIcon
        className="md:mr-[8px]"
        iconId={IconId.ArrowLeft}
        size={{ width: 8, height: 8 }}
      />
      <span className="hidden md:block">{t('Pagination.Previous')}</span>
    </>
  );
};

interface IPaginationProps {
  pageCount: number;
  className?: string;
}

const Pagination: FC<IPaginationProps> = ({ pageCount, className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();

  const pageFromQuery = useMemo(() => {
    const p = searchParams.get('page');
    const n = p ? Number(p) : 1;
    if (!Number.isFinite(n) || n < 1) return 0;
    return n - 1;
  }, [searchKey, searchParams]);

  const [currentPage, setCurrentPage] = useState(pageFromQuery);

  useEffect(() => {
    setCurrentPage(pageFromQuery);
  }, [pageFromQuery]);

  const manufacturer = searchParams.get('manufacturer');
  const category = searchParams.get('category');
  const industry = searchParams.get('industry');
  const condition = searchParams.get('condition');
  const title = searchParams.get('title');

  const pushParams = (params: URLSearchParams) => {
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handlePageClick = (page: number) => {
    const params = new URLSearchParams(searchKey);

    if (page === 0) {
      params.delete('page');
      pushParams(params);
      setCurrentPage(0);
      return;
    }

    params.set('page', String(page + 1));
    pushParams(params);
    setCurrentPage(page);
  };

  useEffect(() => {
    if (manufacturer || category || industry || condition || title) {
      const params = new URLSearchParams(searchKey);
      params.delete('page');
      pushParams(params);
      setCurrentPage(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manufacturer, category, industry, condition, title]);

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel={<Next />}
      previousLabel={<Previous />}
      onPageChange={e => handlePageClick(e.selected)}
      forcePage={currentPage}
      pageCount={pageCount}
      pageRangeDisplayed={pageCount >= 6 ? 1 : 2}
      marginPagesDisplayed={pageCount >= 6 ? 1 : 0}
      renderOnZeroPageCount={null}
      disabledClassName="shadow-disabled"
      disabledLinkClassName="text-disabled fill-disabled shadow-pageDisabled"
      breakClassName="mr-[8px] font-bold text-[16px] text-desc leading-[1.09]"
      pageClassName="font-medium text-[12px] rounded-full border border-neutral w-[36px] h-[36px] shadow-pagination mr-[8px] text-desc"
      pageLinkClassName="w-full h-full flex justify-center items-center"
      nextLinkClassName="flex items-center rounded-full w-[36px] h-[36px] md:py-[8px] md:min-w-[96px] justify-center text-desc fill-desc font-openSans text-[12px] md:rounded-[64px] border border-neutral shadow-pagination ml-[8px] md:ml-[24px]"
      previousLinkClassName="flex items-center rounded-full w-[36px] h-[36px] md:py-[8px] md:min-w-[96px] justify-center text-desc fill-desc font-openSans text-[12px] md:rounded-[64px] border border-neutral shadow-pagination mr-[16px] md:mr-[32px]"
      className={cn(
        'mx-auto flex w-full items-center justify-center md:w-[444px]',
        className
      )}
      previousClassName=""
      containerClassName="flex mx-auto"
      activeClassName="bg-primary text-secondary"
    />
  );
};

export default Pagination;
