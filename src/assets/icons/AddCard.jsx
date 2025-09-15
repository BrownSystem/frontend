import React from "react";

const AddCard = ({ size }) => {
  return (
    <svg
      width={size || "24"}
      height={size || "24"}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 10C3 8.11438 3 7.17157 3.58579 6.58579C4.17157 6 5.11438 6 7 6H17C18.8856 6 19.8284 6 20.4142 6.58579C21 7.17157 21 8.11438 21 10V14C21 15.8856 21 16.8284 20.4142 17.4142C19.8284 18 18.8856 18 17 18H7C5.11438 18 4.17157 18 3.58579 17.4142C3 16.8284 3 15.8856 3 14V10Z"
        fill="#888c97"
      />
      <circle cx="6" cy="15" r="1" fill="#222222" />
      <rect x="3" y="9" width="18" height="2" fill="#222222" />
      <circle
        cx="20"
        cy="17"
        r="2.75"
        fill="#2A4157"
        fill-opacity="0.24"
        stroke="#222222"
        stroke-width="0.5"
      />
      <path
        d="M20 18L20 16"
        stroke="#222222"
        stroke-width="0.5"
        stroke-linecap="square"
      />
      <path
        d="M21 17L19 17"
        stroke="#222222"
        stroke-width="0.5"
        stroke-linecap="square"
      />
    </svg>
  );
};

export default AddCard;
