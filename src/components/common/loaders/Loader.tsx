import { ThreeDots } from 'react-loader-spinner';

const Loader = () => {
  return (
    <div className="z-5 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="rgba(0, 32, 59, 1)"
        ariaLabel="three-dots-loading"
        visible={true}
      />
    </div>
  );
};

export default Loader;
