import type { FC } from 'react';

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
  return (
    <li className="relative flex h-[232px] w-full flex-col items-center pt-[26px] shadow-card">
      <h3 className="mb-[12px] text-[18px] font-medium text-primary">
        {title}
      </h3>
      <p className="mb-[32px] text-[16px] font-medium text-secondaryAccent">
        {desc}
      </p>
      <address>
        <a
          className="mb-[22px] flex items-center justify-center font-openSans not-italic"
          href={`tel:${phoneHref}`}
        >
          <SvgIcon
            className="mr-[12px] fill-secondaryAccent"
            iconId={IconId.Phone}
            size={{ width: 16, height: 16 }}
          />
          <span className="sr-only">Phone: </span> {phone}
          {title === 'Artem Bortnik' && (
            <span className="text-[12px]">{additionalInfo}</span>
          )}
        </a>
        <a
          className="flex items-center justify-center font-openSans not-italic"
          href="mailto:info@mmsweden.se"
        >
          <SvgIcon
            className="mr-[12px] fill-secondaryAccent"
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
