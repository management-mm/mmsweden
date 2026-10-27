import type { Metadata } from 'next';

import MainWrapper from '@components/myPriceQuote/MainWrapper';

// A user-specific quote cart should not appear in search results.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

const MyPriceQuote = () => {
  return <MainWrapper />;
};

export default MyPriceQuote;
