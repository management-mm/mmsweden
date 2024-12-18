import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import clsx from 'clsx';

import { NavBar } from '@enums/i18nConstants';

interface IBreadcrumbProps {
  productId?: string | undefined;
  name?: string;
}

const Breadcrumb: FC<IBreadcrumbProps> = ({ productId, name }) => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="mb-[22px] flex flex-wrap items-center text-[14px] font-medium text-desc md:text-[16px]">
      <Link to={'/'} className="mr-[12px] cursor-pointer hover:text-black">
        {t(NavBar.Home)}
      </Link>
      {location.pathname.includes('/all-products') && (
        <>
          <span className="mr-[12px]">/</span>
          <Link
            to={'/all-products'}
            className={clsx(
              'mr-[12px]',
              location.pathname === '/all-products' && 'text-title'
            )}
          >
            {t(NavBar.AllProducts)}
          </Link>
        </>
      )}
      {location.pathname.includes(`/all-products/${productId}`) && (
        <>
          <span className="mr-[12px]">/</span>
          <Link
            to={`/all-products/${productId}`}
            className={clsx(
              '',
              location.pathname.includes(`/all-products/${productId}`) &&
                'text-title'
            )}
          >
            {name}
          </Link>
        </>
      )}
    </div>
  );
};

export default Breadcrumb;
