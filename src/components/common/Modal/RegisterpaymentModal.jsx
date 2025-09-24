import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  AddCard,
  Cheque,
  CreditCard,
  Danger,
  Delete,
  Dollar,
  Transfer,
} from "../../../assets/icons";
import Method from "../../dashboard/panels/voucher/Containers/Payments/Method";
import {
  Button,
  EntryCard,
  FormattedNumberInput,
  LabelInvoice,
} from "../../dashboard/widgets";
import ModalCreateCard from "../../dashboard/panels/voucher/Containers/Payments/ModalCreateCard";
import { useBanks } from "../../../api/banks/banks.queries";
import { useGetAllCards } from "../../../api/card/card.queries";
import { AnimatePresence, motion } from "framer-motion";
const RegisterPaymentModal = ({
  saldo,
  onClose,
  onRegister,
  payments = [],
  hasProducts,
}) => {
  const { control, register, reset, watch, setValue } = useForm({
    defaultValues: {
      method: "",
      amount: 0,
      currency: "ARS",
      observation: "",
      cardId: "",
      bankId: "",
    },
  });

  const [selectedCard, setSelectedCard] = useState(null);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showPaymentListModal, setShowPaymentListModal] = useState(false);
  const selectedMethod = watch("method");
  const selectedCurrency = watch("currency");
  const amount = watch("amount");

  const { data: cards } = useGetAllCards();
  const { data: banks, isLoading: isBanksLoading } = useBanks();

  const handleDeletePayment = (indexToDelete) => {
    const updatedPayments = payments.filter((_, i) => i !== indexToDelete);
    onRegister(updatedPayments);
  };

  // Cambiamos onSubmit para que siempre agregue al array de pagos
  // 👇 función normal para registrar el pago
  const handleRegisterPayment = () => {
    if (!hasProducts) {
      alert("Debe ingresar al menos un producto antes de registrar un pago.");
      return;
    }

    const data = {
      method: watch("method"),
      amount: watch("amount"),
      currency: watch("currency"),
      observation: watch("observation"),
      bankId: watch("bankId"),
      cardId: selectedCard?.id || null,
    };

    // validación extra: monto > saldo
    if (data.amount > saldo) {
      alert("El monto no puede ser mayor al saldo.");
      return;
    }

    const updatedPayments = [...payments, data];
    onRegister(updatedPayments);

    reset();
    setSelectedCard(null);
    saldo = 0;
  };

  const paymentMethods = [
    { label: "EFECTIVO", icon: <Dollar /> },
    { label: "TARJETA", icon: <CreditCard /> },
    { label: "TRANSFERENCIA", icon: <Transfer /> },
    { label: "CHEQUE", icon: <Cheque /> },
  ];

  const paymentIcons = {
    EFECTIVO: <Dollar />,
    TARJETA: <CreditCard />,
    CHEQUE: <Cheque />,
    TRANSFERENCIA: <Transfer />,
    DOLLAR: <Dollar />,
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[var(--brown-dark-900)]/40 w-full">
      <div className="w-[80%] pb-10 rounded-md bg-[var(--brown-ligth-100)] max-h-full">
        {/* HEADER */}
        <div className="flex justify-between px-6 pb-3 pt-6 border-b-[1px] border-[var(--brown-ligth-200)] rounded-t-md">
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
                  ${saldo?.toLocaleString("es-AR")}
                </span>
              </p>
            </div>
          </div>
        </div>

        <form className="px-6 pt-4 overflow-y-auto max-h-[350px]">
          {/* MÉTODO DE PAGO */}
          <div className="px-6 pt-1">
            <LabelInvoice text={"Método de pagos"} />
            <div
              className={`flex px-6 mt-2 w-full transition-all duration-500 ${
                selectedMethod ? "justify-start gap-4" : "justify-center gap-6"
              }`}
            >
              {paymentMethods.map((m) => (
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
                      setValue(
                        "method",
                        selectedMethod === m.label ? "" : m.label
                      );
                      // if (value !== "TARJETA") setSelectedCard(null);
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* TARJETAS */}

          {selectedMethod === "TARJETA" && (
            <div className="px-6 pt-4  ">
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
              {[
                { label: "PESOS", value: "ARS" },
                { label: "DÓLARES", value: "USD" },
              ].map((c) => (
                <motion.div
                  key={c.value}
                  animate={{
                    opacity: selectedCurrency
                      ? selectedCurrency === c.value
                        ? 1
                        : 0.4
                      : 1,
                    scale: selectedCurrency === c.value ? 1.04 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <Method
                    icon={<Dollar />}
                    label={c.label}
                    selected={selectedCurrency === c.value}
                    onClick={() =>
                      setValue(
                        "currency",
                        selectedCurrency === c.value ? "" : c.value
                      )
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
                name="amount" // 👈 importante: usá "amount" para que coincida con el campo del form
                control={control}
                decimals={2}
                className="w-full bg-[var(--brown-ligth-50)] border border-[var(--brown-ligth-400)] rounded px-3 py-2"
              />
              {amount > saldo && (
                <span className="absolute top-2 right-10">
                  <Danger color={"#b91c1c"} />
                </span>
              )}
              <p className="text-[var(--text-state-red)]">
                {amount > saldo ? "Monto mayor al saldo adeudado" : ""}
              </p>
            </div>
          </div>

          {/* OBSERVACIONES */}
          <div className="px-6 pt-4 w-full mb-5">
            <LabelInvoice text={"Observaciones"} />
            <div className="relative flex flex-col px-6 w-full">
              <textarea
                {...register("observation")}
                rows={3}
                placeholder="Agregar observación"
                className="w-full bg-[var(--brown-ligth-50)] border border-[var(--brown-ligth-400)] rounded px-3 py-2 resize-none"
              ></textarea>
            </div>
          </div>

          {/* BANCOS (TRANSFERENCIA o CHEQUE) */}
          {(selectedMethod === "TRANSFERENCIA" ||
            selectedMethod === "CHEQUE") && (
            <div className="mb-4">
              <label className="block font-medium mb-2">Banco</label>
              <select
                {...register("bankId")}
                className="w-full border px-2 py-1 rounded"
                disabled={isBanksLoading}
              >
                <option value="">Seleccionar banco</option>
                {banks?.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} - {b.branch}
                  </option>
                ))}
              </select>
            </div>
          )}
        </form>
        {/* BOTONES */}
        <div className="flex justify-end gap-2 mt-4">
          <Button text="Cancelar" variant="outline" onClick={onClose} />
          <Button
            text="Registrar"
            type="button"
            onClick={() => handleRegisterPayment()}
          />
          <Button
            text="Ver pagos"
            type="button"
            disabled={payments?.length === 0}
            onClick={() => setShowPaymentListModal(true)}
          />
        </div>

        {/* LISTA DE PAGOS */}
        {showPaymentListModal && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex justify-center items-center bg-black/50"
            >
              <div className="bg-[var(--brown-ligth-50)] rounded-md w-[400px] p-2">
                <div className="flex gap-4 items-center mb-4 border-b-[1px] p-4 border-[var(--brown-ligth-200)]">
                  <div className="bg-[var(--brown-ligth-300)] p-2 rounded-full">
                    <AddCard size={36} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--brown-dark-900)]">
                      Pagos Registrados
                    </h3>
                    <p className="text-[14px] text-[var(--brown-dark-700)] font-normal">
                      Cantidad de pagos: {payments.length}
                    </p>
                  </div>
                </div>
                <ul className="flex flex-col  px-1">
                  {payments && payments.length > 0 ? (
                    payments.map((pago, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center hover:bg-gray-50 rounded"
                      >
                        <EntryCard
                          icon={paymentIcons[pago?.method]}
                          date={pago?.receivedAt}
                          currency={pago?.currency}
                          method={pago?.method}
                          mount={pago?.amount}
                          iconRemplace={
                            <button
                              type="button"
                              onClick={() => handleDeletePayment(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Delete />
                            </button>
                          }
                        />
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-[var(--brown-dark-950)] text-center italic">
                      No hay pagos registrados.
                    </li>
                  )}
                </ul>

                <div className="flex justify-end gap-2 mt-2 border-t-[1px] p-4 border-[var(--brown-ligth-200)]">
                  <Button
                    text="Cerrar"
                    onClick={() => setShowPaymentListModal(false)}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* MODAL AGREGAR TARJETA */}
        <ModalCreateCard
          showAddCardModal={showAddCardModal}
          setShowAddCardModal={setShowAddCardModal}
        />
      </div>
    </div>
  );
};

export default RegisterPaymentModal;
