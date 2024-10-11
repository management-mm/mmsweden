import { Suspense, lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import ErrorPage from '@pages/ErrorPage';

import SharedLayout from '@components/SharedLayout';
import Loader from '@components/common/loaders/Loader';

const Home = lazy(() => import('@pages/Home'));
const AllProducts = lazy(() => import('@pages/AllProducts'));
const ProductDetails = lazy(() => import('@pages/ProductDetails'));
const AboutUs = lazy(() => import('@pages/AboutUs'));
const SellToUs = lazy(() => import('@pages/SellToUs'));
const ContactUs = lazy(() => import('@pages/ContactUs'));
const MyPriceQuote = lazy(() => import('@pages/MyPriceQuote'));
const NewArrivals = lazy(() => import('@pages/NewArrivals'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <SharedLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: '/my-price-quote',
        element: (
          <Suspense fallback={<Loader />}>
            <MyPriceQuote />
          </Suspense>
        ),
      },
      {
        path: '/all-products',
        element: (
          <Suspense fallback={<Loader />}>
            <AllProducts />
          </Suspense>
        ),
      },
      {
        path: '/all-products/:productId',
        element: (
          <Suspense fallback={<Loader />}>
            <ProductDetails />
          </Suspense>
        ),
      },
      {
        path: '/about-us',
        element: (
          <Suspense fallback={<Loader />}>
            <AboutUs />
          </Suspense>
        ),
      },
      {
        path: '/contact-us',
        element: (
          <Suspense fallback={<Loader />}>
            <ContactUs />
          </Suspense>
        ),
      },
      {
        path: '/sell-to-us',
        element: (
          <Suspense fallback={<Loader />}>
            <SellToUs />
          </Suspense>
        ),
      },
      {
        path: '/new-arrivals',
        element: (
          <Suspense fallback={<Loader />}>
            <NewArrivals />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
