import LanguageSelect from '@components/header/LanguageSelect';
import Nav from './Nav';

import { Logo } from '@components/common/Logo';

const Sidebar = () => {
  return (
    <aside className="lg:h-100vh shrink-0 hidden w-[280px] border-r-2 border-neutral px-[18px] pt-[14px] blur-[130] lg:block">
      <Logo className="mb-[60px] flex justify-center" />
      <Nav />
      <div className='flex justify-end pr-[16px]'>
        <LanguageSelect />
      </div>
    </aside>
  );
};

export default Sidebar;
