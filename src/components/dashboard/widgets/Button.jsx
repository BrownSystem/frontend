import React from "react";

const Button = ({ text, onClick, type }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-[var(--brown-ligth-50)] cursor-pointer border-[1px] border-[var(--brown-ligth-400)] text-[var(--brown-dark-950)] px-6 py-2 rounded hover:bg-[var(--brown-ligth-200)] w-full"
    >
      {text}
    </button>
  );
};

export default Button;
