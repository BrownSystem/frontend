import { useEffect, useState } from "react";
import {
  useCreateContact,
  useSearchContacts,
  useUpdateContact,
} from "../../../api/contacts/contacts.queries";
import Button from "../../dashboard/widgets/Button";
import { Message } from "../../dashboard/widgets";
import {
  ArrowDown,
  CreateUser,
  Delete,
  ProfileMan,
  Tick,
} from "../../../assets/icons";
import ContactList from "./ContactList";
import { useMessageStore } from "../../../../../store/useMessage";

const initialNewContact = {
  name: "",
  phone: "",
  address: "",
  branchId: "",
  ivaCondition: "CONSUMIDOR_FINAL",
};

const sanitizeContactData = (contact, tipo, branchId) => {
  return Object.fromEntries(
    Object.entries({
      ...contact,
      type: tipo === "cliente" ? "CLIENT" : "SUPPLIER",
      available: true,
      branchId,
    }).filter(
      ([_, value]) => value !== "" && value !== null && value !== undefined
    )
  );
};

const ContactCreateModal = ({
  isOpen,
  onClose,
  tipo,
  onSelect,
  branchId,
  mode = "crear",
}) => {
  const [newContact, setNewContact] = useState(initialNewContact);
  const [selectedContact, setSelectedContact] = useState(null);
  const [viewMode, setViewMode] = useState(mode);
  const { setMessage } = useMessageStore();

  const { mutate: createContactMutate, isPending: saving } = useCreateContact({
    onSuccess: (created) => {
      onSelect(created);
      setNewContact(initialNewContact);
      setSelectedContact(null);
      setMessage({
        text: `${
          tipo === "cliente" ? "Cliente" : "Proveedor"
        } creado exitosamente`,
        type: "success",
      });
      setTimeout(() => {
        setMessage({ text: "" });
        onClose();
      }, 2000);
    },
    onError: (err) =>
      setMessage({
        text: `No se pudo crear el contacto. Intenta Nuevamente`,
        type: "error",
      }),
  });

  const handlerListContact = () => {
    if (viewMode === "crear") setViewMode("editar");
    else {
      setViewMode("crear");
      setSelectedContact(null);
    }
  };

  const saveNewContact = () => {
    const contactToSave = selectedContact || newContact;
    const { name, phone, address, documentNumber, documentType } =
      contactToSave;

    if (!name || !phone || !address) {
      setMessage({
        text: "Nombre, Teléfono y Dirección son obligatorios.",
        type: "error",
      });
      return;
    }

    if (documentNumber) {
      const dniRegex = /^\d{7,8}$/;
      const cuitCuilRegex = /^\d{2}-\d{8}-\d{1}$/;
      if (
        (documentType === "DNI" && !dniRegex.test(documentNumber)) ||
        ((documentType === "CUIT" || documentType === "CUIL") &&
          !cuitCuilRegex.test(documentNumber))
      ) {
        setMessage({
          text:
            documentType === "DNI"
              ? "El DNI debe tener 7 u 8 dígitos sin guiones."
              : "El CUIT/CUIL debe tener el formato XX-XXXXXXXX-X.",
          type: "error",
        });
        return;
      }
    }

    const cleaned = sanitizeContactData(contactToSave, tipo, branchId);
    createContactMutate(cleaned);
  };

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-[var(--brown-ligth-100)] rounded shadow-lg max-w-xl w-full max-h-[90vh] overflow-auto p-6">
          <h2 className="text-sm font-sans font-semibold text-[var(--brown-dark-950)]">
            {viewMode === "crear"
              ? `Crear ${tipo === "cliente" ? "Cliente" : "Proveedor"}`
              : `Lista de ${tipo === "cliente" ? "Clientes" : "Proveedores"}`}
          </h2>

          <div className="py-4">
            {viewMode === "crear" ? (
              <div className="flex flex-col gap-2">
                {/* Buscador */}
                <div className="w-full">
                  <input
                    type="text"
                    placeholder={`Buscar ${tipo}...`}
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
                  debouncedSearch={debouncedSearch}
                  selectedContact={selectedContact}
                  branchId={branchId}
                  tipo={tipo}
                  setSelectedContact={setSelectedContact}
                  setMessage={setMessage}
                />
                <div className="mt-4 flex justify-end gap-2">
                  <Button type="button" onClick={onClose} text={"Cerrar"} />
                  <Button
                    type="button"
                    Icon={<CreateUser color={"var(--brown-dark-900)"} />}
                    onClick={handlerListContact}
                  />
                  <Button type="button" Icon={<Tick />} />
                </div>
              </div>
            ) : (
              <>
                {/* Formulario de creación */}
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Nombre"
                    required
                    value={newContact.name}
                    onChange={(v) => setNewContact({ ...newContact, name: v })}
                  />
                  <InputField
                    label="Razón Social"
                    value={newContact.businessName}
                    onChange={(v) =>
                      setNewContact({ ...newContact, businessName: v })
                    }
                  />
                  <SelectField
                    label="Tipo Documento"
                    value={newContact.documentType}
                    options={["DNI", "CUIL", "CUIT"]}
                    onChange={(v) =>
                      setNewContact({ ...newContact, documentType: v })
                    }
                  />
                  <InputField
                    label="Número Documento"
                    value={newContact.documentNumber}
                    onChange={(v) =>
                      setNewContact({ ...newContact, documentNumber: v })
                    }
                  />
                  <SelectField
                    label="Condición IVA"
                    value={newContact.ivaCondition || "CONSUMIDOR_FINAL"}
                    options={[
                      "RESPONSABLE_INSCRIPTO",
                      "MONOTRIBUTISTA",
                      "EXENTO",
                      "CONSUMIDOR_FINAL",
                      "SUJETO_NO_CATEGORIZADO",
                      "PROVEEDOR_DEL_EXTERIOR",
                      "CLIENTE_DEL_EXTERIOR",
                      "IVA_LIBERADO_LEY_19640",
                      "IVA_NO_ALCANZADO",
                    ]}
                    onChange={(v) =>
                      setNewContact({ ...newContact, ivaCondition: v })
                    }
                  />
                  <InputField
                    label="Teléfono"
                    required
                    value={newContact.phone}
                    onChange={(v) => setNewContact({ ...newContact, phone: v })}
                  />
                  <InputField
                    label="Email"
                    type="email"
                    value={newContact.email}
                    onChange={(v) => setNewContact({ ...newContact, email: v })}
                  />
                  <InputField
                    label="Dirección"
                    required
                    value={newContact.address}
                    onChange={(v) =>
                      setNewContact({ ...newContact, address: v })
                    }
                  />
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <Button
                    type="button"
                    onClick={saveNewContact}
                    text={saving ? "Guardando..." : "Guardar"}
                    disabled={saving}
                  />
                  <Button
                    type="button"
                    onClick={handlerListContact}
                    text="Ver Lista"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}) => (
  <div>
    <label className="text-xs font-medium mb-1 flex gap-2 ">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-[var(--brown-ligth-400)] rounded px-2 py-1 bg-[var(--brown-ligth-50)]"
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-xs font-medium mb-1">{label}</label>
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-[var(--brown-ligth-400)] rounded px-2 py-1 bg-[var(--brown-ligth-50)]"
    >
      <option value="">Seleccionar</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt.replaceAll("_", " ")}
        </option>
      ))}
    </select>
  </div>
);

export default ContactCreateModal;
