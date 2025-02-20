import { NavLink, useLocation } from 'react-router-dom';

import SvgIcon from '@components/common/SvgIcon';

import useWindowWidth from '@hooks/useWindowWidth';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

const BackBtn = () => {
  const location = useLocation();
  const windowWidth = useWindowWidth();

  let title;
  if (
    /^\/admin\/all-products\/edit-product\/[a-zA-Z0-9]+$/.test(
      location.pathname
    )
  ) {
    title = 'Product Change';
  } else if (location.pathname === '/admin/new-product') {
    title = 'Add New Product';
  } else {
    title = 'Default Title';
  }

  return (
    <div
      className={cn(
        'flex items-center gap-[12px]',
        windowWidth < 1178 && 'container'
      )}
    >
      <NavLink
        to="/admin/all-products"
        className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-primary"
      >
        <SvgIcon iconId={IconId.ArrowLeft} size={{ width: 16, height: 16 }} />
      </NavLink>
      <div>
        <p className="font-openSans text-desc">Back to List</p>
        <h1 className="text-[24px] font-semibold text-primary">{title}</h1>
      </div>
    </div>
  );
};

export default BackBtn;
