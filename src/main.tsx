import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';

import App from './App.tsx';
import './i18n';
import './index.css';

import { persistor, store } from '@store/store.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </LocalizationProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
