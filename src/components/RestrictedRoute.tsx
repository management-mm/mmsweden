import { Navigate } from 'react-router-dom';

import { useAuth } from '@hooks/useAuth';

interface IRestrictedRouteProps {
  component: JSX.Element;
  redirectTo?: string;
}

export const RestrictedRoute = ({
  component: Component,
  redirectTo = '/',
}: IRestrictedRouteProps) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Navigate to={redirectTo} /> : Component;
};
