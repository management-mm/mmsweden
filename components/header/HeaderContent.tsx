import { getServerCategoryNavigation } from '@lib/serverCategoryNavigation';

import DesktopHeader from './DesktopHeader';
import MobileHeaderShell from './MobileHeaderShell';

import type { AppLocale } from '@i18n/config';

const HeaderContent = async ({ locale }: { locale: AppLocale }) => {
  const categories = await getServerCategoryNavigation();

  return (
    <>
      <div className="hidden lg:block">
        <DesktopHeader locale={locale} categories={categories} />
      </div>

      <div className="lg:hidden">
        <MobileHeaderShell categories={categories} />
      </div>
    </>
  );
};

export default HeaderContent;
