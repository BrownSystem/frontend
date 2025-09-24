import { useState } from "react";
import {
  Button,
  FormattedNumberInput,
  LabelInvoice,
  Message,
} from "../../../../widgets";
import {
  AddCard,
  Cheque,
  CreditCard,
  Danger,
  Dollar,
  Transfer,
} from "../../../../../../assets/icons";
import Method from "./Method";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import ModalCreateCard from "./ModalCreateCard";
import { useGetAllCards } from "../../../../../../api/card/card.queries";
import { useRegisterPayment } from "../../../../../../api/vouchers/vouchers.queries";

const ModalPaymentCreate = ({ voucher, setShowPaymentModal, currentUser }) => {
  const [message, setMessage] = useState({ text: "", type: "success" });
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  const { control, handleSubmit, watch, register } = useForm({
    defaultValues: { monto: 0, observations: "" },
  });

  const monto = watch("monto");
  const saldo = voucher?.remainingAmount - monto;

  const { data: cards } = useGetAllCards();

  const { mutate, isLoading } = useRegisterPayment({
    onSuccess: () => {
      setMessage({ text: "Pago registrado correctamente ✅", type: "success" });
      setShowPaymentModal(false);
    },
    onError: (error) => {
      setMessage({
        text: error.message || "Ocurrió un error al registrar el pago ❌",
        type: "error",
      });
    },
  });

  const handleSubmitPayment = (data) => {
    // Validaciones adicionales
    if (!selectedMethod)
      return setMessage({ text: "Seleccione un método", type: "error" });
    if (selectedMethod === "TARJETA" && !selectedCard)
      return setMessage({ text: "Seleccione una tarjeta", type: "error" });
    if (!selectedCurrency)
      return setMessage({ text: "Seleccione la moneda", type: "error" });

    const paymentPayload = {
      voucherId: voucher.id,
      method: selectedMethod,
      amount: parseFloat(monto),
      currency: selectedCurrency === "PESOS" ? "ARS" : "USD",
      exchangeRate: 1,
      originalAmount: parseFloat(monto),
      cardId: selectedCard?.id || null,
      receivedBy: currentUser?.id || "usuarioId",
      observation: data.observations || "",
    };

    setMessage({ text: "Pago registrado correctamente ✅", type: "success" });
    mutate(paymentPayload);
  };

  const methods = [
    { icon: <Dollar />, label: "EFECTIVO" },
    { icon: <CreditCard />, label: "TARJETA" },
    { icon: <Transfer />, label: "TRANSFERENCIA" },
    { icon: <Cheque />, label: "CHEQUE" },
  ];

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[var(--brown-dark-900)]/40 w-full">
      <Message
        message={message.text}
        type={message.type}
        duration={3000}
        onClose={() => setMessage({ text: "" })}
      />

      <div className="w-[80%] pb-10 rounded-md bg-[var(--brown-ligth-100)] max-h-full">
        {/* HEADER */}
        <div className="flex justify-between px-6 pb-3 pt-6 border-b-[1px] pr-5 border-[var(--brown-ligth-200)] rounded-t-md">
          <div className="flex gap-6 items-center">
            <span className="bg-[var(--brown-ligth-400)] rounded-full w-[50px] h-[50px] flex justify-center items-center">
              <Dollar size={36} />
            </span>
            <div>
              <h1 className="font-semibold text-[var(--brown-dark-900)] text-lg">
                REGISTRAR PAGOS
              </h1>
              <p className="text-[var(--brown-dark-800)]">
                Saldo Pendiente:
                <span className="text-[var(--text-state-red)] pl-2">
                  $
                  {saldo?.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </span>
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(handleSubmitPayment)}
          className="max-h-[70vh] overflow-y-auto"
        >
          {/* MÉTODO DE PAGOS */}
          <div className="px-6 pt-4">
            <LabelInvoice text={"Método de pagos"} />
            <div
              className={`flex px-6 mt-2 w-full transition-all duration-500 ${
                selectedMethod ? "justify-start gap-4" : "justify-center gap-6"
              }`}
            >
              {methods.map((m) => (
                <motion.div
                  key={m.label}
                  animate={{
                    opacity: selectedMethod
                      ? selectedMethod === m.label
                        ? 1
                        : 0.3
                      : 1,
                    scale: selectedMethod === m.label ? 1.04 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Method
                    icon={m.icon}
                    label={m.label}
                    selected={selectedMethod === m.label}
                    onClick={() => {
                      setSelectedMethod(
                        selectedMethod === m.label ? "" : m.label
                      );
                      if (m.label !== "TARJETA") setSelectedCard(null);
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* SELECCIÓN DE TARJETAS */}
          {selectedMethod === "TARJETA" && (
            <div className="px-6 pt-4">
              <LabelInvoice text="Seleccionar tarjeta" />
              <div className="flex gap-4 flex-wrap mt-2">
                {cards?.map((card) => (
                  <motion.div
                    key={card.id}
                    animate={{
                      opacity: selectedCard?.id === card.id ? 1 : 0.5,
                      scale: selectedCard?.id === card.id ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Method
                      icon={<CreditCard />}
                      label={card.name}
                      type={card.cardType === "CREDIT" ? "CREDITO" : "DEBITO"}
                      quotas={card.quotas}
                      selected={selectedCard?.id === card.id}
                      onClick={() =>
                        setSelectedCard(
                          selectedCard?.id === card.id ? null : card
                        )
                      }
                    />
                  </motion.div>
                ))}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Method
                    icon={<AddCard />}
                    label="Agregar tarjeta"
                    onClick={() => setShowAddCardModal(true)}
                  />
                </motion.div>
              </div>
            </div>
          )}

          {/* MONEDA */}
          <div className="px-6 pt-4 w-full">
            <LabelInvoice text={"Moneda"} />
            <div className="flex px-6 gap-6 justify-center w-full">
              {["PESOS", "DOLARES"].map((c) => (
                <motion.div
                  key={c}
                  animate={{
                    opacity: selectedCurrency
                      ? selectedCurrency === c
                        ? 1
                        : 0.4
                      : 1,
                    scale: selectedCurrency === c ? 1.04 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <Method
                    icon={<Dollar />}
                    label={c}
                    selected={selectedCurrency === c}
                    onClick={() =>
                      setSelectedCurrency(selectedCurrency === c ? "" : c)
                    }
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* MONTO */}
          <div className="px-6 pt-4 w-full mb-5">
            <LabelInvoice text={"Monto a abonar"} />
            <div className="relative flex flex-col px-6 w-full">
              <FormattedNumberInput
                name="monto"
                control={control}
                decimals={2}
                className="w-full bg-[var(--brown-ligth-50)] border border-[var(--brown-ligth-400)] rounded px-3 py-2"
              />
              {monto > voucher?.remainingAmount && (
                <span className="absolute top-2 right-10">
                  <Danger color={"#b91c1c"} />
                </span>
              )}
              <p className="text-[var(--text-state-red)]">
                {monto > voucher?.remainingAmount
                  ? "Monto mayor al saldo adeudado"
                  : ""}
              </p>
            </div>
          </div>

          {/* OBSERVACIONES */}
          <div className="px-6 pt-4 w-full mb-5">
            <LabelInvoice text={"Observaciones"} />
            <div className="relative flex flex-col px-6 w-full">
              <textarea
                {...register("observations")}
                rows={3}
                placeholder="Agregar observación"
                className="w-full bg-[var(--brown-ligth-50)] border border-[var(--brown-ligth-400)] rounded px-3 py-2 resize-none"
              ></textarea>
            </div>
          </div>

          {/* BOTONES */}
          <div className="flex gap-3 justify-end px-12 pt-4 w-full">
            <Button
              type="submit"
              text={"REALIZAR PAGO"}
              disabled={
                monto > voucher?.remainingAmount || !monto || !selectedMethod
              }
              loading={isLoading}
            />
            <Button
              text={"CANCELAR"}
              onClick={() => setShowPaymentModal(false)}
            />
          </div>
        </form>
      </div>

      {/* MODAL AGREGAR TARJETA */}
      <ModalCreateCard
        showAddCardModal={showAddCardModal}
        setShowAddCardModal={setShowAddCardModal}
      />
    </div>
  );
};

export default ModalPaymentCreate;
