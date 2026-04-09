import HeaderContent from './HeaderContent';
import TopBar from './TopBar';

const Header = () => {
  return (
    <header className="relative z-30 border-b border-slate-200 bg-white">
      <TopBar />
      <HeaderContent />
    </header>
  );
};

export default Header;
