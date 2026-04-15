import type { Metadata } from 'next';

import type { AppLocale } from '@i18n/config';
import { createPageMetadata } from '@i18n/seo';

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return createPageMetadata({
    locale,
    path: '/privacy-policy',
    title: 'Privacy Policy | Meat Machines',
    description:
      'Read the privacy policy for Meat Machines and learn how we handle analytics, cookies, and personal data.',
  });
}

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-sm leading-6 text-gray-800">
      <h1 className="mb-6 text-3xl font-semibold">Privacy Policy</h1>

      <p className="mb-4">
        This website respects your privacy and is committed to protecting your
        personal data. This privacy policy explains how we handle your data when
        you visit our website.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">
        1. Information We Collect
      </h2>
      <p className="mb-4">
        We do not collect personal data directly. However, we use analytics
        tools that may collect anonymized information about how users interact
        with our website.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">
        2. Use of Google Analytics
      </h2>
      <p className="mb-4">
        We use Google Analytics, a web analytics service provided by Google, to
        understand how visitors use our website and improve user experience.
      </p>

      <p className="mb-4">Google Analytics may collect information such as:</p>

      <ul className="mb-4 list-disc pl-6">
        <li>Pages visited</li>
        <li>Time spent on the website</li>
        <li>Device and browser information</li>
        <li>Approximate geographic location</li>
      </ul>

      <p className="mb-4">
        We have enabled IP anonymization where possible to reduce the level of
        personal data collected.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">3. Consent</h2>
      <p className="mb-4">
        We only load Google Analytics after you have given your consent via the
        cookie banner. You can accept or reject analytics tracking when visiting
        the website.
      </p>

      <p className="mb-4">
        Your choice is stored in your browser using local storage.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">
        4. Cookies and Local Storage
      </h2>
      <p className="mb-4">
        This website uses local storage and cookies for essential functionality
        and analytics purposes (only with your consent).
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">5. Your Rights</h2>
      <p className="mb-4">
        Under the General Data Protection Regulation (GDPR), you have the right
        to:
      </p>

      <ul className="mb-4 list-disc pl-6">
        <li>Access your data</li>
        <li>Request deletion of your data</li>
        <li>Withdraw your consent at any time</li>
      </ul>

      <h2 className="mt-8 mb-2 text-xl font-semibold">6. Contact</h2>
      <p className="mb-4">
        If you have any questions about this privacy policy, you can contact us
        at:
      </p>

      <p className="mb-4">Email: home@mmsweden.se</p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">
        7. Changes to This Policy
      </h2>
      <p>
        We may update this privacy policy from time to time. Any changes will be
        posted on this page.
      </p>
    </main>
  );
}
