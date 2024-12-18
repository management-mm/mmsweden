import { useEffect, useRef } from 'react';

const useOutsideAlerter = (onOutsideClick: () => void, isOpen: boolean) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        isOpen &&
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        console.log(ref.current);
        onOutsideClick();
      }
    }

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [onOutsideClick, isOpen]);

  return ref;
};

export default useOutsideAlerter;
