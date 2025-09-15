const CloseModal = ({ size }) => {
  return (
    <svg
      width={size || "24"}
      height={size || "24"}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 0.5H14C15.933 0.5 17.5 2.067 17.5 4V14C17.5 15.933 15.933 17.5 14 17.5H4C2.067 17.5 0.5 15.933 0.5 14V4C0.5 2.067 2.067 0.5 4 0.5Z"
        fill="#2A4157"
        fill-opacity="0.24"
        stroke="#222222"
        strokeWidth="1.5"
      />
      <path
        d="M6.00009 11.9997L12.0001 5.99966"
        stroke="#222222"
        strokeWidth="1.5"
      />
      <path d="M12 12L6 6" stroke="#222222" strokeWidth="1.5" />
    </svg>
  );
};

export default CloseModal;
