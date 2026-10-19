'use client';

import { useLocale } from 'next-intl';

import NavItem from './common/NavItem';

import { IconId } from '@enums/iconsSpriteId';

const NavCrm = () => {
  const locale = useLocale();

  return (
    <>
      <NavItem href={`/${locale}/admin/crm`} icon={IconId.Dashboard}>
        CRM Dashboard
      </NavItem>

      <NavItem href={`/${locale}/admin/leads`} icon={IconId.Leads}>
        Customer Leads
      </NavItem>

      <NavItem href={`/${locale}/admin/customers`} icon={IconId.Employees}>
        Customers
      </NavItem>

      <NavItem href={`/${locale}/admin/pipeline`} icon={IconId.Sales}>
        Sales Pipeline
      </NavItem>

      <NavItem href={`/${locale}/admin/deals`} icon={IconId.Deals}>
        Equipment Deals
      </NavItem>

      <NavItem href={`/${locale}/admin/quotations`} icon={IconId.Quotations}>
        Quotations
      </NavItem>

      <NavItem href={`/${locale}/admin/tasks`} icon={IconId.Tasks}>
        Tasks & Follow-ups
      </NavItem>

      <NavItem href={`/${locale}/admin/analytics`} icon={IconId.Statistic}>
        CRM Analytics
      </NavItem>
    </>
  );
};

export default NavCrm;
