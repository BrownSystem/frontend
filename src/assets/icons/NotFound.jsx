import React from "react";

const NotFound = ({ size, text, sizeText, color, colorText, opacity }) => {
  return (
    <span
      className={`flex flex-col justify-center items-center text-[var(--brown-dark-700)] ${
        opacity || "opacity-[0.5]"
      } `}
    >
      <svg
        width={size || "44"}
        height={size || "44"}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color || "var(--brown-dark-700)"}
          stroke-width="1"
          stroke-linecap="round"
        />
        <path
          d="M7.88124 16.2441C8.37391 15.8174 9.02309 15.5091 9.72265 15.3072C10.4301 15.103 11.2142 15 12 15C12.7858 15 13.5699 15.103 14.2774 15.3072C14.9769 15.5091 15.6261 15.8174 16.1188 16.2441"
          stroke={color || "var(--brown-dark-700)"}
          stroke-width="1"
          stroke-linecap="round"
        />
        <circle
          cx="9"
          cy="10"
          r="1.25"
          fill={color || "var(--brown-dark-700)"}
          stroke={color || "var(--brown-dark-700)"}
          stroke-width="0.5"
          stroke-linecap="round"
        />
        <circle
          cx="15"
          cy="10"
          r="1.25"
          fill={color || "var(--brown-dark-700)"}
          stroke={color || "var(--brown-dark-700)"}
          stroke-width="0.5"
          stroke-linecap="round"
        />
      </svg>
      <span className={`${sizeText || "text-xl"} ${colorText}`}>
        {text || "Sin Resultados"}
      </span>
    </span>
  );
};

export default NotFound;
