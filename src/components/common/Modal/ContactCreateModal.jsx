import { useState } from "react";
import { useCreateContact } from "../../../api/contacts/contacts.queries";
import Button from "../../dashboard/widgets/Button";
import { Message } from "../../dashboard/widgets";

const initialNewContact = {
  name: "",
  phone: "",
  address: "",
  branchId: "",
  // Todos los demás opcionales se agregan solo si tienen valor
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

const ContactCreateModal = ({ isOpen, onClose, tipo, onSelect, branchId }) => {
  const [newContact, setNewContact] = useState(initialNewContact);
  const [message, setMessage] = useState({ text: "", type: "success" });

  const { mutate: createContactMutate, isPending: saving } = useCreateContact({
    onSuccess: (created) => {
      onSelect(created);
      setNewContact(initialNewContact);
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
    onError: () => {
      setMessage({
        text: "Ocurrió un error al crear el contacto.",
        type: "error",
      });
    },
  });

  const saveNewContact = () => {
    const { name, phone, address, documentNumber, documentType } = newContact;

    if (!name || !phone || !address) {
      setMessage({
        text: "Nombre, Telefeno y Dirección son obligatorios.",
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

    const cleaned = sanitizeContactData(newContact, tipo, branchId);
    createContactMutate(cleaned);
  };

  if (!isOpen) return null;

  return (
    <>
      <Message
        message={message.text}
        type={message.type}
        onClose={() => setMessage({ text: "" })}
        duration={3000}
      />
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded shadow-lg max-w-xl w-full max-h-[90vh] overflow-auto p-6">
          <h2 className="text-xl font-semibold">
            Crear {tipo === "cliente" ? "Cliente" : "Proveedor"}
          </h2>
          <div className="border border-gray-300 rounded p-4 mt-4">
            <h3 className="font-semibold mb-2">
              Nuevo {tipo === "cliente" ? "Cliente" : "Proveedor"}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {/* Nombre */}
              <InputField
                label="Nombre"
                required
                value={newContact.name}
                onChange={(v) => setNewContact({ ...newContact, name: v })}
              />

              {/* Razón Social */}
              <InputField
                label="Razón Social"
                value={newContact.businessName}
                onChange={(v) =>
                  setNewContact({ ...newContact, businessName: v })
                }
              />

              {/* Tipo documento */}
              <SelectField
                label="Tipo Documento"
                value={newContact.documentType}
                options={["DNI", "CUIL", "CUIT"]}
                onChange={(v) =>
                  setNewContact({ ...newContact, documentType: v })
                }
              />

              {/* Documento */}
              <InputField
                label="Número Documento"
                value={newContact.documentNumber}
                onChange={(v) =>
                  setNewContact({ ...newContact, documentNumber: v })
                }
              />

              {/* Condición IVA */}
              <SelectField
                label="Condición IVA"
                value={newContact.ivaCondition}
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

              {/* Teléfono */}
              <InputField
                label="Teléfono "
                required
                value={newContact.phone}
                onChange={(v) => setNewContact({ ...newContact, phone: v })}
              />

              {/* Email */}
              <InputField
                label="Email"
                type="email"
                value={newContact.email}
                onChange={(v) => setNewContact({ ...newContact, email: v })}
              />

              {/* Dirección */}
              <InputField
                label="Dirección "
                required
                value={newContact.address}
                onChange={(v) => setNewContact({ ...newContact, address: v })}
              />
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={onClose}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancelar
              </button>
              <Button
                type="button"
                onClick={saveNewContact}
                text={saving ? "Guardando..." : "Guardar"}
                disabled={saving}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Componente auxiliar para inputs
const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}) => (
  <div>
    <label className="text-sm font-medium mb-1 flex gap-2">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded px-2 py-1"
    />
  </div>
);

// Componente auxiliar para selects
const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded px-2 py-1"
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
