'use client';

import { useTranslation } from 'react-i18next';

import Address from '@components/common/Address';
import MainContacts from '@components/common/MainContacts';
import SvgIcon from '@components/common/SvgIcon';
import WorkingHours from '@components/common/WorkingHours';

import { ContactUs } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

import socialMediaList from '@constants/socialMediaList';

const ContactsPart = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-wrap md:mb-[94px] lg:flex lg:justify-around">
      <div className="mb-[44px] lg:mb-0">
        <Address
          containerClassName={'mb-[9px]'}
          iconClassName={'fill-secondary-accent'}
        />
        <a className="text-secondary-accent flex items-center gap-[12px] pl-[20px] text-[14px] font-semibold">
          {t(ContactUs.ViewOnMap)}
          <SvgIcon
            className="fill-secondary-accent"
            iconId={IconId.ArrowRight}
            size={{ width: 8, height: 14 }}
          />
        </a>
      </div>
      <MainContacts
        containerClassName={'mb-[44px] lg:mb-0'}
        iconClassName={'fill-secondary-accent mr-[9px]'}
      />
      <div className="mb-[44px] flex flex-col gap-[22px] lg:mb-0">
        {socialMediaList.map((item, index) => {
          return (
            index !== 2 && (
              <a key={item.href} className="flex gap-[9px]" href={item.href}>
                <SvgIcon
                  className="fill-secondary-accent"
                  iconId={IconId[item.iconId]}
                  size={item.iconSize}
                />
                <span>{item.title}</span>
              </a>
            )
          );
        })}
      </div>
      <WorkingHours
        containerClassName={'mb-[64px] lg:mb-0'}
        iconClassName={'fill-secondary-accent'}
      />
    </div>
  );
};

export default ContactsPart;
