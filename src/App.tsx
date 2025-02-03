import { startTransition, useEffect } from 'react';

import AppRouter from '@router/AppRouter';

import { refreshUser } from '@store/auth/operations';

import { useAppDispatch } from '@hooks/useAppDispatch';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    startTransition(() => {
      dispatch(refreshUser());
    });
  }, [dispatch]);

  return <AppRouter />;
}

export default App;
