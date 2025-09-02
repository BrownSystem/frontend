const Cheque = ({ colorLight, colorDark, size }) => {
  return (
    <svg
      width={size || "24"}
      height={size || "24"}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fondo con opacidad */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.58579 6.58579C3 7.17157 3 8.11438 3 10V14C3 15.8856 3 16.8284 3.58579 17.4142C4.17157 18 5.11438 18 7 18H17C18.8856 18 19.8284 18 20.4142 17.4142C21 16.8284 21 15.8856 21 14V10C21 8.11438 21 7.17157 20.4142 6.58579C19.8284 6 18.8856 6 17 6H7C5.11438 6 4.17157 6 3.58579 6.58579Z"
        fill={colorLight || "#7E869E"}
        fillOpacity="0.25"
      />
      {/* Contorno */}
      <rect
        x="3"
        y="6"
        width="18"
        height="12"
        rx="2"
        stroke={colorDark || "#222222"}
        strokeWidth="1.2"
      />
      {/* Línea de firma */}
      <path
        d="M6 14H12"
        stroke={colorDark || "#222222"}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Cuadro para monto */}
      <rect
        x="14.5"
        y="10.5"
        width="3"
        height="2"
        rx="0.4"
        stroke={colorDark || "#222222"}
        strokeWidth="1.2"
      />
      {/* Firma (curva simple) */}
      <path
        d="M6 11C6.8 11.5 7.5 11 8.5 10.5"
        stroke={colorDark || "#222222"}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Cheque;
