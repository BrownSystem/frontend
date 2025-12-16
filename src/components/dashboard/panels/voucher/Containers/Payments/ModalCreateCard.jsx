import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, LabelInvoice, Message } from "../../../../widgets";
import {
  AddCard,
  ArrowDown,
  CreditCard,
  Delete,
} from "../../../../../../assets/icons";
import {
  useCreateCard,
  useGetAllCards,
  useUpdateCard,
} from "../../../../../../api/card/card.queries";
import { useMessageStore } from "../../../../../../store/useMessage";
import InputField from "../../../../../common/Modal/Contacts/ContactCreateModal/fields/InputField";
import SelectField from "../../../../../common/Modal/Contacts/ContactCreateModal/fields/SelectField";

const ModalCreateCard = ({ showAddCardModal, setShowAddCardModal }) => {
  const { setMessage } = useMessageStore();

  const createCardMutation = useCreateCard();
  const { data: cards } = useGetAllCards();

  const [name, setName] = useState("");
  const [type, setType] = useState("CREDIT");
  const [cuotas, setCuotas] = useState(1);
  const [showListCards, setShowListCards] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const onSelect = (card) => {
    setSelectedCard(card);
  };

  const { mutate: updateCardMutate, isPending: updating } = useUpdateCard({
    onSuccess: () => {
      setMessage({
        text: "Tarjeta actualizado correctamente",
        type: "success",
      });
    },
    onError: (error) => {
      // Aquí verás el objeto del RpcException
      setMessage({
        text: `Error al actualizar la tarjeta ${error?.response?.data?.message}`,
        type: "error",
      });
    },
  });

  const handleCreateCard = () => {
    if (!name || !type || !cuotas) {
      setMessage({
        text: "Por favor completa todos los campos",
        type: "error",
      });
      return;
    }
    const newCardData = {
      name,
      cardType: type,
      quotas: parseInt(cuotas, 10),
      available: true,
    };

    createCardMutation.mutate(newCardData, {
      onSuccess: () => {
        setMessage({ text: "Tarjeta creada correctamente", type: "success" });
        setName("");
        setType("CREDIT");
        setCuotas(1);
        setTimeout(() => {
          setShowAddCardModal(false);
        }, 1000);
      },
      onError: () => {
        setMessage({ text: "Error al crear la tarjeta", type: "error" });
      },
    });
  };

  return (
    <>
      <AnimatePresence mode="sync">
        {showAddCardModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex justify-center items-center bg-black/50 z-[9999999999]"
          >
            <div className="bg-[var(--brown-ligth-50)] rounded-md w-[500px]">
              <div className="flex gap-4 items-center mb-4 border-b-[1px] p-4 border-[var(--brown-ligth-200)]">
                <div className="bg-[var(--brown-ligth-300)] p-2 rounded-full">
                  <AddCard size={36} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--brown-dark-900)]">
                    REGISTRAR TARJETA
                  </h3>
                  <p className="text-[14px] text-[var(--brown-dark-700)] font-normal">
                    Completa los datos
                  </p>
                </div>
              </div>

              {/* div con id para capturar valores */}
              {!showListCards ? (
                <div id="cardForm" className="flex flex-col gap-4 px-4 pb-4">
                  <div className="flex w-full flex-col bg-[var(--brown-ligth-200)] p-3 rounded-md">
                    <LabelInvoice text="Tipo" />
                    <select
                      name="type"
                      className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                      required
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="CREDIT">CREDITO</option>
                      <option value="DEBIT">DEBITO</option>
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
                      placeholder="Agregar nombre de la tarjeta"
                    />
                  </div>

                  <div className="flex w-full flex-col bg-[var(--brown-ligth-200)] p-3 rounded-md">
                    <LabelInvoice text="Cuotas" />
                    <input
                      name="cuotas"
                      type="number"
                      min="1"
                      className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                      placeholder="Cantidad de cuotas"
                      required
                      onChange={(e) => setCuotas(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end gap-2 mt-2">
                    <Button text="Crear" onClick={() => handleCreateCard()} />
                    <Button
                      text={"Editar"}
                      onClick={() => setShowListCards(true)}
                    />
                    <Button
                      cancel={true}
                      text="Cancelar"
                      onClick={() => setShowAddCardModal(false)}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 px-4 pb-4">
                  <div className="space-y-4 overflow-y-scroll max-h-[250px] scroll-pl-6  p-5">
                    <ul className="space-y-3">
                      {cards?.map((item) => (
                        <li
                          key={item?.id}
                          onClick={() => onSelect(item)}
                          className="flex flex-col gap-2"
                        >
                          <div
                            className={`flex items-center justify-between px-3 py-2 rounded-md transition shadow-sm cursor-pointer
              ${
                selectedCard?.id === item.id
                  ? "bg-[var(--brown-ligth-300)] ring-2 ring-[var(--brown-dark-600)]"
                  : "bg-[var(--brown-ligth-200)] hover:bg-[var(--brown-ligth-200)]"
              }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-[var(--brown-ligth-400)] rounded-full">
                                <CreditCard size="40" />
                              </div>
                              <div>
                                <span className="flex gap-2 justify-start items-center">
                                  <p className="text-sm font-medium text-[var(--brown-dark-900)]">
                                    {item?.name}
                                  </p>
                                  <p className="text-xs text-[var(--brown-dark-900)]">
                                    ({item?.cardType}){item?.businessName || ""}
                                  </p>
                                </span>
                                <span className="flex gap-2 justify-start items-center">
                                  <p className="text-xs text-[var(--brown-dark-800)]">
                                    En ( {item?.quotas} ) Cuotas
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
                          {selectedCard?.id === item.id && (
                            <div
                              className="bg-[var(--brown-ligth-200)] ring-[var(--brown-dark-600)] rounded-md p-4 border-2"
                              onClick={(e) => e.stopPropagation()} // 👈 evita cerrar al clickear dentro
                            >
                              <div className="flex justify-center items-center">
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                  <SelectField
                                    label="Tipo:"
                                    value={
                                      selectedCard.cardType === "CREDIT"
                                        ? "CREDITO"
                                        : "DEBITO"
                                    }
                                    options={["CREDITO", "DEBITO"]}
                                    onChange={(v) =>
                                      setSelectedCard({
                                        ...selectedCard,
                                        cardType:
                                          v === "CREDITO" ? "CREDIT" : "DEBIT",
                                      })
                                    }
                                  />
                                  <InputField
                                    label="Nombre:"
                                    value={selectedCard.name}
                                    onChange={(v) =>
                                      setSelectedCard({
                                        ...selectedCard,
                                        name: v,
                                      })
                                    }
                                  />

                                  <InputField
                                    label="Cantidad de quotas"
                                    value={selectedCard.quotas}
                                    onChange={(v) =>
                                      setSelectedCard({
                                        ...selectedCard,
                                        quotas: v,
                                      })
                                    }
                                  />
                                </div>
                              </div>

                              <div className="w-full flex gap-2 mt-2">
                                <Button
                                  type="button"
                                  text="Cerrar"
                                  onClick={() => setSelectedCard(null)}
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
                                    } = selectedCard;

                                    updateCardMutate({
                                      id: selectedCard.id,
                                      data: rest,
                                    });
                                  }}
                                />

                                <Button
                                  type="button"
                                  text={updating}
                                  Icon={<Delete />}
                                  onClick={() => {
                                    updateCardMutate({
                                      id: selectedCard?.id,
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

                      {cards.length === 0 && (
                        <div>
                          <div className="flex justify-center bg-[var(--brown-ligth-200)] p-2 rounded-md">
                            <p>No hay Tarjetas</p>
                          </div>
                        </div>
                      )}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      cancel={true}
                      text="Volver"
                      onClick={() => setShowListCards(false)}
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

export default ModalCreateCard;
