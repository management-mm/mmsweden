declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-4J7Y28JHN2';

type WindowWithDataLayer = Window & {
  dataLayer: unknown[];
};

export function initGoogleAnalytics() {
  if (typeof window === 'undefined') return;

  const existingScript = document.getElementById('google-analytics-script');
  if (existingScript) return;

  const script1 = document.createElement('script');
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script1.async = true;
  script1.id = 'google-analytics-script';
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.id = 'google-analytics-inline';
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', {
      anonymize_ip: true
    });
  `;
  document.head.appendChild(script2);

  const w = window as WindowWithDataLayer;
  w.dataLayer = w.dataLayer || [];
}
