import { useTranslation } from 'react-i18next';

import IndustryItem from './IndustryItem';

import NavLinkBtn from '@components/common/NavLinkBtn';

import { Button, Description, Title } from '@enums/i18nConstants';

import industriesList from '@constants/industriesList';

const Industries = () => {
  const { t } = useTranslation();
  return (
    <section className="pb-[96px] text-center">
      <div className="container">
        <h2 className="mb-[6px] text-[32px] font-bold leading-tight text-title md:text-[48px]">
          {t(Title.Industries)}
        </h2>
        <p className="mb-[48px] text-[16px] font-medium leading-normal text-desc">
          {t(Description.Industries)}
        </p>
        <ul className="mb-[32px] text-center md:flex md:flex-wrap md:gap-[30px]">
          {industriesList.map(industry => {
            const { iconId, iconSize, title, desc, className } = industry;
            return (
              <IndustryItem
                key={title}
                iconId={iconId}
                iconSize={iconSize}
                title={title}
                desc={desc}
                className={className}
              />
            );
          })}
        </ul>
        <NavLinkBtn intent="shopNow" path="all-products">
          {t(Button.ShopNow)}
        </NavLinkBtn>
      </div>
    </section>
  );
};

export default Industries;
