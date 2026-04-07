import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SvgIcon from '@components/common/SvgIcon';
import Footer from '@components/footer/Footer';

import { IconId } from '@enums/iconsSpriteId';
import Header from './header/Header';

export default function ClientSharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-main font-inter">
      <Header />
      <main>
        {children}
        <ToastContainer
          closeButton={
            <SvgIcon
              iconId={IconId.Close}
              size={{ width: 36, height: 36 }}
              className="fill-white"
            />
          }
          icon={
            <SvgIcon
              iconId={IconId.Check}
              className="fill-white"
              size={{ width: 20, height: 20 }}
            />
          }
        />
      </main>
      <Footer />
    </div>
  );
}
