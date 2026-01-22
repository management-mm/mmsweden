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
      className="duration-250 flex w-auto items-center justify-center rounded-[32px] bg-accent px-[32px] py-[12px] font-inter text-[16px] font-semibold leading-tight text-primary shadow-none transition-boxShadow hover:shadow-accent md:py-[16px]"
      onClick={handleDownload}
    >
      Download
    </button>
  );
};

export default DownloadTxtButton;
