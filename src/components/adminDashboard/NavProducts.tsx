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
        <SvgIcon iconId={IconId.AllProducts} size={{ width: 16, height: 16 }} />
        Product List
      </NavLink>
      <NavLink
        to="new-product"
        className={({ isActive }) =>
          cn(
            'flex items-center gap-[12px] py-[8px] pl-[16px]',
            isActive
              ? 'rounded-[20px] bg-secondaryAccent fill-secondary text-secondary'
              : ''
          )
        }
      >
        <SvgIcon iconId={IconId.AddProduct} size={{ width: 16, height: 16 }} />
        New Product
      </NavLink>
    </>
  );
};

export default NavProducts;
