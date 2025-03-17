import { type Dispatch, type FC, type SetStateAction } from 'react';

import StatusModal from '@components/common/StatusModal';

import useMessageDelOrSold from '@hooks/useMessageDelOrSold';

interface IMessageDeleteOrSoldProps {
  title: string;
  isDeleteOrDeletionDate: boolean | string | null;
  setIsDeleteOrDeletionDate: Dispatch<SetStateAction<boolean | string | null>>;
}

const MessageDeleteOrSold: FC<IMessageDeleteOrSoldProps> = ({
  title,
  isDeleteOrDeletionDate,
  setIsDeleteOrDeletionDate,
}) => {
 
  
  const { isMessageOpen, handleToggleMenu } = useMessageDelOrSold(
    isDeleteOrDeletionDate
  );


  return (
    <>
      {isMessageOpen && (
        <StatusModal title={title} handleToggleMenu={handleToggleMenu}>
          <div className="flex w-full gap-[10px]">
            <button
              onClick={() => {
                handleToggleMenu();
              }}
              className={
                'w-[calc((100%-10px)/2)] rounded-[32px] border border-red-900 py-[10px] text-center font-semibold text-red-900'
              }
            >
              Yes
            </button>
            <button
              onClick={() => {
                setIsDeleteOrDeletionDate(false);
              }}
              className={
                'w-[calc((100%-10px)/2)] rounded-[32px] bg-red-900 py-[10px] text-center font-semibold text-secondary'
              }
            >
              No
            </button>
          </div>
        </StatusModal>
      )}
    </>
  );
};

export default MessageDeleteOrSold;
