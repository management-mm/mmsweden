import Filters from './Filters';
import Search from './Search';

const FiltersAndSearch = () => {
  return (
    <aside className="md:flex md:items-center md:justify-between lg:block lg:w-[264px] lg:pb-[62px]">
      <Search className="md:hidden lg:block" />
      <Filters />
      <Search className="hidden md:block lg:hidden" />
    </aside>
  );
};

export default FiltersAndSearch;
