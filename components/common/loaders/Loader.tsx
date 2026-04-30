'use client';

import { useEffect, useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';

const Loader = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed top-1/2 left-1/2 z-5 -translate-x-1/2 -translate-y-1/2">
      <ThreeDots height="80" width="80" color="rgba(0, 32, 59, 1)" />
    </div>
  );
};

export default Loader;
