'use client';

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
    <li className="shadow-card relative flex h-[252px] w-full flex-col items-center pt-[26px] md:w-[calc((100%-30px)/2)] lg:w-[calc((100%-2*30px)/3)]">
      <h3 className="text-primary mb-[12px] text-[18px] font-medium">
        {t(title)}
      </h3>
      <p className="text-secondary-accent mb-[32px] text-center text-[16px] font-medium">
        {t(desc)}
      </p>
      <address>
        <a
          className="transition-color fill-primary font-openSans text-primary transition-fill duration-primary hover:fill-secondary-accent hover:text-secondary-accent mb-[22px] flex items-center justify-center not-italic"
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
          className="font-openSans flex items-center justify-center not-italic"
          href="mailto:info@mmsweden.se"
        >
          <SvgIcon
            className="fill-primary mr-[12px]"
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
