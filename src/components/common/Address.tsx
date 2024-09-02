import SvgIcon from './SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

const Address = () => {
  return (
    <div className="mb-[12px] flex">
      <SvgIcon
        className="mr-[9px] fill-secondary"
        iconId={IconId.Location}
        size={{ width: 12, height: 16 }}
      />
      <address className="not-italic">
        Kronoholmsvägen 4 <br />
        27144 YSTAD, SWEDEN
      </address>
    </div>
  );
};

export default Address;
