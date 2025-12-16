import { useEffect, useState } from "react";
import { Button, Message } from "../../../../dashboard/widgets";
import CreditNoteList from "./CreditNoteList";
import { InvoiceIcon, Tick } from "../../../../../assets/icons";
import { useMessageStore } from "../../../../../store/useMessage";

const CreditNoteModal = ({ isOpen, onClose, tipo, onSelect, branchId }) => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const { setMessage } = useMessageStore();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  const handleConfirmSelection = () => {
    if (selectedInvoice) {
      onSelect(selectedInvoice);

      onClose(); // opcional: cierra el modal después de seleccionar
    } else {
      setMessage({
        text: "Debes seleccionar un contacto antes de confirmar",
        type: "error",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-[var(--brown-ligth-100)] rounded shadow-lg max-w-xl w-full max-h-[90vh] overflow-auto p-6">
          <div className="flex gap-4 items-center mb-4 border-b-[1px] px-4 pb-2 border-[var(--brown-ligth-200)]">
            <div className="bg-[var(--brown-ligth-300)] p-2 rounded-full">
              <InvoiceIcon size={36} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--brown-dark-900)]">
                COMPROBANTES
              </h3>
              <p className="text-[14px] text-[var(--brown-dark-700)] font-normal">
                Debes seleccionar para vincular
              </p>
            </div>
          </div>

          <div className="py-2">
            <div className="flex flex-col gap-2">
              {/* Buscador */}
              <div className="w-full">
                <input
                  type="text"
                  placeholder={`Buscar ${
                    tipo === "NOTA_CREDITO_CLIENTE" ? "P de ventas" : "Facturas"
                  }...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--brown-ligth-400)] rounded-md bg-[var(--brown-ligth-50)] focus:outline-none focus:ring-2 focus:ring-[var(--brown-dark-600)]"
                />
              </div>
              <CreditNoteList
                onSelect={(invoice) => {
                  if (selectedInvoice?.id === invoice?.id) {
                  } else {
                    setSelectedInvoice(invoice);
                  }
                }}
                debouncedSearch={debouncedSearch}
                selectedInvoice={selectedInvoice}
                branchId={branchId}
                tipo={tipo}
                setSelectedInvoice={setSelectedInvoice}
                setMessage={setMessage}
              />
              <div className="mt-4 flex justify-end gap-2">
                <Button type="button" onClick={onClose} text={"Cerrar"} />
                <Button
                  type="button"
                  Icon={<Tick />}
                  onClick={handleConfirmSelection}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreditNoteModal;
