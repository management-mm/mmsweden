import { type FC, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Swiper, SwiperSlide } from 'swiper/react';

import type { MultiLanguageString } from '@interfaces/IProduct';
import 'swiper/css';

import LightBox from '../LightBox';
import NaviArrowSlider from '../NaviArrowSlider';

import useSwiperNavigation from '@hooks/useSwiperNavigation';

import { cn } from '@utils/cn';
import getProductName from '@utils/getProductName';

import type { LanguageKeys } from '@enums/languageKeys';

interface IProductImageProps {
  isLoading: boolean;
  photos: string[];
  name: MultiLanguageString | string;
  language: LanguageKeys;
}

const ProductImage: FC<IProductImageProps> = ({
  isLoading,
  photos,
  name,
  language,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { handlePrev, handleNext, onSwiperInit } = useSwiperNavigation();
  const [currentIndex, setCurrentIndex] = useState(-1);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isLoading ? (
        photos.length !== 0 ? (
          <>
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                isHovered ? 'z-10 opacity-100' : 'z-0 opacity-0'
              }`}
            >
              <Swiper
                onSwiper={onSwiperInit}
                slidesPerView={1}
                spaceBetween={0}
                className="mySwiper2 h-[218px]"
              >
                {photos.map(photo => (
                  <SwiperSlide
                    key={photo}
                    className={cn('select-none rounded-[4px]', 'photo-slide')}
                  >
                    <img
                      className="h-[218px] rounded-[4px] object-cover"
                      src={photo}
                      width={'100%'}
                      height={218}
                      alt="Image"
                      onClick={() => setCurrentIndex(0)}
                    />
                  </SwiperSlide>
                ))}
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
            </div>
            <img
              className={`h-[218px] w-full select-none rounded-t-[4px] object-cover transition-opacity duration-300 ${
                isHovered ? 'opacity-0' : 'opacity-100'
              }`}
              src={photos[0]}
              alt={name ? getProductName(name, language) : ''}
            />
          </>
        ) : (
          <div className="h-[200px] w-full rounded-t-[4px] bg-slate-500" />
        )
      ) : (
        <Skeleton
          height={200}
          duration={1.2}
          containerClassName="block leading-[1]"
        />
      )}
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

export default ProductImage;
