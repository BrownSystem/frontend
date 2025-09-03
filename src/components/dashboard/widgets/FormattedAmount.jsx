const FormattedAmount = ({
  label = "",
  value = 0,
  currency = true,
  color = "var(--brown-dark-900)",
  size = "text-base",
  align = "left",
}) => {
  const formatted = new Intl.NumberFormat("es-AR", {
    style: currency ? "currency" : "decimal",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return (
    <div>
      {label}{" "}
      <span
        className={`font-[var(--font-outfit)] ${size} ${color} text-${align}`}
      >
        {formatted}
      </span>
    </div>
  );
};

export default FormattedAmount;
