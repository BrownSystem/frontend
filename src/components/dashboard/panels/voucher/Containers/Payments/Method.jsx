const Method = ({
  icon,
  label,
  selected,
  onClick,
  quotas,
  type,
  holderName,
}) => {
  return (
    <div
      onClick={onClick}
      className={`px-4 py-2 rounded-xl shadow-sm flex items-center justify-between gap-4 font-[var(--font-outfit)] mb-2 w-full cursor-pointer transition
        ${
          selected
            ? "bg-[var(--brown-ligth-300)] ring-2 ring-[var(--brown-dark-600)]"
            : "bg-[var(--brown-ligth-200)] hover:bg-[var(--brown-ligth-300)]"
        }`}
    >
      <div className="flex gap-4 justify-center items-center">
        <div className="bg-[var(--brown-ligth-400)] p-2 rounded-full">
          {icon}
        </div>
        <div>
          <h3 className="text-[14px] font-medium text-[var(--brown-dark-900)]">
            {label} {type ? `(${type})` : null}
            {holderName ? (
              <p className="text-xs text-[var(--brown-dark-700)] font-normal">
                <span className="text-[var(--brown-dark-800)]">Titular: </span>
                {`${holderName}`}
              </p>
            ) : null}
            {quotas ? (
              <p className="text-xs text-[var(--brown-dark-700)] font-normal">{`En ${quotas} Cuotas`}</p>
            ) : null}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Method;
