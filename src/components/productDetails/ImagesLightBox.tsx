import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const ImagesLightBox = ({ images, isOpen, setIsOpen }) => {
  return (
    <Lightbox
      open={isOpen}
      close={() => setIsOpen(false)}
      slides={images.map(image => {
        return { src: image };
      })}
    />
  );
};

export default ImagesLightBox;
