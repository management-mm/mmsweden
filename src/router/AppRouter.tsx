import { Suspense, lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import EmailNewsletter from '@pages/EmailNewsletter';
import ErrorPage from '@pages/ErrorPage';

import AdminSharedLayout from '@components/AdminSharedLayout';
import { PrivateRoute } from '@components/PrivateRoute';
import { RestrictedRoute } from '@components/RestrictedRoute';
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
const Login = lazy(() => import('@pages/Login'));
const NewProduct = lazy(() => import('@pages/NewProduct'));
const EditProduct = lazy(() => import('@pages/EditProduct'));
const FiltersSettings = lazy(() => import('@pages/FiltersSettings'));
const Settings = lazy(() => import('@pages/Settings'));

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
  {
    path: '/admin',
    element: (
      <PrivateRoute redirectTo="/login" component={<AdminSharedLayout />} />
    ),
    children: [
      {
        path: 'all-products',
        element: (
          <Suspense fallback={<Loader />}>
            <AllProducts />
          </Suspense>
        ),
      },
      {
        path: 'new-product',
        element: (
          <Suspense fallback={<Loader />}>
            <NewProduct />
          </Suspense>
        ),
      },
      {
        path: 'filters-settings',
        element: (
          <Suspense fallback={<Loader />}>
            <FiltersSettings />
          </Suspense>
        ),
      },
      {
        path: 'email-newsletter',
        element: (
          <Suspense fallback={<Loader />}>
            <EmailNewsletter />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<Loader />}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: 'all-products/edit-product/:productId',
        element: (
          <Suspense fallback={<Loader />}>
            <EditProduct />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: (
      <RestrictedRoute
        redirectTo="/admin/all-products"
        component={
          <Suspense fallback={<Loader />}>
            <Login />
          </Suspense>
        }
      />
    ),
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
