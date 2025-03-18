import { useEffect, useState } from 'react';

const useMessageDelOrSold = (
  isDeleteOrDeletionDate: boolean | string | null
) => {
  const [isMessageOpen, setIsMessageOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsMessageOpen(Boolean(isDeleteOrDeletionDate));
  }, [isDeleteOrDeletionDate]);

  const handleToggleMenu = (): void => {
    setIsMessageOpen(prev => !prev);
  };

  return { isMessageOpen, handleToggleMenu };
};

export default useMessageDelOrSold;
