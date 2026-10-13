type ReleaseFinansIconProps = {
  className?: string;
};

const ReleaseFinansIcon = ({ className }: ReleaseFinansIconProps) => {
  return (
    <svg
      viewBox="0 0 54 46"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Release Finans"
    >
      {/* Outer white frame */}
      <rect x="1" y="1" width="54" height="42" fill="white" />

      {/* Inner dark background */}
      <rect x="5" y="5" width="44" height="34" fill="#062E49" />

      {/* White rectangles */}
      <rect x="10" y="10" width="8" height="24" fill="white" />
      <rect x="23" y="10" width="8" height="24" fill="white" />

      {/* Orange square */}
      <rect x="36" y="26" width="8" height="8" fill="#E6A039" />
    </svg>
  );
};

export default ReleaseFinansIcon;
