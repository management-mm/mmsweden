'use client';

import { useEffect, useState } from 'react';

import SvgIcon from './SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={handleClick}
      className="bg-secondary fixed right-6 bottom-6 z-50 cursor-pointer rounded-full p-3 shadow-lg transition"
    >
      <SvgIcon
        iconId={IconId.ArrowTop}
        size={{ width: 16, height: 16 }}
        className="fill-primary"
      />
    </button>
  );
}
