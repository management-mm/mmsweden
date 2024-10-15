import React, { type ReactNode, createContext, useState } from 'react';

import Loader from '@components/common/loaders/Loader';

type LoaderContext = {
  showLoader: (message: string) => void;
  hideLoader: () => void;
};

type LoaderContextProvider = {
  children: ReactNode;
};

export const LoaderContext = createContext<LoaderContext | undefined>(
  undefined
);

export const LoaderProvider: React.FC<LoaderContextProvider> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const contextValue: LoaderContext = {
    showLoader: () => {
      setIsVisible(true);
    },
    hideLoader: () => {
      setIsVisible(false);
    },
  };

  return (
    <LoaderContext.Provider value={contextValue}>
      {isVisible && <Loader />}
      {children}
    </LoaderContext.Provider>
  );
};
