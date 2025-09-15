import { useState } from "react";
import { useFindAllBranch } from "../../../api/branch/branch.queries";
import { ContactCreateModal } from "../../common";
import { Delete, PeopleTick } from "../../../assets/icons";

const FilterPanel = ({
  contact,
  dateFrom,
  setDateFrom,
  dateUntil,
  setDateUntil,
  setContactId,
  setBranch,
}) => {
  const { data: branches = [] } = useFindAllBranch();

  // Estado para manejar el modal de contacto
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedContactName, setSelectedContactName] = useState("");

  return (
    <div className="p-4 rounded-lg">
      {/* Modal de selección de contacto */}
      <ContactCreateModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        tipo={contact} // o SUPPLIER según necesites
        editContact={false}
        onSelect={(contact) => {
          setContactId(contact?.id); // Guarda el id del contacto en el filtro
          setSelectedContactName(contact?.name); // Muestra el nombre en el input
          setShowContactModal(false); // Cierra el modal
        }}
      />

      <div className="grid grid-cols-2 gap-1 relative">
        {/* Fechas */}
        <div className="col-span-2 flex w-full justify-center gap-2 bg-[var(--brown-ligth-100)] p-5 rounded-md">
          <div className="w-full">
            <label className="block text-sm">Fecha desde</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm">Fecha hasta</label>
            <input
              type="date"
              value={dateUntil}
              onChange={(e) => setDateUntil(e.target.value)}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
            />
          </div>
        </div>

        {/* Cliente y sucursal */}
        <div className="col-span-2 flex w-full justify-center gap-2 bg-[var(--brown-ligth-100)] p-5 rounded-md">
          <div className="w-full">
            <label className="block text-sm">Sucursal</label>
            <select
              onChange={(e) => setBranch(e.target.value)}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
            >
              <option value="">Seleccionar sucursal</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.name}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label className="block text-sm">
              {contact === "proveedor" ? "Proveedor" : "Cliente"}
            </label>
            <div className="flex gap-2 relative ">
              <input
                type="text"
                value={selectedContactName || ""}
                readOnly
                className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                placeholder="Seleccionar cliente..."
              />
              <span className="absolute flex right-2 top-5 transform -translate-y-1/2 cursor-pointer">
                {selectedContactName && (
                  <button
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedContactName("");
                      setContactId("");
                    }}
                  >
                    <Delete />
                  </button>
                )}
                <button
                  className="cursor-pointer"
                  onClick={() => setShowContactModal(true)}
                >
                  <PeopleTick color="#292828" size="24" />
                </button>
              </span>
            </div>
          </div>
        </div>

        {/* Montos */}
        {/* <div className="col-span-2 flex w-full justify-center gap-2 bg-[var(--brown-ligth-100)] p-5 rounded-md">
          <div className="w-full">
            <label className="block text-sm">Monto mínimo</label>
            <input
              type="number"
              value={montoMin}
              onChange={(e) => setMontoMin(e.target.value)}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm">Monto máximo</label>
            <input
              type="number"
              value={montoMax}
              onChange={(e) => setMontoMax(e.target.value)}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
            />
          </div>
        </div> */}
      </div>

      {/* Botón limpiar
      <div className="flex justify-end mt-4 gap-2">
        <button
          onClick={limpiarFiltros}
          className="px-4 py-2 border rounded-md bg-gray-200 hover:bg-gray-300"
        >
          Limpiar
        </button>
      </div> */}
    </div>
  );
};

export default FilterPanel;
