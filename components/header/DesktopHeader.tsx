import type { CategoryNavigationNode } from '@lib/serverCategoryNavigation';

import HeaderCategories from './HeaderCategories';
import HeaderSearchContainer from './HeaderSearchContainer';
import PriceQuoteBtn from './PriceQuoteBtn';

import { Logo } from '@components/common/Logo';

type Props = { categories: CategoryNavigationNode[] };

const DesktopHeader = ({ categories }: Props) => {
  return (
    <div className="hidden bg-white lg:block">
      <div className="container">
        <div className="flex h-[90px] items-center gap-6 py-4">
          <div className="shrink-0">
            <Logo />
          </div>

          <HeaderCategories categories={categories} />

          <div className="w-full">
            <HeaderSearchContainer />
          </div>

          <div className="flex items-center justify-end gap-3">
            <PriceQuoteBtn />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopHeader;
