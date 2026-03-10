import { useTranslations } from 'next-intl';

import ContactsPart from './ContactsPart';
import EmployeeItem from './EmployeeItem';
import Info from './Info';

import { ContactUs } from '@enums/i18nConstants';

import employeesList from '@constants/employeesList';

const Contacts = () => {
  const t = useTranslations();

  return (
    <section className="pb-[102px] md:pb-[120px]">
      <div className="container">
        <h2 className="sr-only">Contacts</h2>

        <div className="mb-[64px] lg:mb-[94px] lg:flex lg:gap-[30px]">
          <Info>
            {t.rich(ContactUs.Info1, {
              bold: chunks => <span className="font-semibold">{chunks}</span>,
            })}
          </Info>

          <Info>
            {t.rich(ContactUs.Info2, {
              bold: chunks => <span className="font-semibold">{chunks}</span>,
            })}
          </Info>
        </div>

        <ContactsPart />

        <ul className="flex flex-col flex-wrap gap-[32px] md:flex-row md:gap-[30px]">
          {employeesList.map(employee => (
            <EmployeeItem key={employee.title} employee={employee} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Contacts;
