import { RefObject, useEffect, useRef } from 'react';

type IgnoreRef = RefObject<HTMLElement | null>;

const useOutsideAlerter = (
  onOutsideClick: () => void,
  isOpen: boolean,
  ignoreRefs: IgnoreRef[] = []
) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClick(event: MouseEvent) {
      const target = event.target as Node;

      const clickedInsideMenu = ref.current?.contains(target);

      const clickedInsideIgnoredElement = ignoreRefs.some(ignoreRef =>
        ignoreRef.current?.contains(target)
      );

      if (!clickedInsideMenu && !clickedInsideIgnoredElement) {
        onOutsideClick();
      }
    }

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [onOutsideClick, isOpen, ignoreRefs]);

  return ref;
};

export default useOutsideAlerter;
