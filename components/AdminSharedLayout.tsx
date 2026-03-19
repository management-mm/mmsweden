import { ToastContainer } from 'react-toastify';


import Sidebar from './adminDashboard/Sidebar';
import Topbar from './adminDashboard/Topbar';
import SvgIcon from './common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

export default function AdminSharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-main font-inter">

      <main className="pb-[120px] lg:flex">
        <Sidebar />

        <div>
          <Topbar />
          {children}
        </div>

        <ToastContainer
          closeButton={
            <SvgIcon
              iconId={IconId.Close}
              size={{ width: 14, height: 14 }}
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
    </div>
  );
}
