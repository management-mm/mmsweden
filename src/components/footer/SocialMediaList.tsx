import SvgIcon from '@components/common/SvgIcon';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

import socialMediaList from '@constants/socialMediaList';
import type { FC } from 'react';

interface ISocialMediaListProps {
  className?: string;
  showTitle?: boolean;
}

const SocialMediaList:FC<ISocialMediaListProps> = ({ className, showTitle }) => {
  return (
    <ul
      className={cn(
        'relative flex items-center justify-evenly py-[22px]',
        className
      )}
    >
      {socialMediaList.map(socialMedia => {
        const { iconId, iconSize, href, title } = socialMedia;
        return (
          <li key={iconId}>
            <a href={href} className="flex items-center gap-[9px]">
              <SvgIcon
                className="fill-secondary"
                iconId={IconId[iconId]}
                size={iconSize}
              />
              <span className={cn('', showTitle ? 'block' : 'hidden')}>
                {title}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SocialMediaList;
