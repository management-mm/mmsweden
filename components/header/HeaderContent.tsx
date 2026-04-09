import DesktopHeader from './DesktopHeader';
import MobileHeaderShell from './MobileHeaderShell';

const HeaderContent = () => {
  return (
    <>
      <div className="hidden lg:block">
        <DesktopHeader />
      </div>

      <div className="lg:hidden">
        <MobileHeaderShell />
      </div>
    </>
  );
};

export default HeaderContent;
