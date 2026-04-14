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
      <Search />
      <Filters />
    </aside>
  );
};

export default FiltersAndSearch;
