const Button = ({
  text,
  onClick,
  type,
  Icon,
  textSize,
  disabled = false,
  width,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col px-6 py-2 rounded cursor-pointer ${
        disabled
          ? " border-[1px] border-[var(--brown-ligth-200)] text-[var(--brown-dark-950)"
          : "bg-[var(--brown-ligth-50)]  border-[1px] border-[var(--brown-ligth-400)] text-[var(--brown-dark-950)] hover:bg-[var(--brown-ligth-200)]"
      } ${width || "w-auto"} `}
    >
      {Icon}
      <p className={` ${textSize || "text-md"} `}>{text}</p>
    </button>
  );
};

export default Button;
