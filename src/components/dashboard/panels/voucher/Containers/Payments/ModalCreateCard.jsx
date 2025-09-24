import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, LabelInvoice, Message } from "../../../../widgets";
import { AddCard } from "../../../../../../assets/icons";
import { useCreateCard } from "../../../../../../api/card/card.queries";

const ModalCreateCard = ({ showAddCardModal, setShowAddCardModal }) => {
  const [message, setMessage] = useState({ text: "", type: "info" });
  const createCardMutation = useCreateCard();
  const [name, setName] = useState("");
  const [type, setType] = useState("CREDIT");
  const [cuotas, setCuotas] = useState(1);

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

              {/* div con id para capturar valores */}
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
                  <Button
                    text="Cancelar"
                    onClick={() => setShowAddCardModal(false)}
                  />
                  <Button text="Crear" onClick={() => handleCreateCard()} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalCreateCard;
