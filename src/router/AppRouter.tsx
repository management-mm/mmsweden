import { lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import SharedLayout from '@components/SharedLayout';

const Home = lazy(() => import('@pages/Home'));
const AllProducts = lazy(() => import('@pages/AllProducts'));
const ProductDetails = lazy(() => import('@pages/ProductDetails'));
const AboutUs = lazy(() => import('@pages/AboutUs'));
const SellToUs = lazy(() => import('@pages/SellToUs'));
const ContactUs = lazy(() => import('@pages/ContactUs'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <SharedLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/all-products',
        element: <AllProducts />,
        children: [
          {
            path: ':productId',
            element: <ProductDetails />,
          },
        ],
      },
      {
        path: '/about-us',
        element: <AboutUs />,
      },
      {
        path: '/contact-us',
        element: <ContactUs />,
      },
      {
        path: '/sell-to-us',
        element: <SellToUs />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
