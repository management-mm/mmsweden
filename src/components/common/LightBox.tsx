import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ReactDOM from "react-dom";
import SvgIcon from "./SvgIcon";
import NaviArrowSlider from "@components/common/NaviArrowSlider";
import useSwiperNavigation from "@hooks/useSwiperNavigation";
import { IconId } from "@enums/iconsSpriteId";
import { createRef, useEffect, useRef, useState, type FC } from "react";
import { TransformWrapper, TransformComponent, type ReactZoomPanPinchContentRef } from "react-zoom-pan-pinch";

interface ILightBoxProps {
  photos: string[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

const LightBox: FC<ILightBoxProps> = ({ photos, currentIndex, setCurrentIndex }) => {
  const { handlePrev, handleNext, onSwiperInit } = useSwiperNavigation();
  const slideRefs = useRef<React.RefObject<ReactZoomPanPinchContentRef>[]>(
    photos.map(() => createRef<ReactZoomPanPinchContentRef>())
  );
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.src = photos[currentIndex];
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
  }, [currentIndex, photos]);

  const handleZoomIn = (index: number) => {
    slideRefs.current[index]?.current?.zoomIn();
  };

  const handleZoomOut = (index: number) => {
    slideRefs.current[index]?.current?.zoomOut();
  };

  const handleResetZoom = (index: number) => {
    slideRefs.current[index]?.current?.resetTransform();
  };

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  const modalContent = (
    <div
      onClick={(e) => {
        if (e.currentTarget === e.target) setCurrentIndex(-1);
      }}
      className="overlay fixed left-0 top-0 z-20 flex h-full w-full items-center justify-center bg-[rgba(27,27,27,0.7)]"
    >
      <span className="absolute top-2 left-4 text-secondary text-[18px]">
        {currentIndex + 1} / {photos.length}
      </span>
      <div className="absolute top-0 right-0 h-[45px] flex gap-[20px] px-[20px] bg-[rgba(35,35,35,.65)]">
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
        onSwiper={onSwiperInit}
        slidesPerView={1}
        centeredSlides={true}
        spaceBetween={0}
        initialSlide={currentIndex}
        onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
        className="flex items-center justify-center"
        style={{
          width: imageDimensions.width > 0 ? `${imageDimensions.width}px` : "100%",
        }}
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
                  className="max-w-full max-h-screen object-contain"
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (index === currentIndex) {
                      const { naturalWidth, naturalHeight } = img;
                      setImageDimensions({ width: naturalWidth, height: naturalHeight });
                    }
                  }}
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
