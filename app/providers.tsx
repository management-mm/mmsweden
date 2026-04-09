// 'use client';

// import React, { createContext, useEffect } from 'react';
// import { HelmetProvider } from 'react-helmet-async';
// import { Provider as ReduxProvider } from 'react-redux';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// import CookieConsent from '@components/CookieConsent';
// import SessionExpiredModal from '@components/adminDashboard/statusModals/SessionExpiredModal';
// import ScrollToTopButton from '@components/common/ScrollToTopButton';
// import SvgIcon from '@components/common/SvgIcon';

// import { setupApiInterceptors } from '@store/api';
// import { store } from '@store/store';

// import { useScrollToTop } from '@hooks/useScrollToTop';

// import { IconId } from '@enums/iconsSpriteId';

// import type { AppLocale } from '@i18n/config';

// type Props = {
//   children: React.ReactNode;
//   locale: AppLocale;
// };

// export const LocaleContext = createContext<AppLocale>('en');

// let interceptorsInitialized = false;

// function AppContent({ children }: { children: React.ReactNode }) {
//   useScrollToTop();

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <HelmetProvider>
//         <SessionExpiredModal />
//         <CookieConsent />
//         <ScrollToTopButton />

//         {children}

//         <ToastContainer
//           closeButton={
//             <SvgIcon
//               iconId={IconId.Close}
//               size={{ width: 36, height: 36 }}
//               className="fill-white"
//             />
//           }
//           icon={({ type }) => {
//             if (type === 'success') {
//               return (
//                 <SvgIcon
//                   iconId={IconId.Check}
//                   className="fill-white"
//                   size={{ width: 20, height: 20 }}
//                 />
//               );
//             }

//             return null;
//           }}
//         />
//       </HelmetProvider>
//     </LocalizationProvider>
//   );
// }

// export default function Providers({ children, locale }: Props) {
//   useEffect(() => {
//     if (interceptorsInitialized) return;

//     setupApiInterceptors(store);
//     interceptorsInitialized = true;
//   }, []);

//   return (
//     <LocaleContext.Provider value={locale}>
//       <ReduxProvider store={store}>
//         <AppContent>{children}</AppContent>
//       </ReduxProvider>
//     </LocaleContext.Provider>
//   );
// }
