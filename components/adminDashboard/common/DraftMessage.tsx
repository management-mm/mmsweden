import { IoIosWarning } from 'react-icons/io';

import DecorativeLine from '@components/common/DecorativeLine';

import { cn } from '@utils/cn';

export default function DraftMessage() {
  return (
    <div className="pt-[15px] lg:pl-[15px]">
      <div
        className={cn(
          'container',
          'container--no-margin bg-secondary border-secondary-accent relative flex items-center gap-[14px] rounded-[18px] border p-[18px]'
        )}
      >
        <IoIosWarning size={22} className="fill-secondary=accent" />
        <p className="font-bold uppercase">Draft product</p>
        <DecorativeLine intent="factsAndFigures" className="md:mx-0" />
        <p>This product is saved as a draft and not visible on the website</p>
      </div>
    </div>
  );
}
