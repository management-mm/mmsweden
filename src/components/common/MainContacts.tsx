import SvgIcon from './SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

const MainContacts = ({}) => {
  return (
    <address className="mb-[22px] flex flex-col gap-[22px]">
      <a className="flex items-center not-italic" href="tel:+4641119900">
        <SvgIcon
          className="mr-[5px] fill-secondary"
          iconId={IconId.Phone}
          size={{ width: 16, height: 16 }}
        />
        <span className="sr-only">Phone: </span> +46 411 199 00
      </a>
      <a
        className="flex items-center not-italic"
        href="mailto:info@mmsweden.se"
      >
        <SvgIcon
          className="mr-[5px] fill-secondary"
          iconId={IconId.Email}
          size={{ width: 15, height: 15 }}
        />
        <span className="sr-only">Email: </span> info@mmsweden.se
      </a>
    </address>
  );
};

export default MainContacts;
