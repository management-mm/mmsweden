import SvgIcon from './SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

const ViewOnMap = () => {
  return (
    <a
      className="flex items-center"
      href="https://www.google.se/maps/place/Meat-Machines+Sweden+AB/@55.4260945,13.8006665,17z/data=!4m6!3m5!1s0x46547d62fb9eeee3:0xa5ec82544e6af4ba!8m2!3d55.4259784!4d13.800955!16s%2Fg%2F1hc1q7h0c?entry=ttu&g_ep=EgoyMDI0MDgyNy4wIKXMDSoASAFQAw%3D%3D"
    >
      <span className="mr-[12px]">View On Map</span>
      <SvgIcon
        className="fill-secondary"
        iconId={IconId.ArrowRight}
        size={{ width: 8, height: 14 }}
      />
    </a>
  );
};

export default ViewOnMap;
