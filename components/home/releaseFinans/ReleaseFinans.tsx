import { ReactNode } from 'react';

import { useTranslations } from 'next-intl';

import ReleaseFinansIcon from '@components/icons/ReleaseFinansIcon';

const ReleaseFinansSection = () => {
  const t = useTranslations('ReleaseFinans');

  const titleAccent = (chunks: ReactNode) => (
    <span className="block w-fit font-extrabold text-[#E9A02D] italic [-webkit-text-stroke:0.1px_#8B5A2B]">
      {chunks}
    </span>
  );

  const titleEnd = (chunks: ReactNode) => (
    <span className="whitespace-nowrap">
      {chunks}
      <span
        aria-hidden="true"
        className="ml-[2px] inline-block size-[0.12em] bg-[#E9A02D]"
      />
    </span>
  );

  const descriptionAccent = (chunks: React.ReactNode) => (
    <span className="font-extrabold text-[#E9A02D] italic">{chunks}</span>
  );

  const logo = (
    <a
      href="https://www.releasefinans.se/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visit Release Finans website"
      className="group flex w-fit items-center gap-[8px] transition-opacity duration-200 hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
    >
      <ReleaseFinansIcon className="h-[38px] w-auto shrink-0" />

      <div className="flex flex-col gap-[3px] text-white">
        <span className="text-[12px] leading-none tracking-[0.3em]">
          RELEASE
        </span>

        <span className="text-[12px] leading-none tracking-[0.45em]">
          FINANS
        </span>
      </div>
    </a>
  );

  return (
    <section className="py-8 md:py-16">
      <div className="container">
        {/* Mobile */}
        <div className="overflow-hidden rounded-[4px] md:hidden">
          <div
            className="relative h-[190px] bg-cover bg-[position:15%_center]"
            style={{
              backgroundImage: "url('/images/home/release-finans.webp')",
            }}
          >
            <h2 className="absolute top-5 left-5 z-10 w-fit max-w-[65%] text-left text-[clamp(22px,6vw,30px)] leading-[1.05] font-light text-[#072F49]">
              {t.rich('Title', {
                accent: titleAccent,
                end: titleEnd,
              })}
            </h2>
          </div>

          <div className="flex flex-col items-end gap-5 bg-[#062E49] px-6 py-6 text-right">
            <p className="text-[16px] leading-[1.4] text-white">
              {t.rich('Description', {
                accent: descriptionAccent,
              })}
            </p>

            {logo}
          </div>
        </div>

        {/* Desktop */}
        <div
          className="relative hidden aspect-[6/1] w-full overflow-hidden md:block"
          style={{
            backgroundImage: "url('/images/home/release-finans.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-between px-[3%]">
            <h2 className="w-fit max-w-[40%] min-w-0 text-left text-[clamp(18px,2.2vw,32px)] leading-[1.05] font-light text-[#072F49]">
              {t.rich('Title', {
                accent: titleAccent,
                end: titleEnd,
              })}
            </h2>

            <div className="flex h-full max-w-[48%] flex-col items-end justify-center gap-[12%] text-right">
              <p className="text-[clamp(9px,1.5vw,21px)] leading-[1.3] tracking-wide text-white">
                {t.rich('Description', {
                  accent: descriptionAccent,
                })}
              </p>

              {logo}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReleaseFinansSection;
