import { useEffect } from 'react';

const useLockBodyScroll = (locked: boolean) => {
  useEffect(() => {
    const overflowValue = locked ? 'hidden' : '';

    document.body.style.overflow = overflowValue;
    document.documentElement.style.overflow = overflowValue;

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [locked]);
};

export default useLockBodyScroll;
