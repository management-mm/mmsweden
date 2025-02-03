import { useState } from 'react';

import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

const NavBlock = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <div className="">
        <p className="">{title}</p>
        <button type="button" onClick={() => setIsOpen(!isOpen)} className="">
          <SvgIcon
            iconId={isOpen ? IconId.ArrowTop : IconId.ArrowDown}
            size={{ width: 10, height: 6 }}
            className="fill-title"
          />
        </button>
      </div>
      <nav className="">{children}</nav>
    </>
  );
};

export default NavBlock;
