import 'swiper/css';
import 'swiper/css/scrollbar';

import ClientSharedLayout from '@components/ClientSharedLayout';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientSharedLayout>{children}</ClientSharedLayout>;
}
