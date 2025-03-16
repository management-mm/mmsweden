import { NavLink } from 'react-router-dom';

import SvgIcon from '@components/common/SvgIcon';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

const NavProducts = () => {
  return (
    <>
      <NavLink
        to="all-products"
        className={({ isActive }) =>
          cn(
            'flex items-center gap-[12px] py-[8px] pl-[16px]',
            isActive
              ? 'rounded-[20px] bg-secondaryAccent fill-secondary text-secondary'
              : ''
          )
        }
      >
        <SvgIcon iconId={IconId.AllProducts} size={{ width: 18, height: 18 }} />
        Product List
      </NavLink>
      <NavLink
        to="new-product"
        state={{ from: '/admin/new-product' }}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-[12px] py-[8px] pl-[16px]',
            isActive
              ? 'rounded-[20px] bg-secondaryAccent fill-secondary text-secondary'
              : ''
          )
        }
      >
        <SvgIcon iconId={IconId.AddProduct} size={{ width: 18, height: 18 }} />
        New Product
      </NavLink>
      <NavLink
        to="filters-settings"
        state={{ from: '/admin/filters-settings' }}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-[12px] py-[8px] pl-[16px]',
            isActive
              ? 'rounded-[20px] bg-secondaryAccent fill-secondary text-secondary'
              : ''
          )
        }
      >
        <SvgIcon iconId={IconId.Filter} size={{ width: 14, height: 14 }} />
        Filters Settings
      </NavLink>
    </>
  );
};

export default NavProducts;
