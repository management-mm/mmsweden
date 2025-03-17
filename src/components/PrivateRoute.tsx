import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@hooks/useAuth';

interface IPrivateRouteProps {
  component: JSX.Element;
  redirectTo?: string;
}

export const PrivateRoute = ({
  component,
  redirectTo = '/',
}: IPrivateRouteProps) => {
  const { isLoggedIn, isRefreshing } = useAuth();
  const shouldRedirect = !isLoggedIn && !isRefreshing;
  const location = useLocation();

  return shouldRedirect ? (
    <Navigate to={location.state?.from ?? redirectTo} />
  ) : (
    component
  );
};
