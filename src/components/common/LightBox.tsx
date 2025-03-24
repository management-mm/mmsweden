import { type FC, createRef, useRef } from 'react';
import ReactDOM from 'react-dom';
import {
  type ReactZoomPanPinchContentRef,
  TransformComponent,
  TransformWrapper,
} from 'react-zoom-pan-pinch';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

import SvgIcon from './SvgIcon';

import NaviArrowSlider from '@components/common/NaviArrowSlider';

import useSwiperNavigation from '@hooks/useSwiperNavigation';

import { IconId } from '@enums/iconsSpriteId';

interface ILightBoxProps {
  photos: string[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

const LightBox: FC<ILightBoxProps> = ({
  photos,
  currentIndex,
  setCurrentIndex,
}) => {
  const { handlePrev, handleNext, onSwiperInit } = useSwiperNavigation();
  const slideRefs = useRef<React.RefObject<ReactZoomPanPinchContentRef>[]>(
    photos.map(() => createRef<ReactZoomPanPinchContentRef>())
  );

  const handleZoomIn = (index: number) => {
    slideRefs.current[index]?.current?.zoomIn();
  };

  const handleZoomOut = (index: number) => {
    slideRefs.current[index]?.current?.zoomOut();
  };

  const handleResetZoom = (index: number) => {
    slideRefs.current[index]?.current?.resetTransform();
  };

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  const modalContent = (
    <div
      onClick={e => {
        if (
          e.currentTarget === e.target ||
          (e.target instanceof HTMLElement &&
            e.target.classList.contains('swiper-slide'))
        )
          setCurrentIndex(-1);
      }}
      className="overlay fixed left-0 top-0 z-30 flex h-full w-full items-center justify-center bg-[rgba(27,27,27,0.7)]"
    >
      <span className="absolute left-4 top-2 text-[18px] text-secondary">
        {currentIndex + 1} / {photos.length}
      </span>
      <div className="absolute right-0 top-0 flex h-[45px] gap-[20px] bg-[rgba(35,35,35,.65)] px-[20px]">
        <button onClick={() => handleZoomIn(currentIndex)}>
          <SvgIcon
            className="fill-secondary"
            iconId={IconId.ZoomIn}
            size={{ width: 26, height: 26 }}
          />
        </button>
        <button onClick={() => handleZoomOut(currentIndex)}>
          <SvgIcon
            className="fill-secondary"
            iconId={IconId.ZoomOut}
            size={{ width: 26, height: 26 }}
          />
        </button>
        <button onClick={() => handleResetZoom(currentIndex)}>
          <SvgIcon
            className="fill-secondary"
            iconId={IconId.ZoomReset}
            size={{ width: 26, height: 26 }}
          />
        </button>
        <button onClick={() => setCurrentIndex(-1)}>
          <SvgIcon
            iconId={IconId.Close}
            size={{ width: 26, height: 26 }}
            className="fill-secondary"
          />
        </button>
      </div>

      <Swiper
        className="lightbox-swiper"
        onSwiper={onSwiperInit}
        slidesPerView={1}
        centeredSlides={true}
        spaceBetween={0}
        initialSlide={currentIndex}
        onSlideChange={swiper => setCurrentIndex(swiper.activeIndex)}
        simulateTouch={false}
        touchStartPreventDefault={false}
      >
        {photos.map((photo, index) => (
          <SwiperSlide key={`photo-${index}`}>
            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={5}
              centerOnInit
              ref={slideRefs.current[index]}
            >
              <TransformComponent>
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="max-h-screen max-w-full object-contain lg:w-[1000px]"
                />
              </TransformComponent>
            </TransformWrapper>
          </SwiperSlide>
        ))}
      </Swiper>

      <NaviArrowSlider
        intent="details"
        className="left-[20px]"
        iconClassName="fill-secondary"
        onClick={handlePrev}
        iconId="ArrowLeft"
      />
      <NaviArrowSlider
        intent="details"
        className="right-[20px]"
        iconClassName="fill-secondary"
        onClick={handleNext}
        iconId="ArrowRight"
      />
    </div>
  );

  return ReactDOM.createPortal(modalContent, modalRoot);
};

export default LightBox;
