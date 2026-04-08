import Navbar from '@components/common/Navbar';
import LanguageSelect from '@components/common/languageSelector/LanguageSelect';

const TopBar = () => {
  return (
    <div className="bg-primary hidden border-b border-slate-200 lg:block">
      <div className="container">
        <div className="flex h-[35px] items-center justify-between">
          <div />
          <div className="flex items-center gap-6">
            <Navbar intent="header" />
            <div className="flex items-center gap-3">
              <LanguageSelect />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
