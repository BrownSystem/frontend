import { useFindOneContact } from "../../../../../../api/contacts/contacts.queries";
import {
  Document,
  Email,
  IvaCondition,
  Phone,
  Pin,
  ProfileMan,
  Social,
} from "../../../../../../assets/icons";
import VoucherContact from "./VoucherContact";

const Contact = ({ voucher }) => {
  // Hook para obtener el contacto
  const {
    data: contact,
    isLoading,
    error,
  } = useFindOneContact(voucher?.contactId, {
    onSuccess: (data) => console.log("Contacto encontrado", data),
    onError: (err) => console.error("Error al cargar contacto", err),
  });

  const fields = [
    {
      icon: <ProfileMan hsize={28} />,
      method: "NOMBRE",
      mount: contact?.name,
    },
    {
      icon: <Phone size={28} />,
      method: "TELEFONO",
      mount: contact?.phone,
    },
    {
      icon: <Social size={28} />,
      method: "RAZON SOCIAL",
      mount: contact?.businessName,
    },
    {
      icon: <Document size={28} />,
      method: contact?.documentType,
      mount: contact?.documentNumber,
    },
    {
      icon: <Email size={28} />,
      method: "EMAIL",
      mount: contact?.email,
    },
    {
      icon: <Pin size={28} />,
      method: "DIRECCIÓN",
      mount: contact?.address,
    },
    {
      icon: <IvaCondition size={28} />,
      method: "CONDICIÓN FRENTE A I.V.A",
      mount: contact?.ivaCondition,
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center gap-3  w-full py-2 rounded-md ">
      {isLoading && <p>Cargando contacto...</p>}
      {error && <p className="text-red-500">Error al cargar contacto</p>}
      {contact && (
        <div className="flex flex-col px-5 self-start p-4 bg-[var(--brown-ligth-200)] rounded-md w-full">
          <span className="text-[var(--brown-dark-950)] font-semibold">
            INFORMACIÓN DEL CLIENTE
          </span>
          <p className="text-[var(--brown-dark-800)]">
            Datos de cliente asociado a esta factura.
          </p>
        </div>
      )}
      {/* Render dinámico de campos */}
      <div>
        <div className="grid grid-cols-3 items-center justify-center gap-3 w-full">
          {fields
            .filter((field) => field.mount) // Mostrar solo si tiene valor
            .map((field, index, arr) => {
              const isLast = index === arr.length - 1;
              const remainder = arr.length % 3; // cuántos sobran en la última fila

              // Si es el último y sobra 1 → que ocupe 3 columnas
              // Si es el último y sobran 2 → que ocupe 2 columnas
              let spanClass = "";
              if (isLast) {
                if (remainder === 1) spanClass = "col-span-3";
                if (remainder === 2) spanClass = "col-span-2";
              }

              return (
                <div key={index} className={spanClass}>
                  <VoucherContact
                    icon={field.icon}
                    title={field.method}
                    text={field.mount}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Contact;
