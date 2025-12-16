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
  branchId,
  showBothContacts = false,
}) => {
  const { data: branches = [] } = useFindAllBranch();

  // Estados
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactType, setContactType] = useState(null);
  const [selectedClientName, setSelectedClientName] = useState("");
  const [selectedSupplierName, setSelectedSupplierName] = useState("");

  return (
    <div className="p-4 rounded-lg">
      {setContactId && (contact || showBothContacts) && (
        <ContactCreateModal
          isOpen={showContactModal}
          branchId={branchId}
          onClose={() => setShowContactModal(false)}
          tipo={contactType || contact}
          editContact={false}
          onSelect={(selected) => {
            if (contactType === "cliente") {
              setSelectedClientName(selected?.name);
              setContactId((prev) => ({
                ...prev,
                clienteId: selected?.id || "",
              }));
            } else {
              setSelectedSupplierName(selected?.name);
              setContactId((prev) => ({
                ...prev,
                proveedorId: selected?.id || "",
              }));
            }
            setShowContactModal(false);
          }}
        />
      )}

      <div className="grid grid-cols-2 gap-1 relative">
        {/* Fechas */}
        {setDateFrom && (
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
        )}

        {/* Sucursal + contactos */}
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

          {/* Si muestra ambos contactos */}
          {showBothContacts ? (
            <>
              {/* Cliente */}
              <div className="w-full">
                <label className="block text-sm">Cliente</label>
                <div className="flex gap-2 relative">
                  <input
                    type="text"
                    value={selectedClientName || ""}
                    readOnly
                    placeholder="Seleccionar cliente..."
                    className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                  />
                  <span className="absolute flex right-2 top-5 transform -translate-y-1/2 cursor-pointer">
                    {selectedClientName && (
                      <button
                        onClick={() => {
                          setSelectedClientName("");
                          setContactId((prev) => ({
                            ...prev,
                            clienteId: "",
                          }));
                        }}
                      >
                        <Delete />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setContactType("cliente");
                        setShowContactModal(true);
                      }}
                      className="cursor-pointer"
                    >
                      <PeopleTick color="#292828" size="24" />
                    </button>
                  </span>
                </div>
              </div>

              {/* Proveedor */}
              <div className="w-full">
                <label className="block text-sm">Proveedor</label>
                <div className="flex gap-2 relative">
                  <input
                    type="text"
                    value={selectedSupplierName || ""}
                    readOnly
                    placeholder="Seleccionar proveedor..."
                    className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                  />
                  <span className="absolute flex right-2 top-5 transform -translate-y-1/2 cursor-pointer">
                    {selectedSupplierName && (
                      <button
                        onClick={() => {
                          setSelectedSupplierName("");
                          setContactId((prev) => ({
                            ...prev,
                            proveedorId: "",
                          }));
                        }}
                      >
                        <Delete />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setContactType("proveedor");
                        setShowContactModal(true);
                      }}
                      className="cursor-pointer"
                    >
                      <PeopleTick color="#292828" size="24" />
                    </button>
                  </span>
                </div>
              </div>
            </>
          ) : (
            // Si solo hay un tipo de contacto
            setContactId &&
            contact && (
              <div className="w-full">
                <label className="block text-sm">
                  {contact === "proveedor" ? "Proveedor" : "Cliente"}
                </label>
                <div className="flex gap-2 relative ">
                  <input
                    type="text"
                    value={
                      contact === "proveedor"
                        ? selectedSupplierName
                        : selectedClientName
                    }
                    readOnly
                    className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                    placeholder={`Seleccionar ${
                      contact === "proveedor" ? "proveedor" : "cliente"
                    }...`}
                  />
                  <span className="absolute flex right-2 top-5 transform -translate-y-1/2 cursor-pointer">
                    {(contact === "proveedor"
                      ? selectedSupplierName
                      : selectedClientName) && (
                      <button
                        onClick={() => {
                          if (contact === "proveedor") {
                            setSelectedSupplierName("");
                            setContactId("");
                          } else {
                            setSelectedClientName("");
                            setContactId("");
                          }
                        }}
                      >
                        <Delete />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setContactType(contact);
                        setShowContactModal(true);
                      }}
                      className="cursor-pointer"
                    >
                      <PeopleTick color="#292828" size="24" />
                    </button>
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
