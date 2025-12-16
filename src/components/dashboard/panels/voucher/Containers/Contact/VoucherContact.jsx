const VoucherContact = ({ icon, title, text }) => {
  return (
    <div className="bg-[var(--brown-ligth-100)] p-3 rounded-xl shadow-sm flex gap-4 font-[var(--font-outfit)] w-full">
      {/* Ícono */}
      <div className="bg-[var(--brown-ligth-300)] p-2 rounded-full shrink-0 flex justify-center items-center">
        {icon}
      </div>

      {/* Texto */}
      <div className="flex-1 leading-tight">
        <h3 className="text-xs font-medium text-[var(--brown-dark-700)]">
          {title}
        </h3>
        <p className="text-sm font-bold text-[var(--brown-dark-900)] break-words">
          {text}
        </p>
      </div>
    </div>
  );
};

export default VoucherContact;
