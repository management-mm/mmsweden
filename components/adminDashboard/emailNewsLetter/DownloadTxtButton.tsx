'use client';

import type { FC } from 'react';

import { selectSelectedProducts } from '@store/selectors';

import { useAppSelector } from '@hooks/useAppSelector';

import { buildNewsletterHtml } from '@utils/newsletterTemplate';

interface IDownloadTxtButtonProps {
  dateRangeText: string;
}

const DownloadTxtButton: FC<IDownloadTxtButtonProps> = ({ dateRangeText }) => {
  const selectedProducts = useAppSelector(selectSelectedProducts);

  const handleDownload = () => {
    const html = buildNewsletterHtml(selectedProducts, dateRangeText);
    const blob = new Blob([html], {
      type: 'text/plain;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter.html.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <button
      className="bg-accent font-inter text-primary transition-boxShadow hover:shadow-accent flex w-auto items-center justify-center rounded-[32px] px-[32px] py-[12px] text-[16px] leading-tight font-semibold shadow-none duration-250 md:py-[16px]"
      onClick={handleDownload}
    >
      Download
    </button>
  );
};

export default DownloadTxtButton;
