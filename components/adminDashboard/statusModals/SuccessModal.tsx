import type { FC } from 'react';

import Link from 'next/link';

import StatusModal from '@components/common/StatusModal';

interface ISuccessModalProps {
  mainMessage: string;
  handleToggleMenu: () => void;
  statusProduct: 'added' | 'updated';
  linkProduct: string;
}

const SuccessModal: FC<ISuccessModalProps> = ({
  mainMessage,
  handleToggleMenu,
  statusProduct,
  linkProduct,
}) => {
  return (
    <StatusModal title={mainMessage} handleToggleMenu={handleToggleMenu}>
      <div className="flex w-full gap-[10px]">
        <Link
          className="border-primary text-primary w-[calc((100%-10px)/2)] rounded-[32px] border py-[10px] text-center font-semibold"
          href={linkProduct}
        >
          {`Go to ${statusProduct} product`}
        </Link>

        <Link
          className="border-primary text-primary w-[calc((100%-10px)/2)] rounded-[32px] border py-[10px] text-center font-semibold"
          href="/admin/all-products"
        >
          Go to Product List
        </Link>
      </div>
    </StatusModal>
  );
};

export default SuccessModal;
