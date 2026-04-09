'use client';

import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import BaseProviders from './BaseProviders';

import SessionExpiredModal from '@components/adminDashboard/statusModals/SessionExpiredModal';
import AppToastContainer from '@components/common/AppToastContainer';

import { persistor } from '@store/store';

import type { AppLocale } from '@i18n/config';

type Props = {
  children: React.ReactNode;
  locale: AppLocale;
};

function AdminPersist({ children }: { children: React.ReactNode }) {
  if (!persistor) {
    return <>{children}</>;
  }

  return <PersistGate persistor={persistor}>{children}</PersistGate>;
}

function AdminAppContent({ children }: { children: React.ReactNode }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <SessionExpiredModal />
      <AdminPersist>{children}</AdminPersist>
      <AppToastContainer />
    </LocalizationProvider>
  );
}

export default function AdminProviders({ children, locale }: Props) {
  return (
    <BaseProviders locale={locale}>
      <AdminAppContent>{children}</AdminAppContent>
    </BaseProviders>
  );
}
