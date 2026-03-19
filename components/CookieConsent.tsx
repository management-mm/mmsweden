'use client';

import { useEffect, useState } from 'react';

import { initGoogleAnalytics } from '@lib/analytics';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button, Description, Title } from '@enums/i18nConstants';

const CONSENT_KEY = 'cookie-consent';

type ConsentStatus = 'accepted' | 'rejected' | null;

export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentStatus>(null);
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    try {
      const savedConsent = localStorage.getItem(CONSENT_KEY);

      if (savedConsent === 'accepted') {
        initGoogleAnalytics();
        setConsent('accepted');
      } else if (savedConsent === 'rejected') {
        setConsent('rejected');
      } else {
        setConsent(null);
      }
    } catch {
      setConsent(null);
    } finally {
      setIsMounted(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'accepted');
      initGoogleAnalytics();
      setConsent('accepted');
    } catch {
      setConsent('accepted');
    }
  };

  const handleReject = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'rejected');
      setConsent('rejected');
    } catch {
      setConsent('rejected');
    }
  };

  if (!isMounted || consent !== null) return null;

  return (
    <div
      className="fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-4 shadow-xl"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      aria-modal="false"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-gray-700">
          <p id="cookie-consent-title" className="font-medium text-gray-900">
            {t(Title.AnalyticsСonsent)}
          </p>
          <p id="cookie-consent-description" className="mt-1">
            {t(Description.AnalyticsConsent)}{' '}
            <Link
              href="/privacy-policy"
              className="underline hover:no-underline"
            >
              {t(Description.PrivacyPolicy)}
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleReject}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            {t(Button.Reject)}
          </button>

          <button
            type="button"
            onClick={handleAccept}
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            {t(Button.Accept)}
          </button>
        </div>
      </div>
    </div>
  );
}
