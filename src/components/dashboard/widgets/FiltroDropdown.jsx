import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useFiltersStore } from "../../../store/useFiltersStore";

const FiltroDropdown = ({ opciones, id }) => {
  const [abierto, setAbierto] = useState(false);
  const { filters, setFilter } = useFiltersStore();

  const manejarSeleccion = (opcion) => {
    setFilter(id, opcion);
    setAbierto(false);
  };

  return (
    <div className="relative text-[15px] font-medium">
      <div
        onClick={() => setAbierto(!abierto)}
        className="flex items-center justify-between w-40 px-4 py-2 bg-[#fcf5e9] border-[2px] border-[#f5e6c9] rounded-md text-[#4d2e11] cursor-pointer"
      >
        {filters[id] || "Filtrar"}
        <FaChevronDown className="ml-2 text-[#4d2e11] text-sm" />
      </div>
      {abierto && (
        <div className="fixed  w-40 bg-white border border-[#f5e6c9] rounded-md shadow-lg">
          {opciones.map((opcion) => (
            <div
              key={opcion}
              className="px-4 py-2 hover:bg-[#fdf0d9] text-[#4d2e11] cursor-pointer"
              onClick={() => manejarSeleccion(opcion)}
            >
              {opcion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FiltroDropdown;
