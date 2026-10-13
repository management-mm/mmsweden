import { useLocale, useTranslations } from 'next-intl';

import ReleaseFinansIcon from '@components/icons/ReleaseFinansIcon';

const ReleaseFinansSection = () => {
  const t = useTranslations('ReleaseFinans');
  const locale = useLocale();

  const titleAccent = (chunks: React.ReactNode) => (
    <span
      className={`font-extrabold text-[#E9A02D] italic [-webkit-text-stroke:0.1px_#8B5A2B] ${locale === 'en' ? 'inline' : 'block w-fit'} `}
    >
      {chunks}
    </span>
  );

  const titleEnd = (chunks: React.ReactNode) => (
    <span className="inline-block whitespace-nowrap">
      {chunks}
      <span
        aria-hidden="true"
        className="ml-[2px] inline-block size-[0.11em] bg-[#E9A02D]"
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

      <div
        aria-hidden="true"
        className="grid grid-cols-7 gap-x-[4px] gap-y-[3px] text-[12px] leading-none font-normal text-white"
      >
        {'RELEASE'.split('').map((letter, index) => (
          <span key={`release-${index}`} className="text-center">
            {letter}
          </span>
        ))}

        {'FINANS'.split('').map((letter, index) => (
          <span key={`finans-${index}`} className="text-center">
            {letter}
          </span>
        ))}
      </div>
    </a>
  );

  return (
    <section className="py-8 md:py-16">
      <div className="container">
        {/* Mobile */}
        <div className="overflow-hidden rounded-[4px] md:hidden">
          {/* Image with title */}
          <div
            className="relative h-[210px] bg-cover bg-[position:15%_center] sm:h-[250px]"
            style={{
              backgroundImage: "url('/images/home/release-finans.webp')",
            }}
          >
            <h2 className="absolute top-5 left-5 z-10 w-fit max-w-[65%] text-left text-[clamp(22px,6vw,30px)] leading-[1.05] font-light text-[#072F49]">
              {t.rich('Title', {
                accent: titleAccent,
                end: titleEnd,
                break: () => <br />,
              })}
            </h2>
          </div>

          {/* Description and logo */}
          <div className="flex flex-col items-end gap-6 bg-[#062E49] px-5 py-7 text-right">
            <p className="max-w-[310px] text-[15px] leading-[1.5] text-white">
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
            <h2 className="w-fit max-w-[45%] min-w-0 text-left text-[clamp(18px,2.2vw,32px)] leading-[1.05] font-light text-[#072F49]">
              {t.rich('Title', {
                accent: titleAccent,
                end: titleEnd,
                break: () => <br />,
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
