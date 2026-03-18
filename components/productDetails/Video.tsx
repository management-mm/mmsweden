import { useTranslations } from 'next-intl';

import DecorativeLine from '@components/common/DecorativeLine';
import VideoPlayer from '@components/common/VideoPlayer';

import { Title } from '@enums/i18nConstants';

type Props = {
  video: string;
};
export default function Video({ video }: Props) {
  const t = useTranslations();
  return (
    <>
      <DecorativeLine intent="video" />
      <h2 className="text-primary mb-[22px] text-[18px] font-semibold">
        {t(Title.VideoOverview)}
      </h2>
      <VideoPlayer video={video} />
    </>
  );
}
