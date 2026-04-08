import DesktopHeader from './DesktopHeader';
import MobileHeaderShell from './MobileHeaderShell';
import TopBar from './TopBar';

const Header = () => {
  return (
    <header className="relative z-30 border-b border-slate-200 bg-white">
      <TopBar />
      <DesktopHeader />
      <MobileHeaderShell />
    </header>
  );
};

export default Header;
