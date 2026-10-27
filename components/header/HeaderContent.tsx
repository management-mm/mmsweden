import { getServerCategoryNavigation } from '@lib/serverCategoryNavigation';

import DesktopHeader from './DesktopHeader';
import MobileHeaderShell from './MobileHeaderShell';

const HeaderContent = async () => {
  const categories = await getServerCategoryNavigation();

  return (
    <>
      <div className="hidden lg:block">
        <DesktopHeader categories={categories} />
      </div>

      <div className="lg:hidden">
        <MobileHeaderShell categories={categories} />
      </div>
    </>
  );
};

export default HeaderContent;
