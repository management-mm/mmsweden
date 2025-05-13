import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';
import { useSearchParams } from 'react-router-dom';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    searchParams.get('page') ? Number(searchParams.get('page')) - 1 : 0
  );

  const manufacturer = searchParams.get('manufacturer');
  const category = searchParams.get('category');
  const industry = searchParams.get('industry');
  const condition = searchParams.get('condition');
  const title = searchParams.get('title');

  const handlePageClick = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (page === 0) {
      newSearchParams.delete('page');
      setSearchParams(newSearchParams);
      return;
    }
    newSearchParams.set('page', String(page + 1));
    setCurrentPage(page);

    setSearchParams(newSearchParams);
  };

  useEffect(() => {
    if (manufacturer || category || industry || condition || title) {
      setSearchParams(prevParams => {
        prevParams.delete('page');
        return prevParams;
      });
      setCurrentPage(0);
    }
  }, [manufacturer, category, industry, condition, title]);

  return (
    <>
      <ReactPaginate
        breakLabel="..."
        nextLabel={<Next />}
        disabledClassName="shadow-disabled"
        nextLinkClassName={
          'flex items-center rounded-full w-[36px] h-[36px] md:py-[8px] md:min-w-[96px] justify-center text-desc fill-desc font-openSans text-[12px] md:rounded-[64px] border border-neutral shadow-pagination ml-[8px] md:ml-[24px]'
        }
        previousLinkClassName="flex items-center rounded-full w-[36px] h-[36px] md:py-[8px] md:min-w-[96px] justify-center text-desc fill-desc font-openSans text-[12px] md:rounded-[64px] border border-neutral shadow-pagination mr-[16px] md:mr-[32px]"
        pageClassName={
          'font-medium text-[12px] rounded-full border border-neutral w-[36px] h-[36px] shadow-pagination mr-[8px] text-desc'
        }
        disabledLinkClassName="text-disabled fill-disabled shadow-pageDisabled"
        pageLinkClassName="w-full h-full flex justify-center items-center "
        previousLabel={<Previous />}
        onPageChange={e => handlePageClick(e.selected)}
        breakClassName="mr-[8px] font-bold text-[16px] text-desc leading-[1.09]"
        forcePage={currentPage}
        pageCount={pageCount}
        pageRangeDisplayed={pageCount >= 6 ? 1 : 2}
        marginPagesDisplayed={pageCount >= 6 ? 1 : 0}
        className={cn(
          'mx-auto flex w-full items-center justify-center md:w-[444px]',
          className
        )}
        renderOnZeroPageCount={null}
        previousClassName={''}
        containerClassName={'flex  mx-auto'}
        activeClassName="bg-primary text-secondary"
        // disabledLinkClassName='bg-[rgba(102,102,102,1)] text-[rgba(252,252,252,1)] fill-[rgba(252,252,252,1)]'
      />
    </>
  );
};

export default Pagination;
