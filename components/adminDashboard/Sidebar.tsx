import Nav from './Nav';
import LogoutButton from './common/Logout';

import { Logo } from '@components/common/Logo';
import LanguageSelect from '@components/common/languageSelector/LanguageSelect';

const Sidebar = () => {
  return (
    <aside className="lg:h-100vh border-neutral hidden w-[280px] shrink-0 border-r-2 px-[18px] pt-[14px] blur-[130] lg:block">
      <Logo className="mb-[60px] flex justify-center" />
      <Nav />
      <div className="flex items-center justify-between pr-[16px]">
        <LogoutButton />
        <LanguageSelect />
      </div>
    </aside>
  );
};

export default Sidebar;
