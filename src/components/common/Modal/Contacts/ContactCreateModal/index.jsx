import { useState } from "react";
import { Button, Message } from "../../../../dashboard/widgets";
import ContactForm from "./ContactForm";
import ContactList from "./ContactList";
import { CreateUser, Tick } from "../../../../../assets/icons";
import { useMessageStore } from "../../../../../store/useMessage";

const ContactCreateModal = ({
  isOpen,
  onClose,
  editContact = true,
  tipo,
  onSelect,
  branchId,
  mode = "crear",
}) => {
  const typeLabels = {
    cliente: {
      singular: "Cliente",
      plural: "Clientes",
    },
    proveedor: {
      singular: "Proveedor",
      plural: "Proveedores",
    },
    vendedor: {
      singular: "Vendedor",
      plural: "Vendedores",
    },
  };

  const [selectedContact, setSelectedContact] = useState(null);
  const { setMessage } = useMessageStore();

  const [viewMode, setViewMode] = useState(mode);
  const [search, setSearch] = useState("");

  const handlerListContact = () => {
    if (viewMode === "crear") setViewMode("editar");
    else {
      setViewMode("crear");
      setSelectedContact(null);
    }
  };

  const toggleView = () => {
    setViewMode(viewMode === "crear" ? "editar" : "crear");
    setSelectedContact(null);
  };

  const handleConfirmSelection = () => {
    if (selectedContact) {
      onSelect(selectedContact);

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
        <div className="bg-[var(--brown-ligth-100)] rounded shadow-lg max-w-xl w-full max-h-[90vh]  p-6">
          <h2 className="text-sm font-sans font-semibold text-[var(--brown-dark-950)]">
            {viewMode === "crear"
              ? `Crear ${typeLabels[tipo]?.singular || "Contacto"}`
              : `Lista de ${typeLabels[tipo]?.plural || "Contactos"}`}
          </h2>

          <div className="py-4">
            {viewMode === "crear" ? (
              <div className="flex flex-col gap-2">
                {/* Buscador */}
                <div className="w-full">
                  <input
                    type="text"
                    placeholder={`Buscar ${
                      typeLabels[tipo]?.singular || "Contacto"
                    }...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--brown-ligth-400)] rounded-md bg-[var(--brown-ligth-50)] focus:outline-none focus:ring-2 focus:ring-[var(--brown-dark-600)]"
                  />
                </div>
                <ContactList
                  onSelect={(contact) => {
                    if (selectedContact?.id === contact?.id) {
                      // nada
                    } else {
                      setSelectedContact(contact);
                    }
                  }}
                  debouncedSearch={search}
                  editContact={editContact}
                  selectedContact={selectedContact}
                  branchId={branchId}
                  tipo={tipo}
                  setSelectedContact={setSelectedContact}
                  setMessage={setMessage}
                />
                <div className="mt-4 flex justify-end gap-2">
                  <Button type="button" onClick={onClose} text={"Cerrar"} />
                  {editContact && (
                    <Button
                      type="button"
                      Icon={<CreateUser color={"var(--brown-dark-900)"} />}
                      onClick={handlerListContact}
                    />
                  )}
                  <Button
                    type="button"
                    Icon={<Tick />}
                    onClick={handleConfirmSelection}
                  />
                </div>
              </div>
            ) : (
              <ContactForm
                toggleView={toggleView}
                tipo={tipo}
                branchId={branchId}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactCreateModal;
