'use client';

import { useTranslations } from 'next-intl';

import NavLinkBtn from '@components/common/NavLinkBtn';

import { NotFoundText } from '@enums/i18nConstants';

export default function NotFound() {
  const t = useTranslations();
  return (
    <section className="min-h-fallback px- relative mx-auto flex max-w-5xl items-center pt-[22px] pb-[42px] md:pt-[62px] md:pb-[400px]">
      <div className="container">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm">
          <span className="h-2 w-2 rounded-full bg-red-600 shadow-[0_0_18px_rgba(220,38,38,0.35)]" />
          <span className="text-slate-700">{t(NotFoundText.Status)}</span>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              {t(NotFoundText.Title)}
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              {t(NotFoundText.Description)}
            </p>

            <div className="mt-8 flex flex-wrap justify-between gap-[14px]">
              <NavLinkBtn href="/" intent="accent" className="ml-0">
                {t(NotFoundText.GoHome)}
                <span className="font-inter text-primary ml-2 rounded-[32px] px-[8px] text-center text-[16px] leading-tight font-semibold transition group-hover:translate-x-0.5">
                  →
                </span>
              </NavLinkBtn>
              <div className="flex items-center gap-[16px]">
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-transparent px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-50 hover:shadow-sm focus:ring-2 focus:ring-slate-300 focus:outline-none md:w-fit md:py-[16px]"
                >
                  {t(NotFoundText.GoBack)}
                </button>

                <NavLinkBtn
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-transparent px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-50 hover:shadow-sm focus:ring-2 focus:ring-slate-300 focus:outline-none"
                  href="/contact-us"
                  intent="notFound"
                >
                  <span>Contact&nbsp;</span>us
                </NavLinkBtn>
              </div>
            </div>

            <p className="mt-10 text-xs text-slate-500">
              {t(NotFoundText.ErrorCode)}:{' '}
              <span className="font-mono text-slate-700">404</span>
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="mb-[12px]">
                <p className="text-sm font-medium text-slate-900">
                  {t(NotFoundText.QuickTipTitle)}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {t(NotFoundText.QuickTipText)}
                </p>
              </div>
              <div className="rounded-xl bg-white px-3 py-2 font-mono text-sm text-slate-700 shadow-sm">
                /404
              </div>
            </div>

            <div className="flex w-full flex-col gap-4">
              {[
                { title: t(NotFoundText.Homepage), href: '/' },
                { title: t(NotFoundText.AllProducts), href: '/all-products' },
              ].map(item => (
                <NavLinkBtn
                  key={item.href}
                  href={item.href}
                  intent="notFound"
                  className="mx-0 inline-flex w-full items-center justify-between"
                >
                  <span>{item.title}</span>
                  <span aria-hidden>→</span>
                </NavLinkBtn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
