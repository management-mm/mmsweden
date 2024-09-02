import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import Footer from './footer/Footer';
import Header from './header/Header';

const SharedLayout = () => {
  return (
    <div className="bg-main font-inter">
      <Header />
      <main>
        <Suspense>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default SharedLayout;
