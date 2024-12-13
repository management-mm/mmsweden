import { Suspense, lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import SharedLayout from '@components/SharedLayout';

const Home = lazy(() => import('@pages/Home'));
const AllProducts = lazy(() => import('@pages/AllProducts'));
const ProductDetails = lazy(() => import('@pages/ProductDetails'));
const AboutUs = lazy(() => import('@pages/AboutUs'));
const SellToUs = lazy(() => import('@pages/SellToUs'));
const ContactUs = lazy(() => import('@pages/ContactUs'));
const MyPriceQuote = lazy(() => import('@pages/MyPriceQuote'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <SharedLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense>
            <Home />
          </Suspense>
        ),
      },
      {
        path: '/my-price-quote',
        element: (
          <Suspense>
            <MyPriceQuote />
          </Suspense>
        ),
      },
      {
        path: '/all-products',
        element: (
          <Suspense>
            <AllProducts />
          </Suspense>
        ),
      },
      {
        path: '/all-products/:productId',
        element: (
          <Suspense>
            <ProductDetails />
          </Suspense>
        ),
      },
      {
        path: '/about-us',
        element: (
          <Suspense>
            <AboutUs />
          </Suspense>
        ),
      },
      {
        path: '/contact-us',
        element: (
          <Suspense>
            <ContactUs />
          </Suspense>
        ),
      },
      {
        path: '/sell-to-us',
        element: (
          <Suspense>
            <SellToUs />
          </Suspense>
        ),
      }
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
