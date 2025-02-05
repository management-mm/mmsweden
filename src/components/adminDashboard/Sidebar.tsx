import Nav from './Nav';

import { Logo } from '@components/common/Logo';

const Sidebar = () => {
  return (
    <aside className="max-h-100lvh hidden w-[280px] border-r-2 border-neutral px-[18px] pt-[14px] blur-[130] lg:block">
      <Logo className="mb-[60px] flex justify-center" />
      <Nav />
    </aside>
  );
};

export default Sidebar;
