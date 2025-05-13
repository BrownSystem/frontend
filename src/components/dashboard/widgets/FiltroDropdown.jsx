import { useFiltersStore } from "../../../store/useFiltersStore";

const FiltroDropdown = ({ opciones, id }) => {
  const { filters, setFilter } = useFiltersStore();

  const manejarSeleccion = (e) => {
    setFilter(id, e.target.value);
  };

  return (
    <div className="relative w-40">
      <select
        value={filters[id] || ""}
        onChange={manejarSeleccion}
        className="w-full appearance-none px-4 py-2 text-[15px] font-medium text-[var(--brown-dark-900)] bg-[var(--brown-ligth-100)] border-[2px] border-[var(--brown-ligth-300)] rounded-md cursor-pointer focus:outline-none"
      >
        <option value="" disabled>
          Seleccionar
        </option>
        {opciones.map((opcion) => (
          <option key={opcion} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>

      {/* Flecha SVG como ícono */}
      <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2">
        <svg
          className="w-5 h-5 text-[var(--brown-dark-900)]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.292l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default FiltroDropdown;
