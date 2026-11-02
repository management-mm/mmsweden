import { useTranslations } from 'next-intl';

import DecorativeLine from '@components/common/DecorativeLine';
import SvgIcon from '@components/common/SvgIcon';

import { Title } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

/**
 * Reserve the same outer geometry as LatestArrivalsCarousel while the
 * product API response is streamed into the homepage Suspense boundary.
 * Without this fallback, an entire ~700px section is inserted above
 * the footer after the initial HTML has already been painted.
 *
 * The real carousel and its behaviour are deliberately unchanged.
 */
export default function LatestArrivalsFallback() {
  const t = useTranslations();

  return (
    <section
      className="text-primary pt-[48px] pb-[96px]"
      aria-busy="true"
      aria-label={t(Title.LatestArrivals)}
    >
      <div className="container">
        <div className="relative mb-[22px] flex items-end justify-between">
          <h2 className="shrink-0 text-[18px] font-semibold md:text-[24px] md:leading-[0.8]">
            {t(Title.LatestArrivals)}
          </h2>

          <DecorativeLine intent="latestArrivals" />

          <div aria-hidden="true" className="flex gap-[12px]">
            <span className="border-line flex h-[44px] w-[44px] items-center justify-center rounded-full border">
              <SvgIcon
                className="fill-primary"
                iconId={IconId.ArrowLeft}
                size={{ width: 13, height: 18 }}
              />
            </span>
            <span className="border-line flex h-[44px] w-[44px] items-center justify-center rounded-full border">
              <SvgIcon
                className="fill-primary"
                iconId={IconId.ArrowRight}
                size={{ width: 13, height: 18 }}
              />
            </span>
          </div>
        </div>

        {/* ProductCard: 504px; swiper-wrapper: 25px bottom margin. */}
        <div
          aria-hidden="true"
          className="mb-[25px] h-[504px] overflow-hidden"
          style={{ width: 'calc(49% + 50vw)' }}
        >
          <div className="border-secondary h-[504px] w-[296px] max-w-full rounded-[8px] border bg-white pb-[20px] shadow-sm md:w-[264px]">
            <div className="h-[218px] w-full rounded-t-[4px] bg-slate-100" />
            <div className="space-y-[12px] px-[14px] pt-[12px]">
              <div className="h-[16px] w-2/3 rounded bg-slate-100" />
              <div className="h-[16px] w-5/6 rounded bg-slate-100" />
              <div className="h-[12px] w-1/2 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
