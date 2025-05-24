import Nav from './Nav';

import LanguageSelect from '@components/common/LanguageSelect';
import { Logo } from '@components/common/Logo';

const Sidebar = () => {
  return (
    <aside className="lg:h-100vh hidden w-[280px] shrink-0 border-r-2 border-neutral px-[18px] pt-[14px] blur-[130] lg:block">
      <Logo className="mb-[60px] flex justify-center" />
      <Nav />
      <div className="flex justify-end pr-[16px]">
        <LanguageSelect />
      </div>
    </aside>
  );
};

export default Sidebar;
