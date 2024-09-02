import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

import socialMediaList from '@constants/socialMediaList';

const SocialMediaList = () => {
  return (
    <ul className="relative flex items-center justify-evenly py-[22px]">
      {socialMediaList.map(socialMedia => {
        const { iconId, iconSize, href, title } = socialMedia;
        return (
          <li key={iconId}>
            <a href={href}>
              <SvgIcon
                className="fill-secondary"
                iconId={IconId[iconId]}
                size={iconSize}
              />
              <span className="hidden">{title}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SocialMediaList;
