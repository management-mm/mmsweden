import HeaderContent from './HeaderContent';
import TopBar from './TopBar';

import type { AppLocale } from '@i18n/config';

const Header = ({ locale }: { locale: AppLocale }) => {
  return (
    <header className="relative z-30 border-b border-slate-200 bg-white">
      <TopBar />
      <HeaderContent locale={locale} />
    </header>
  );
};

export default Header;
