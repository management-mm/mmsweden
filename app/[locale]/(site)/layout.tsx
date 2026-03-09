import ClientSharedLayout from '@components/ClientSharedLayout';
import 'swiper/css';
import 'swiper/css/scrollbar';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientSharedLayout>{children}</ClientSharedLayout>;
}
