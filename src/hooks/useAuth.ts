import { useSelector } from 'react-redux';

import {
  selectIsLoggedIn,
  selectIsRefreshing,
  selectUser,
} from '@store/selectors';

export const useAuth = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);
  const user = useSelector(selectUser);

  return {
    isLoggedIn,
    isRefreshing,
    user,
  };
};
