import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';

interface IPrivateRouteProps {
  component: JSX.Element;
  redirectTo?: string;
}

export const PrivateRoute = ({ component, redirectTo = '/' }: IPrivateRouteProps) => {
  const { isLoggedIn, isRefreshing } = useAuth();
  const shouldRedirect = !isLoggedIn && !isRefreshing;

  return shouldRedirect ? <Navigate to={redirectTo} /> : component;
};
