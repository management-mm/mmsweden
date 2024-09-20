import type { IconId } from '@enums/iconsSpriteId';

export interface ISocialMediaItem {
  iconId: keyof typeof IconId;
  iconSize: { width: number; height: number };
  href: string;
  title: string;
}
const socialMediaList: ISocialMediaItem[] = [
  {
    iconId: 'Facebook',
    iconSize: { width: 16, height: 16 },
    href: '',
    title: 'Facebook',
  },
  {
    iconId: 'Linkedin',
    iconSize: { width: 16, height: 18 },
    href: '',
    title: 'LinkedIn',
  },
  {
    iconId: 'Youtube',
    iconSize: { width: 17, height: 12 },
    href: '',
    title: 'Youtube',
  },
];

export default socialMediaList;
