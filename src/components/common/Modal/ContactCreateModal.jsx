import { useState } from "react";
import { useCreateContact } from "../../../api/contacts/contacts.queries";
import Button from "../../dashboard/widgets/Button";
import { Message } from "../../dashboard/widgets";

const initialNewContact = {
  name: "",
  businessName: "",
  documentType: "DNI",
  documentNumber: "",
  ivaCondition: "RESPONSABLE_INSCRIPTO",
  phone: "",
  email: "",
  address: "",
  branchId: "",
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
      }, 2000); // 2 segundos
    },
    onError: () => {
      setMessage({
        text: "Ocurrió un error al crear el contacto.",
        type: "error",
      });
    },
  });

  const saveNewContact = () => {
    const { name, documentNumber, documentType } = newContact;

    if (!name || !documentNumber) {
      setMessage({
        text: "Nombre y Documento son obligatorios.",
        type: "error",
      });
      return;
    }

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
            : "El CUIT/CUIL debe tener el formato XX-XXXXXXXX-X (Con Guiones).",
        type: "error",
      });
      return;
    }

    createContactMutate({
      ...newContact,
      type: tipo === "cliente" ? "CLIENT" : "SUPPLIER",
      available: true,
      branchId,
    });
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
      {!isOpen ? null : (
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
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>

                {/* Razón social */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Razón Social
                  </label>
                  <input
                    type="text"
                    value={newContact.businessName}
                    onChange={(e) =>
                      setNewContact({
                        ...newContact,
                        businessName: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>

                {/* Tipo documento */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tipo Documento
                  </label>
                  <select
                    value={newContact.documentType}
                    onChange={(e) =>
                      setNewContact({
                        ...newContact,
                        documentType: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="DNI">DNI</option>
                    <option value="CUIL">CUIL</option>
                    <option value="CUIT">CUIT</option>
                  </select>
                </div>

                {/* Documento */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Número Documento *
                  </label>
                  <input
                    type="text"
                    value={newContact.documentNumber}
                    onChange={(e) =>
                      setNewContact({
                        ...newContact,
                        documentNumber: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>

                {/* Condición IVA */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Condición IVA
                  </label>
                  <select
                    value={newContact.ivaCondition}
                    onChange={(e) =>
                      setNewContact({
                        ...newContact,
                        ivaCondition: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="RESPONSABLE_INSCRIPTO">
                      Responsable Inscripto
                    </option>
                    <option value="MONOTRIBUTISTA">Monotributista</option>
                    <option value="EXENTO">Exento</option>
                    <option value="CONSUMIDOR_FINAL">Consumidor Final</option>
                    <option value="SUJETO_NO_CATEGORIZADO">
                      Sujeto No Categorizado
                    </option>
                    <option value="PROVEEDOR_DEL_EXTERIOR">
                      Proveedor del Exterior
                    </option>
                    <option value="CLIENTE_DEL_EXTERIOR">
                      Cliente del Exterior
                    </option>
                    <option value="IVA_LIBERADO_LEY_19640">
                      IVA Liberado Ley 19640
                    </option>
                    <option value="IVA_NO_ALCANZADO">IVA No Alcanzado</option>
                  </select>
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={newContact.phone}
                    onChange={(e) =>
                      setNewContact({ ...newContact, phone: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newContact.email}
                    onChange={(e) =>
                      setNewContact({ ...newContact, email: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>

                {/* Dirección */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={newContact.address}
                    onChange={(e) =>
                      setNewContact({ ...newContact, address: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>
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
      )}
    </>
  );
};

export default ContactCreateModal;
