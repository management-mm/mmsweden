import SvgIcon from './SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

const WorkingHours = () => {
  return (
    <div className="mb-[22px] flex">
      <SvgIcon
        className="mr-[9px] fill-secondary"
        iconId={IconId.Clock}
        size={{ width: 18, height: 18 }}
      />
      <p>
        Working hours: <br /> Mon-Fri{' '}
        <span className="font-semibold">09:00 - 17:00</span>
      </p>
    </div>
  );
};

export default WorkingHours;
