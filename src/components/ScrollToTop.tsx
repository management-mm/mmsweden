import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page');

  useEffect(() => {
    setTimeout(() => window.scrollTo(0, 0), 0);
  }, [pathname, page]);

  return null;
}
