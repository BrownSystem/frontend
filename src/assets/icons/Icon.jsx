import React from "react";

export const StockIcon = ({ type }) => {
  if (type === "low") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="red"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.75 3a.75.75 0 10-1.5 0v10.25H9.14c-2.28 0-3.57 2.62-2.18 4.43l2.86 3.72c1.1 1.43 3.26 1.43 4.36 0l2.86-3.72c1.39-1.81.1-4.43-2.18-4.43H12.75V3z"
        />
      </svg>
    );
  }

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="#00a63e"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.18 3.6c-1.1-1.43-3.26-1.43-4.36 0L6.96 7.32C5.56 9.13 6.85 11.75 9.14 11.75h2.11v10.25a.75.75 0 001.5 0V11.75h2.11c2.29 0 3.58-2.62 2.18-4.43L14.18 3.6z"
      />
    </svg>
  );
};

export const EditIcon = ({ children }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="#bd8535"
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
);
