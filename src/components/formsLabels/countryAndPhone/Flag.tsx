const Flag = ({ name, flag }) => {
  return (
    <div className="relative z-0 mr-[4px] h-[20px] w-[20px] shrink-0">
      <img
        src={flag}
        alt={`Flag of ${name}`}
        className="absolute left-1/2 top-1/2 z-[1] h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 transform rounded-full border border-white object-cover"
      />
      <div className="absolute left-1/2 top-1/2 z-0 h-[20px] w-[20px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-[#999999]" />
    </div>
  );
};

export default Flag;
