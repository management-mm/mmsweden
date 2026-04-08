import HeaderSearchState from './HeaderSearchState';
import TopBar from './TopBar';

const Header = () => {
  return (
    <header className="relative z-30 border-b border-slate-200 bg-white">
      <TopBar />
      <HeaderSearchState />
    </header>
  );
};

export default Header;
