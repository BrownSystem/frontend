const HideEyes = ({ size }) => {
  return (
    <svg
      width={size || "24"}
      height={size || "24"}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 11L8.42229 11.2111C10.6745 12.3373 13.3255 12.3373 15.5777 11.2111L16 11"
        stroke="var(--brown-dark-900)"
        stroke-linecap="round"
      />
      <path
        d="M12 12.5V14"
        stroke="var(--brown-dark-900)"
        stroke-linecap="round"
      />
      <path
        d="M9 12L8.5 13"
        stroke="var(--brown-dark-900)"
        stroke-linecap="round"
      />
      <path
        d="M15 12L15.5 13"
        stroke="var(--brown-dark-900)"
        stroke-linecap="round"
      />
    </svg>
  );
};

export default HideEyes;
