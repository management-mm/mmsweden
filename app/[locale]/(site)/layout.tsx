import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';
import 'swiper/css/thumbs';

import ClientSharedLayout from '@components/ClientSharedLayout';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientSharedLayout>{children}</ClientSharedLayout>;
}
