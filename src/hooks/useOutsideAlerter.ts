import { useEffect, useRef } from 'react';

const useOutsideAlerter = onOutsideClick => {
  const ref = useRef();

  useEffect(() => {
    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        console.log(ref.current);
        onOutsideClick();
      }
    }

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [onOutsideClick]);

  return ref;
};

export default useOutsideAlerter;
