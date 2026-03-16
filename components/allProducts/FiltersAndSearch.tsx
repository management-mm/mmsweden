import clsx from 'clsx';

import Filters from './Filters';
import Search from './Search';

type Props = {
  isAdmin?: boolean;
};

const FiltersAndSearch = ({ isAdmin }: Props) => {
  return (
    <aside
      className={clsx(
        'md:flex md:items-center md:justify-between lg:block lg:w-[264px] lg:pb-[62px]',
        isAdmin ? 'hidden lg:block' : ''
      )}
    >
      <Search className="md:hidden lg:block" />
      <Filters />
      <Search className="hidden md:block lg:hidden" />
    </aside>
  );
};

export default FiltersAndSearch;
