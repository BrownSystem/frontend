const Panel = ({ size, color }) => {
  return (
    <svg
      width={size || "24"}
      height={size || "24"}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1"
        stroke={color || "#33363F"}
        stroke-width="1.6"
        stroke-linecap="round"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1"
        stroke={color || "#33363F"}
        stroke-width="1.6"
        stroke-linecap="round"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1"
        stroke={color || "#33363F"}
        stroke-width="1.6"
        stroke-linecap="round"
      />
      <path
        d="M17.5 14.0002L17.5 21.0004"
        stroke={color || "#33363F"}
        stroke-width="1.6"
        stroke-linecap="round"
      />
      <path
        d="M21 17.5001L13.9998 17.5001"
        stroke={color || "#33363F"}
        stroke-width="1.6"
        stroke-linecap="round"
      />
    </svg>
  );
};

export default Panel;
