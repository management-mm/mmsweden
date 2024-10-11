import { ThreeDots } from 'react-loader-spinner';

const Loader = () => {
  return (
    <div className="h-[100vh] w-full">
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="rgba(0, 32, 59, 1)"
        ariaLabel="three-dots-loading"
        visible={true}
        wrapperStyle={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%,-50%)',
          zIndex: '5',
        }}
      />
    </div>
  );
};

export default Loader;
