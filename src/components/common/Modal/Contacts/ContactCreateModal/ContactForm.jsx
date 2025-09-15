import { useState } from "react";
import { useCreateContact } from "../../../../../api/contacts/contacts.queries";
import { Button, Message } from "../../../../dashboard/widgets";
import InputField from "./fields/InputField";
import SelectField from "./fields/SelectField";
import { sanitizeContactData } from "./utils/sanitize";

const initialNewContact = {
  name: "",
  phone: "",
  address: "",
  branchId: "",
  ivaCondition: "CONSUMIDOR_FINAL",
};

const ContactForm = ({ toggleView, tipo, branchId }) => {
  const [newContact, setNewContact] = useState(initialNewContact);
  const [message, setMessage] = useState({ text: "", type: "success" });

  const { mutate: createContactMutate, isPending: saving } = useCreateContact({
    onSuccess: () => {
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
    onError: (error) => {
      setMessage({
        text: `No se pudo crear el contacto. Intenta nuevamente. error: ${
          error?.response?.data?.message || error?.message
        } `,
        type: "error",
      });
    },
  });

  const saveNewContact = () => {
    const cleaned = sanitizeContactData(newContact, tipo, branchId);
    if (
      newContact.name === "" ||
      newContact.address === "" ||
      newContact.phone === ""
    ) {
      setMessage({
        text: "Completa todos los campos obligatorios.",
        type: "info",
      });
      return;
    }
    createContactMutate(cleaned);
  };
  return (
    <>
      <Message
        message={message.text}
        type={message.type}
        onClose={() => setMessage({ text: "" })}
        duration={2500}
      />
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
          onChange={(v) => setNewContact({ ...newContact, businessName: v })}
        />
        <SelectField
          label="Tipo Documento"
          value={newContact.documentType}
          options={["DNI", "CUIL", "CUIT"]}
          onChange={(v) => setNewContact({ ...newContact, documentType: v })}
        />
        <InputField
          label="Número Documento"
          value={newContact.documentNumber}
          onChange={(v) => setNewContact({ ...newContact, documentNumber: v })}
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
          onChange={(v) => setNewContact({ ...newContact, ivaCondition: v })}
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
          onChange={(v) => setNewContact({ ...newContact, address: v })}
        />
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <Button
          type="button"
          onClick={saveNewContact}
          text={saving ? "Guardando..." : "Guardar"}
          disabled={saving}
        />
        <Button type="button" onClick={toggleView} text="Ver Lista" />
      </div>
    </>
  );
};

export default ContactForm;
