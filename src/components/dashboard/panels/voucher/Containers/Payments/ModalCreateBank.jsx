import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, LabelInvoice, Message } from "../../../../widgets";
import {
  useBanks,
  useCreateBank,
  useUpdateBank,
} from "../../../../../../api/banks/banks.queries";
import { ArrowDown, BankIcon, Delete } from "../../../../../../assets/icons";
import { useMessageStore } from "../../../../../../store/useMessage";
import SelectField from "../../../../../common/Modal/Contacts/ContactCreateModal/fields/SelectField";
import InputField from "../../../../../common/Modal/Contacts/ContactCreateModal/fields/InputField";

const ModalCreateBank = ({ showAddBankModal, setShowAddBankModal }) => {
  const { setMessage } = useMessageStore();

  const createBankMutation = useCreateBank();
  const [name, setName] = useState("");
  const [type, setType] = useState("CAJA_AHORRO");
  const [holderName, setHolderName] = useState("");
  const [showListBank, setShowListBank] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);

  const { data: banks } = useBanks();
  const { mutate: updateBankMutate, isPending: updating } = useUpdateBank({
    onSuccess: () => {
      setMessage({
        text: "Banco actualizado correctamente",
        type: "success",
      });
    },
    onError: (error) => {
      // Aquí verás el objeto del RpcException
      setMessage({
        text: `Error al actualizar el banco ${error?.response?.data?.message}`,
        type: "error",
      });
    },
  });

  const onSelect = (bank) => {
    setSelectedBank(bank);
  };

  const handleCreateBank = () => {
    if (!name || !type || !holderName) {
      setMessage({
        text: "Por favor completa todos los campos",
        type: "error",
      });
      return;
    }
    const newBankData = {
      name,
      accountType: type,
      currency: "ARS",
      holderName,
      available: true,
    };

    createBankMutation.mutate(newBankData, {
      onSuccess: () => {
        setMessage({ text: "Banco creado correctamente", type: "success" });
        setName("");
        setType("CAJA_AHORRO");
        setHolderName(1);
        setTimeout(() => {
          setShowAddBankModal(false);
        }, 1000);
      },
      onError: () => {
        setMessage({ text: "Error al crear el banco", type: "error" });
      },
    });
  };

  return (
    <>
      <AnimatePresence mode="sync">
        {showAddBankModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex justify-center items-center bg-black/50 z-[999999999]"
          >
            <div className="bg-[var(--brown-ligth-50)] rounded-md w-[500px]">
              <div className="flex gap-4 items-center mb-4 border-b-[1px] p-4 border-[var(--brown-ligth-200)]">
                <div className="bg-[var(--brown-ligth-300)] p-2 rounded-full">
                  <BankIcon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--brown-dark-900)]">
                    REGISTRAR BANCO
                  </h3>
                  <p className="text-[14px] text-[var(--brown-dark-700)] font-normal">
                    Completa los datos
                  </p>
                </div>
              </div>

              {/* div con id para capturar valores */}
              {!showListBank ? (
                <div id="bankForm" className="flex flex-col gap-4 px-4 pb-4">
                  <div className="flex w-full flex-col bg-[var(--brown-ligth-200)] p-3 rounded-md">
                    <LabelInvoice text="Tipo de cuenta" />
                    <select
                      name="type"
                      className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                      required
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="CUENTA_CORRIENTE">CUENTA CORRIENTE</option>
                      <option value="CAJA_AHORRO">CAJA DE AHORRO</option>
                    </select>
                  </div>

                  <div className="flex w-full flex-col bg-[var(--brown-ligth-200)] p-3 rounded-md">
                    <LabelInvoice text="Nombre" />
                    <input
                      name="name"
                      type="text"
                      className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                      required
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Agregar nombre del banco"
                    />
                  </div>

                  <div className="flex w-full flex-col bg-[var(--brown-ligth-200)] p-3 rounded-md">
                    <LabelInvoice text="Nombre del titular" />
                    <input
                      name="holderName"
                      type="text"
                      className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                      placeholder="Ingrese"
                      required
                      onChange={(e) => setHolderName(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end gap-2 mt-2">
                    <Button text="Crear" onClick={() => handleCreateBank()} />
                    <Button
                      text={"Editar"}
                      onClick={() => setShowListBank(true)}
                    />
                    <Button
                      cancel={true}
                      text="Cancelar"
                      onClick={() => setShowAddBankModal(false)}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 pb-4 px-2">
                  <div className="space-y-4 overflow-y-scroll max-h-[250px] scroll-pl-6  p-5">
                    <ul className="space-y-3">
                      {banks?.map((item) => (
                        <li
                          key={item?.id}
                          onClick={() => onSelect(item)}
                          className="flex flex-col gap-2"
                        >
                          <div
                            className={`flex items-center justify-between px-3 py-2 rounded-md transition shadow-sm cursor-pointer
              ${
                selectedBank?.id === item.id
                  ? "bg-[var(--brown-ligth-300)] ring-2 ring-[var(--brown-dark-600)]"
                  : "bg-[var(--brown-ligth-200)] hover:bg-[var(--brown-ligth-200)]"
              }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-[var(--brown-ligth-400)] rounded-full p-2">
                                <BankIcon size="20" />
                              </div>
                              <div>
                                <span className="flex gap-2 justify-start items-center">
                                  <p className="text-sm font-medium text-[var(--brown-dark-900)]">
                                    {item?.name}
                                  </p>
                                  <p className="text-xs text-[var(--brown-dark-800)]">
                                    (
                                    {item?.accountType === "CAJA_AHORRO"
                                      ? "CAJA DE AHORRO"
                                      : "CUENTA CORRIENTE"}
                                    ){item?.businessName || ""}
                                  </p>
                                </span>
                                <span className="flex gap-2 justify-start items-center">
                                  <p className="text-xs text-[var(--brown-dark-800)]">
                                    Titular: ( {item?.holderName} )
                                  </p>
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold bg-[var(--brown-ligth-400)] rounded-full w-[16px] h-[16px] flex items-center justify-center">
                                <ArrowDown
                                  color={"var(--brown-dark-900)"}
                                  size={32}
                                />
                              </p>
                            </div>
                          </div>

                          {/* Formulario de edición */}
                          {selectedBank?.id === item.id && (
                            <div
                              className="bg-[var(--brown-ligth-200)] ring-[var(--brown-dark-600)] rounded-md p-4 border-2"
                              onClick={(e) => e.stopPropagation()} // 👈 evita cerrar al clickear dentro
                            >
                              <div className="flex justify-center items-center">
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                  <SelectField
                                    label="Tipo:"
                                    value={
                                      selectedBank.accountType === "CAJA_AHORRO"
                                        ? "CAJA DE AHORRO"
                                        : "CUENTA CORRIENTE"
                                    }
                                    options={[
                                      "CAJA DE AHORRO",
                                      "CUENTA CORRIENTE",
                                    ]}
                                    onChange={(v) =>
                                      setSelectedBank({
                                        ...selectedBank,
                                        accountType:
                                          v === "CAJA DE AHORRO"
                                            ? "CAJA_AHORRO"
                                            : "CUENTA_CORRIENTE",
                                      })
                                    }
                                  />
                                  <InputField
                                    label="Nombre:"
                                    value={selectedBank.name}
                                    onChange={(v) =>
                                      setSelectedBank({
                                        ...selectedBank,
                                        name: v,
                                      })
                                    }
                                  />

                                  <InputField
                                    label="Titular"
                                    value={selectedBank.holderName}
                                    onChange={(v) =>
                                      setSelectedBank({
                                        ...selectedBank,
                                        holderName: v,
                                      })
                                    }
                                  />
                                </div>
                              </div>

                              <div className="w-full flex gap-2 mt-2">
                                <Button
                                  type="button"
                                  text="Cerrar"
                                  onClick={() => setSelectedBank(null)}
                                />
                                <Button
                                  type="button"
                                  text={
                                    updating
                                      ? "Guardando..."
                                      : "Guardar Cambios"
                                  }
                                  disabled={updating}
                                  onClick={() => {
                                    const {
                                      code,
                                      id,
                                      createdAt,
                                      updatedAt,
                                      ...rest
                                    } = selectedBank;

                                    updateBankMutate({
                                      id: selectedBank.id,
                                      data: rest,
                                    });
                                  }}
                                />

                                <Button
                                  type="button"
                                  text={updating}
                                  Icon={<Delete />}
                                  onClick={() => {
                                    updateBankMutate({
                                      id: selectedBank?.id,
                                      data: {
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

                      {banks.length === 0 && (
                        <div>
                          <div className="flex justify-center bg-[var(--brown-ligth-200)] p-2 rounded-md">
                            <p>No hay bancos</p>
                          </div>
                        </div>
                      )}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      cancel={true}
                      text="Volver"
                      onClick={() => setShowListBank(false)}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalCreateBank;
