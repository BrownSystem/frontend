const EntryCard = ({ icon, method, mount }) => {
  return (
    <div className="bg-[var(--brown-ligth-100)] px-4 py-2 rounded-xl shadow-sm flex items-center justify-between gap-4 w-full max-w-sm font-[var(--font-outfit)] mb-2">
      <div className="flex gap-4">
        {/* Ícono */}
        <div className="bg-[var(--brown-ligth-300)] p-2 rounded-full">
          {icon}
        </div>

        {/* Texto */}
        <div>
          <h3 className="text-xs font-medium text-[var(--brown-dark-700)]">
            {method}
          </h3>
          <p className="text-md font-bold text-[var(--brown-dark-900)]">
            {mount}
          </p>
        </div>
      </div>
      <div className="pr-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="20"
          viewBox="0 0 64 32"
          fill="none"
          stroke="var(--text-state-green)"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M2 28 L12 12 L24 20 L36 6 L48 18 L60 18" />
        </svg>
      </div>
    </div>
  );
};

export default EntryCard;
