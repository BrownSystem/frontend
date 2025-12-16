// VoucherAmountCard.jsx
export default function VoucherAmountCard({
  label,
  amount,
  bgColor,
  borderColor,
  textColor,
  hidden = false,
  sizeText,
}) {
  if (hidden) return null;

  return (
    <div className="flex flex-col items-start">
      <span
        className={`text-center font-semibold ${sizeText ? sizeText : " "} ${
          sizeText ? "pb-2" : " "
        }`}
      >
        {label}:
      </span>
      <p
        className={`flex flex-col ${bgColor} cursor-pointer border-[1px] ${borderColor} ${textColor} px-6 py-2 rounded w-auto font-semibold `}
      >
        ${amount?.toLocaleString("es-AR")}
      </p>
    </div>
  );
}
