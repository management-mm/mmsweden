'use client';

import type { FC } from 'react';
import ReactPaginate from 'react-paginate';

import { buildCatalogPageHref } from '@lib/catalogPagination';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import SvgIcon from './SvgIcon';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

const Next = () => {
  const t = useTranslations();
  return (
    <>
      <span className="mr-[8px] hidden md:block">{t('Pagination.Next')}</span>
      <SvgIcon iconId={IconId.ArrowRight} size={{ width: 8, height: 8 }} />
    </>
  );
};

const Previous = () => {
  const t = useTranslations();
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

interface Props {
  pageCount: number;
  currentPage: number;
  pathname: string;
  filterQuery: string;
  className?: string;
}

/**
 * Same ReactPaginate markup/styles as the old pagination. The difference is
 * hrefBuilder: ReactPaginate now renders real <a href="...?page=2"> links
 * during server-side prerendering, so crawlers can follow them without JS.
 * No useSearchParams hook / CSR bailout in the public pagination.
 */
const SeoPagination: FC<Props> = ({
  pageCount,
  currentPage,
  pathname,
  filterQuery,
  className,
}) => {
  const router = useRouter();
  const selected = Math.max(0, Math.min(currentPage - 1, pageCount - 1));
  const getHref = (page: number) =>
    buildCatalogPageHref(pathname, page, filterQuery);

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel={<Next />}
      previousLabel={<Previous />}
      hrefBuilder={getHref}
      hrefAllControls
      onPageChange={event => {
        router.push(getHref(event.selected + 1), { scroll: false });
      }}
      forcePage={selected}
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

export default SeoPagination;
