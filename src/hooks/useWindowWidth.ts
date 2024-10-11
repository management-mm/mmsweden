import { useEffect, useState } from 'react';

import { debounce } from 'lodash';

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 100);
    window.addEventListener('resize', handleResize);

    return () => {
      handleResize.cancel();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowWidth;
};

export default useWindowWidth;
