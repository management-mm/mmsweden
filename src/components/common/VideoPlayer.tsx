import { type FC, useState } from 'react';
import ReactPlayer from 'react-player';

import SvgIcon from '@components/common/SvgIcon';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

interface IVideoPlayerProps {
  video: string;
  className?: string;
  containerIconClassName?: string;
  iconClassName?: string;
}

const youTubeGetId = (url: string) => {
  const expression =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be[.]?\/|youtube\.com[.]?\/(?:embed\/|v\/|watch\/?\?(?:\S+=\S*&)*v=))([\w-]{11})\S*$/;
  return url.match(expression) ? RegExp.$1 : '';
};

const VideoPlayer: FC<IVideoPlayerProps> = ({
  video,
  className,
  containerIconClassName,
  iconClassName,
}) => {
  const [playing, setPlaying] = useState(false);

  const videoId = youTubeGetId(video);
  const previewImage = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : '';

  return (
    <div>
      <div className={cn('h-[200px] w-full lg:h-[486px]', className)}>
        <ReactPlayer
          url={video}
          playing={playing}
          onClickPreview={() => setPlaying(true)}
          style={{ height: 0 }}
          width={'100%'}
          height={'100%'}
          light={
            <div
              style={{
                borderRadius: '4px',
                width: '100%',
                height: '100%',
                backgroundImage: `linear-gradient(0deg, rgba(5, 5, 5, 0.40) 0%, rgba(5, 5, 5, 0.40) 100%), url(${previewImage})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundColor: 'lightgray',
                backgroundPosition: '50%',
              }}
            />
          }
          playIcon={
            <div
              className={cn(
                'absolute flex h-[64px] w-[64px] items-center justify-center rounded-full border border-white bg-[rgba(252,252,252,0.6)] backdrop-blur-[1px]',
                containerIconClassName
              )}
            >
              <SvgIcon
                iconId={IconId.Play}
                size={{ width: 22, height: 22 }}
                className={cn(
                  'fill-primary py-[2px] pl-[5px] pr-[1px]',
                  iconClassName
                )}
              />
            </div>
          }
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
