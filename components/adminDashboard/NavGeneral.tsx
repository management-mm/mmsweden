import NavItem from './common/NavItem';

import { IconId } from '@enums/iconsSpriteId';

const NavGeneral = () => {
  return (
    <>
      <NavItem href="/admin/email-newsletter" icon={IconId.Email}>
        Email newsletter
      </NavItem>

      <NavItem href="/admin/id-settings" icon={IconId.IdNumber}>
        Id Number Management
      </NavItem>

      <NavItem href="/admin/settings" icon={IconId.Settings}>
        Settings
      </NavItem>
    </>
  );
};

export default NavGeneral;
