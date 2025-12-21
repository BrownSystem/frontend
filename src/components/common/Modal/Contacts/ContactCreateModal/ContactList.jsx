import { useState } from "react";
import {
  useSearchContacts,
  useUpdateContact,
} from "../../../../../api/contacts/contacts.queries";
import { ArrowDown, Delete, ProfileMan } from "../../../../../assets/icons";
import { Button, Message } from "../../../../dashboard/widgets";
import InputField from "./fields/InputField";
import SelectField from "./fields/SelectField";
import { useMessageStore } from "../../../../../store/useMessage";

const ContactList = ({
  onSelect,
  selectedContact,
  branchId,
  tipo,
  editContact,
  debouncedSearch,
  setSelectedContact,
}) => {
  const apiTypeMap = {
    cliente: "CLIENT",
    proveedor: "SUPPLIER",
    vendedor: "SELLER", // 👈 asumiendo que tu backend lo reconoce así
  };

  const { setMessage } = useMessageStore();

  const { data: contacts = [], isLoading } = useSearchContacts({
    search: debouncedSearch,
    branchId: branchId || undefined,
    type: apiTypeMap[tipo] || undefined,
    offset: 1,
    limit: 25,
  });

  const { mutate: updateContactMutate, isPending: updating } = useUpdateContact(
    {
      onSuccess: () => {
        setMessage({
          text: "Contacto actualizado correctamente",
          type: "success",
        });
      },
      onError: (error) => {
        // Aquí verás el objeto del RpcException
        setMessage({
          text: `Error al actualizar el contacto ${error?.response?.data?.message}`,
          type: "error",
        });
      },
    }
  );

  if (isLoading) return <p>Cargando...</p>;
  if (contacts?.data?.length === 0)
    return <p>{`No hay ${tipo} disponibles.`}</p>;

  return (
    <div className="space-y-4 overflow-y-scroll max-h-[250px] scroll-pl-6  p-5">
      <ul className="space-y-3">
        {contacts?.data?.map((item) => (
          <li
            key={item?.id}
            onClick={() => onSelect(item)}
            className="flex flex-col gap-2"
          >
            <div
              className={`flex items-center justify-between px-3 py-2 rounded-md transition shadow-sm cursor-pointer
              ${
                selectedContact?.id === item.id
                  ? "bg-[var(--brown-ligth-200)] ring-2 ring-[var(--brown-dark-600)]"
                  : "bg-[var(--brown-ligth-50)] hover:bg-[var(--brown-ligth-200)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="bg-[var(--brown-ligth-300)] rounded-full">
                  <ProfileMan size="40" />
                </div>
                <div>
                  <span className="flex gap-2 justify-start items-center">
                    <p className="text-sm font-medium text-[var(--brown-dark-900)]">
                      {item?.name}
                    </p>
                    <p className="text-xs text-[var(--brown-dark-900)]">
                      {item?.documentNumber || ""} {item?.businessName || ""}
                    </p>
                  </span>
                  <span className="flex gap-2 justify-start items-center">
                    <p className="text-sm font-medium text-[var(--brown-dark-500)]">
                      {item?.phone || "Sin Télefono"}
                    </p>
                    <p className="text-xs text-[var(--brown-dark-800)]">
                      ( {item?.address} )
                    </p>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-semibold bg-[var(--brown-ligth-400)] rounded-full w-[16px] h-[16px] flex items-center justify-center">
                  <ArrowDown color={"var(--brown-dark-900)"} size={32} />
                </p>
              </div>
            </div>

            {/* Formulario de edición */}
            {selectedContact?.id === item.id && editContact && (
              <div
                className="bg-[var(--brown-ligth-200)] ring-[var(--brown-dark-600)] rounded-md p-4 border-2"
                onClick={(e) => e.stopPropagation()} // 👈 evita cerrar al clickear dentro
              >
                <div className="flex justify-center items-center">
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <InputField
                      label="Nombre"
                      value={selectedContact.name}
                      onChange={(v) =>
                        setSelectedContact({ ...selectedContact, name: v })
                      }
                    />
                    <InputField
                      label="Razón Social"
                      value={selectedContact.businessName}
                      onChange={(v) =>
                        setSelectedContact({
                          ...selectedContact,
                          businessName: v,
                        })
                      }
                    />
                    <SelectField
                      label="Tipo Documento"
                      value={selectedContact.documentType}
                      options={["DNI", "CUIL", "CUIT"]}
                      onChange={(v) =>
                        setSelectedContact({
                          ...selectedContact,
                          documentType: v,
                        })
                      }
                    />
                    <InputField
                      label="Número Documento"
                      value={selectedContact.documentNumber}
                      onChange={(v) =>
                        setSelectedContact({
                          ...selectedContact,
                          documentNumber: v,
                        })
                      }
                    />
                    <SelectField
                      label="Condición IVA"
                      value={selectedContact.ivaCondition}
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
                        setSelectedContact({
                          ...selectedContact,
                          ivaCondition: v,
                        })
                      }
                    />
                    <InputField
                      label="Teléfono"
                      value={selectedContact.phone}
                      onChange={(v) =>
                        setSelectedContact({
                          ...selectedContact,
                          phone: v,
                        })
                      }
                    />
                    <InputField
                      label="Email"
                      value={selectedContact.email}
                      onChange={(v) =>
                        setSelectedContact({
                          ...selectedContact,
                          email: v,
                        })
                      }
                    />
                    <InputField
                      label="Dirección"
                      value={selectedContact.address}
                      onChange={(v) =>
                        setSelectedContact({
                          ...selectedContact,
                          address: v,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="w-full flex gap-2 mt-2">
                  <Button
                    type="button"
                    text="Cerrar"
                    onClick={() => setSelectedContact(null)}
                  />
                  <Button
                    type="button"
                    text={updating ? "Guardando..." : "Guardar Cambios"}
                    disabled={updating}
                    onClick={() => {
                      const { code, id, createdAt, updatedAt, ...rest } =
                        selectedContact;

                      updateContactMutate({
                        id: selectedContact.id,
                        contactData: rest,
                      });
                    }}
                  />

                  <Button
                    type="button"
                    text={updating}
                    Icon={<Delete />}
                    onClick={() => {
                      updateContactMutate({
                        id: selectedContact?.id,
                        contactData: {
                          available: false,
                        },
                      });
                    }}
                  />
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;
