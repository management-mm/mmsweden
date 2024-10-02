import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import DecorativeLine from '@components/common/DecorativeLine';
import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

import type { IEmployeeItem } from '@constants/employeesList';

interface IEmployeeItemProps {
  employee: IEmployeeItem;
}

const EmployeeItem: FC<IEmployeeItemProps> = ({
  employee: { title, desc, phone, phoneHref, additionalInfo, email },
}) => {
  const { t } = useTranslation();

  return (
    <li className="relative flex h-[252px] w-full flex-col items-center pt-[26px] shadow-card md:w-[calc((100%-30px)/2)] lg:w-[calc((100%-2*30px)/3)]">
      <h3 className="mb-[12px] text-[18px] font-medium text-primary">
        {t(title)}
      </h3>
      <p className="mb-[32px] text-center text-[16px] font-medium text-secondaryAccent">
        {t(desc)}
      </p>
      <address>
        <a
          className="transition-color mb-[22px] flex items-center justify-center fill-primary font-openSans not-italic text-primary transition-fill duration-primary hover:fill-secondaryAccent hover:text-secondaryAccent"
          href={`tel:${phoneHref}`}
        >
          <SvgIcon
            className="mr-[12px]"
            iconId={IconId.Phone}
            size={{ width: 16, height: 16 }}
          />
          <span className="sr-only">Phone: </span>{' '}
          <span className="">{phone}</span>
          {title === 'Employee.Artem' && (
            <span className="text-[12px]">{additionalInfo}</span>
          )}
        </a>
        <a
          className="flex items-center justify-center font-openSans not-italic"
          href="mailto:info@mmsweden.se"
        >
          <SvgIcon
            className="mr-[12px] fill-primary"
            iconId={IconId.Email}
            size={{ width: 15, height: 15 }}
          />
          <span className="sr-only">Email: </span> {email}
        </a>
      </address>
      <DecorativeLine intent="primary" />
    </li>
  );
};

export default EmployeeItem;
