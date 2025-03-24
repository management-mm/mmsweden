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
    href: 'https://www.facebook.com/www.mmsweden.se/',
    title: 'Facebook',
  },
  {
    iconId: 'Linkedin',
    iconSize: { width: 16, height: 18 },
    href: 'https://www.linkedin.com/company/meat-machines-sweden-ab',
    title: 'LinkedIn',
  },
  {
    iconId: 'Youtube',
    iconSize: { width: 17, height: 12 },
    href: 'https://www.youtube.com/@meatmachinesswedenab6915',
    title: 'Youtube',
  },
];

export default socialMediaList;
