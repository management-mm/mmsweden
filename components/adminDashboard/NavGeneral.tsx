'use client';

import { useLocale } from 'next-intl';

import NavItem from './common/NavItem';

import { IconId } from '@enums/iconsSpriteId';

const NavGeneral = () => {
  const locale = useLocale();

  return (
    <>
      <NavItem href={`/${locale}/admin/email-newsletter`} icon={IconId.Email}>
        Email newsletter
      </NavItem>

      <NavItem
        href={`/${locale}/admin/employees-settings`}
        icon={IconId.Employees}
      >
        Employees
      </NavItem>

      <NavItem href={`/${locale}/admin/id-settings`} icon={IconId.IdNumber}>
        Id Number Management
      </NavItem>

      <NavItem href={`/${locale}/admin/settings`} icon={IconId.Settings}>
        Settings
      </NavItem>
    </>
  );
};

export default NavGeneral;
