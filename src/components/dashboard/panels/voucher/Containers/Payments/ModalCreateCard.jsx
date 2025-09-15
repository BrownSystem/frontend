import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, LabelInvoice, Message } from "../../../../widgets";
import { AddCard } from "../../../../../../assets/icons";
import { useCreateCard } from "../../../../../../api/card/card.queries";

const ModalCreateCard = ({ showAddCardModal, setShowAddCardModal }) => {
  const [message, setMessage] = useState({ text: "", type: "info" });
  const createCardMutation = useCreateCard();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const newCardData = {
      name: form.name.value,
      cardType: form.type.value,
      quotas: parseInt(form.cuotas.value),
      available: true,
    };

    createCardMutation.mutate(newCardData, {
      onSuccess: () => {
        setMessage({ text: "Tarjeta creada correctamente", type: "success" });
        setShowAddCardModal(false);
      },
      onError: () => {
        setMessage({ text: "Error al crear la tarjeta", type: "error" });
      },
    });

    form.reset();
  };

  return (
    <>
      <Message
        message={message.text}
        type={message.type}
        duration={3000}
        onClose={() => setMessage({ text: "" })}
      />
      <AnimatePresence>
        {showAddCardModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex justify-center items-center bg-black/50"
          >
            <div className="bg-[var(--brown-ligth-50)] rounded-md w-[400px]">
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
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 px-4 pb-4"
              >
                <div className="flex w-full flex-col bg-[var(--brown-ligth-200)] p-3 rounded-md">
                  <LabelInvoice text="Tipo" />
                  <select
                    name="type"
                    className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                    required
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
                  />
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    text="Cancelar"
                    onClick={() => setShowAddCardModal(false)}
                  />
                  <Button text="Crear" type="submit" />
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalCreateCard;
