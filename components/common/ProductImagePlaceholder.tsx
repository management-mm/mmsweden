import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import { NoImage } from '@enums/i18nConstants';

type PlaceholderVariant = 'thumbnail' | 'card' | 'gallery';

type Props = {
  className?: string;
  variant?: PlaceholderVariant;
  /** Backwards-compatible with the previous placeholder component. */
  compact?: boolean;
};

export default function ProductImagePlaceholder({
  className,
  variant,
  compact = false,
}: Props) {
  const size = variant ?? (compact ? 'card' : 'gallery');
  const t = useTranslations();
  const isThumbnail = size === 'thumbnail';
  const isGallery = size === 'gallery';

  return (
    <div
      role="img"
      aria-label={t(NoImage.Title)}
      className={clsx(
        'text-primary relative isolate flex w-full items-center justify-center overflow-hidden',
        'bg-[linear-gradient(135deg,#F8FBFE_0%,#EAF1F8_58%,#DDEAF6_100%)]',
        isThumbnail && 'h-full min-h-0 rounded-[10px]',
        size === 'card' && 'h-[218px] rounded-t-[4px]',
        isGallery &&
          'aspect-[4/3] min-h-[270px] rounded-[8px] md:min-h-[380px]',
        className
      )}
    >
      <div className="relative flex min-w-0 flex-col items-center justify-center px-3 text-center">
        <div
          className={clsx(
            'border-secondary-accent/15 text-secondary-accent flex shrink-0 items-center justify-center rounded-xl border bg-white/65',
            isThumbnail && 'h-10 w-10 rounded-lg',
            size === 'card' && 'h-12 w-12',
            isGallery && 'h-16 w-16'
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={clsx(isThumbnail ? 'h-[22px] w-[22px]' : 'h-7 w-7')}
          >
            <rect x="3" y="3.5" width="18" height="17" rx="2.5" />
            <circle cx="8.5" cy="9" r="1.5" />
            <path d="m4 17 5-5 3.5 3.5 2-2L20 19" />
            <path d="M5 21 20 4" />
          </svg>
        </div>

        {!isThumbnail && (
          <>
            <span
              className={clsx(
                'text-primary mt-3 font-semibold tracking-[0.01em]',
                isGallery ? 'text-base md:text-lg' : 'text-[13px]'
              )}
            >
              {t(NoImage.Title)}
            </span>
            {isGallery && (
              <span className="text-desc mt-2 max-w-[300px] text-sm leading-5">
                {t(NoImage.Details)}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
