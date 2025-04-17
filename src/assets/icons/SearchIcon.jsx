import React from "react";

const SearchIcon = ({ color }) => {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="11" r="6" stroke={color} stroke-width="1.5"></circle>
      <path
        d="M11 8C10.606 8 10.2159 8.0776 9.85195 8.22836C9.48797 8.37913 9.15726 8.6001 8.87868 8.87868C8.6001 9.15726 8.37913 9.48797 8.22836 9.85195C8.0776 10.2159 8 10.606 8 11"
        stroke={color}
        stroke-opacity="0.24"
        stroke-width="1"
        stroke-linecap="round"
      ></path>
      <path
        d="M20 20L17 17"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
      ></path>
    </svg>
  );
};

export default SearchIcon;
