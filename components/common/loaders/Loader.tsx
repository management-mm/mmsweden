const Loader = () => {
  return (
    <div
      className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
      role="status"
      aria-label="Loading"
    >
      <div className="h-20 w-20 animate-pulse rounded-full bg-[#00203B]" />
    </div>
  );
};

export default Loader;
