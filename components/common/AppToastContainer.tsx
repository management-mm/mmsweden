'use client';

import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

export default function AppToastContainer() {
  return (
    <ToastContainer
      closeButton={
        <SvgIcon
          iconId={IconId.Close}
          size={{ width: 36, height: 36 }}
          className="fill-white"
        />
      }
      icon={({ type }) => {
        if (type === 'success') {
          return (
            <SvgIcon
              iconId={IconId.Check}
              className="fill-white"
              size={{ width: 20, height: 20 }}
            />
          );
        }

        return null;
      }}
    />
  );
}
