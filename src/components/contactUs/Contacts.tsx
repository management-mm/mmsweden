import { Trans, useTranslation } from 'react-i18next';

import ContactsPart from './ContactsPart';
import EmployeeItem from './EmployeeItem';
import Info from './Info';

import { ContactUs } from '@enums/i18nConstants';

import employeesList from '@constants/employeesList';

const Contacts = () => {
  useTranslation();

  return (
    <section className="pb-[102px] md:pb-[120px]">
      <div className="container">
        <h2 className="sr-only">Contacts</h2>
        <div className="mb-[64px] lg:mb-[94px] lg:flex lg:gap-[30px]">
          <Info>
            {/* prettier-ignore */}
            <Trans i18nKey={ContactUs.Info1}>
              If you have questions regarding our<span className="font-semibold">products or shipping</span>,please, contact
              <span className="font-semibold">Hampus Wahlgren</span> (or his
              assistant <span className="font-semibold">Artem Bortnik</span>)
            </Trans>
          </Info>
          <Info>
            {/* prettier-ignore */}
            <Trans i18nKey={ContactUs.Info2}>
              If you have questions regarding
              <span className="font-semibold">payment</span>, please, contact
              <span className="font-semibold">Eva Andersson</span>
            </Trans>
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
