import { type FC, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import { FreeMode, Thumbs, Keyboard } from 'swiper/modules';

import LightBox from '@components/common/LightBox';
import NaviArrowSlider from '@components/common/NaviArrowSlider';
import VideoPlayer from '@components/common/VideoPlayer';

import useSwiperNavigation from '@hooks/useSwiperNavigation';

interface ISliderProps {
  photos: string[];
  video: string;
  alt: string;
}

const Slider: FC<ISliderProps> = ({ photos, video, alt }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);
  const { handlePrev, handleNext, onSwiperInit } = useSwiperNavigation();
  const [currentIndex, setCurrentIndex] = useState(-1);

  return (
    <div className="">
      <div className="mb-[32px]">
        <Swiper
          keyboard={{
            enabled: true,
            onlyInViewport: false
          }}
          onSwiper={onSwiperInit}
          slidesPerView={1}
          spaceBetween={0}
          thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
          modules={[FreeMode, Thumbs, Keyboard]}
          className="mySwiper2"
        >
          {photos.map((photo, index) => {
            return (
              <SwiperSlide key={photo} className="rounded-[4px]">
                <img
                  className="screen-none rounded-[4px] lg:w-[754px]"
                  src={photo}
                  alt={alt}
                  width={'100%'}
                  onClick={() => setCurrentIndex(index)}
                />
              </SwiperSlide>
            );
          })}
          {video && (
            <SwiperSlide>
              <VideoPlayer
                video={video}
                className="h-[248px] w-[330px] md:h-[306px] md:w-[408px] lg:h-[566px] lg:w-[754px]"
              />
            </SwiperSlide>
          )}

          <NaviArrowSlider
            intent="details"
            className="left-[8px]"
            iconClassName="fill-secondary"
            onClick={handlePrev}
            iconId={'ArrowLeft'}
          />
          <NaviArrowSlider
            intent="details"
            iconClassName="fill-secondary"
            className="right-[8px]"
            onClick={handleNext}
            iconId={'ArrowRight'}
          />
        </Swiper>

        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Thumbs]}
          className="mySwiper"
        >
          {photos.map(photo => {
            return (
              <SwiperSlide key={photo}>
                <img
                  src={photo}
                  alt={alt}
                  width={98}
                  className="screen-none rounded-[2px]"
                />
              </SwiperSlide>
            );
          })}
          {video && (
            <SwiperSlide>
              <div className="relative">
                <div className="pointer-events-auto absolute z-[1] h-full w-full bg-transparent" />
                <VideoPlayer
                  video={video}
                  className="h-[73px] w-[98px] lg:h-[73px]"
                  containerIconClassName="w-[30px] h-[30px]"
                  iconClassName="w-[15px] h-[15px]"
                />
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
      {currentIndex !== -1 && (
        <LightBox
          photos={photos}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      )}
    </div>
  );
};

export default Slider;
