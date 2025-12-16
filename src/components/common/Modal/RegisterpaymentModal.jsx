import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  AddCard,
  BankIcon,
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
import ModalCreateBank from "../../dashboard/panels/voucher/Containers/Payments/ModalCreateBank";
import { useCheckBook } from "../../../api/check-book/check-book.queries";
import { useFindAllBranch } from "../../../api/branch/branch.queries";
import { formatFechaISO } from "../../dashboard/panels/stocks/content/SupplierContent/tables/InvoiceTable";
const RegisterPaymentModal = ({
  saldo,
  voucherType,
  tipoOperacion,
  onClose,
  onRegister,
  payments = [],
  hasProducts,
}) => {
  const { control, register, reset, watch, setValue } = useForm({
    defaultValues: {
      id: "",
      method: "",
      amount: 0,
      currency: "ARS",
      observation: "",
      cardId: "",
      bankId: "",
      chequeNumber: "",
      chequeDueDate: "",
      chequeReceived: "",
      chequeBank: "",
      receivedAt: "",
    },
  });

  // Calcular fechas
  const today = new Date();
  const emissionDate = today.toISOString().split("T")[0]; // formato YYYY-MM-DD
  const dueDate = new Date(today.setDate(today.getDate() + 30))
    .toISOString()
    .split("T")[0];

  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCheque, setSelectedCheque] = useState("");
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedCheckBook, setSelectedCheckBook] = useState(null);

  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showPaymentListModal, setShowPaymentListModal] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false);

  const [nameBank, setNameBank] = useState("");
  const [chequeNumber, setChequeNumber] = useState("");
  const [emissionDateValue, setEmissionDateValue] = useState(emissionDate);
  const [dueDateValue, setDueDateValue] = useState(dueDate);

  const selectedMethod = watch("method");
  const selectedCurrency = watch("currency");
  const amount = watch("amount");
  const resto = saldo - amount;

  const { data: cards } = useGetAllCards();
  const { data: banks, isLoading: isBanksLoading } = useBanks();
  const { data: branch } = useFindAllBranch();

  const { data: checkBooks } = useCheckBook();

  const resetMethodStates = () => {
    setSelectedCard(null);
    setSelectedBank(null);
    setSelectedCheque("");
    setSelectedCheckBook(null);
    setChequeNumber("");
    setNameBank("");
    reset(); // opcional
  };

  const onSelect = (checkBook) => {
    setSelectedCheckBook(checkBook);
    setValue("amount", parseFloat(checkBook.amount));

    setChequeNumber(checkBook.chequeNumber || "");
    setNameBank(checkBook.chequeBank || "");
  };

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
      method:
        selectedMethod === "CHEQUE" && selectedCheque
          ? `${
              selectedCheque === "CHEQUE DE TERCERO"
                ? "CHEQUE_TERCERO"
                : "CHEQUE"
            }`
          : selectedMethod,
      amount: watch("amount"),
      currency: watch("currency"),
      observation: watch("observation"),
      bankId: selectedBank?.id,
      cardId: selectedCard?.id || null,
      chequeNumber: chequeNumber || null,
      chequeDueDate: selectedMethod === "CHEQUE" ? dueDateValue : "",
      chequeReceived: selectedMethod === "CHEQUE" ? emissionDateValue : "",
      chequeBank: nameBank || null,
      id: selectedCheckBook?.id,
      receivedAt: emissionDateValue,
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
    CHEQUE_TERCERO: <Cheque />,
    TRANSFERENCIA: <Transfer />,
    DOLLAR: <Dollar />,
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[var(--brown-dark-900)]/40 w-full">
      {/* LISTA DE PAGOS */}
      {showPaymentListModal && (
        <AnimatePresence mode="sync">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex justify-center items-center bg-black/50 z-[999999]"
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

      <ModalCreateBank
        showAddBankModal={showAddBankModal}
        setShowAddBankModal={setShowAddBankModal}
      />

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
              <p className="text-[var(--brown-dark-800)] flex items-center">
                Saldo Pendiente:
                <span
                  className={`pl-2 ${
                    resto < 0
                      ? "text-[var(--text-state-red)]"
                      : "text-[var(--text-state-green)]"
                  }`}
                >
                  $
                  {saldo?.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </span>
                {resto < 0 && (
                  <span className="pl-2 flex items-center">
                    <Danger size={22} color={"#a83228"} />
                  </span>
                )}
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
                      resetMethodStates();
                      setValue(
                        "method",
                        selectedMethod === m.label ? "" : m.label
                      );
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
                    label="Gestionar tarjeta"
                    onClick={() => setShowAddCardModal(true)}
                  />
                </motion.div>
              </div>
            </div>
          )}

          {/* SELECCIÓN DE BANCOS */}
          {selectedMethod === "TRANSFERENCIA" && (
            <div className="px-6 pt-4">
              <LabelInvoice text="Seleccionar banco" />
              <div className="flex gap-4 flex-wrap mt-2">
                {banks?.map((bank) => (
                  <motion.div
                    key={bank.id}
                    animate={{
                      opacity: selectedBank?.id === bank.id ? 1 : 0.5,
                      scale: selectedBank?.id === bank.id ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Method
                      icon={<CreditCard />}
                      label={bank.name}
                      type={
                        bank.accountType === "CAJA_AHORRO"
                          ? "CAJA DE AHORRO"
                          : "CUENTA CORRIENTE"
                      }
                      holderName={bank.holderName}
                      selected={selectedBank?.id === bank.id}
                      onClick={() =>
                        setSelectedBank(
                          selectedBank?.id === bank.id ? null : bank
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
                    icon={<BankIcon size={24} />}
                    label="Gestionar banco"
                    onClick={() => setShowAddBankModal(true)}
                  />
                </motion.div>
              </div>
            </div>
          )}

          {/* TIPO DE CHEQUE */}
          {selectedMethod === "CHEQUE" && (
            <div className="px-6 pt-4 w-full">
              <LabelInvoice text={"Tipo de Cheque"} />
              <div
                className={`flex px-6 mt-2 w-full transition-all duration-500 gap-4`}
              >
                {(tipoOperacion === "venta"
                  ? ["CHEQUE DE TERCERO"]
                  : ["CHEQUE PROPIO", "CHEQUE DE TERCERO"]
                ).map((c) => (
                  <motion.div
                    key={c}
                    animate={{
                      opacity: selectedCheque
                        ? selectedCheque === c
                          ? 1
                          : 0.4
                        : 1,
                      scale: selectedCheque === c ? 1.04 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <Method
                      icon={<Cheque />}
                      label={c}
                      selected={selectedCheque === c}
                      onClick={() =>
                        setSelectedCheque(selectedCheque === c ? "" : c)
                      }
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* FORM DE CHEQUES SI ABONAN*/}
          {selectedCheque === "CHEQUE PROPIO" && voucherType === "FACTURA" && (
            <div className="w-full grid grid-cols-2 px-8">
              {/* NÚMERO DE CHEQUE  */}
              <div className="flex w-full flex-col  p-3 rounded-md">
                <LabelInvoice text="Número de cheque" />
                <input
                  name="chequeNumber"
                  type="text"
                  className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                  required
                  onChange={(e) => setChequeNumber(e.target.value)}
                  placeholder="0000"
                />
              </div>
              {/* BANCO  */}
              <div className="flex w-full flex-col  p-3 rounded-md">
                <LabelInvoice text="Banco emisor" />
                <input
                  name="chequeBank"
                  type="text"
                  className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                  required
                  onChange={(e) => setNameBank(e.target.value)}
                  placeholder="BANCO NACION"
                />
              </div>

              {/* FECHA DE EMISION   */}
              <div className="flex w-full flex-col  p-3 rounded-md">
                <LabelInvoice text="Fecha de emisión" />
                <input
                  name="chequeEmissionDate"
                  value={emissionDateValue}
                  onChange={(e) => setEmissionDateValue(e.target.value)}
                  type="date"
                  defaultValue={emissionDate}
                  className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                  required
                />
              </div>

              {/* FECHA DE VENCIMIENTO   */}
              <div className="flex w-full flex-col  p-3 rounded-md">
                <LabelInvoice text="Fecha de vencimiento" />
                <input
                  value={dueDateValue}
                  onChange={(e) => setDueDateValue(e.target.value)}
                  name="chequeDueDate"
                  type="date"
                  defaultValue={dueDate}
                  className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                  required
                />
              </div>
            </div>
          )}

          {/* FORM DE CHEQUES SI ABONAN*/}
          {selectedCheque === "CHEQUE DE TERCERO" && voucherType === "P" && (
            <div className="w-full grid grid-cols-2 px-8">
              {/* NÚMERO DE CHEQUE  */}
              <div className="flex w-full flex-col  p-3 rounded-md">
                <LabelInvoice text="Número de cheque" />
                <input
                  name="chequeNumber"
                  type="text"
                  className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                  required
                  onChange={(e) => setChequeNumber(e.target.value)}
                  placeholder="0000"
                />
              </div>
              {/* BANCO  */}
              <div className="flex w-full flex-col  p-3 rounded-md">
                <LabelInvoice text="Banco emisor" />
                <input
                  name="chequeBank"
                  type="text"
                  className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                  required
                  onChange={(e) => setNameBank(e.target.value)}
                  placeholder="BANCO NACION"
                />
              </div>

              {/* FECHA DE EMISION   */}
              <div className="flex w-full flex-col  p-3 rounded-md">
                <LabelInvoice text="Fecha de emisión" />
                <input
                  name="chequeEmissionDate"
                  type="date"
                  defaultValue={emissionDate}
                  className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                  required
                />
              </div>

              {/* FECHA DE VENCIMIENTO   */}
              <div className="flex w-full flex-col  p-3 rounded-md">
                <LabelInvoice text="Fecha de vencimiento" />
                <input
                  name="chequeDueDate"
                  type="date"
                  defaultValue={dueDate}
                  className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                  required
                />
              </div>
            </div>
          )}

          {/* CARTERA DE CHEQUE */}
          {selectedCheque === "CHEQUE DE TERCERO" &&
            voucherType === "FACTURA" && (
              <div className="space-y-4 overflow-y-scroll max-h-[250px] scroll-pl-6  py-6">
                <LabelInvoice text={"Selecciona el cheque:"} />

                <ul className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 px-10 w-full">
                  {checkBooks?.map((item) => (
                    <li
                      key={item?.id}
                      onClick={() => onSelect(item)}
                      className="w-full"
                    >
                      <div
                        className={`flex items-center justify-between px-3 py-2 rounded-md transition shadow-sm cursor-pointer
                        ${
                          selectedCheckBook?.id === item.id
                            ? "bg-[var(--brown-ligth-200)] ring-2 ring-[var(--brown-dark-600)]"
                            : "bg-[var(--brown-ligth-50)] hover:bg-[var(--brown-ligth-200)]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-[var(--brown-ligth-300)] p-2 rounded-full">
                            <Cheque size="30" />
                          </div>
                          <div>
                            <span className="flex gap-2 justify-start items-center">
                              <p className="text-sm font-medium text-[var(--brown-dark-900)]">
                                $
                                <span className="font-bold">
                                  {item?.amount.toLocaleString("es-AR")}
                                </span>
                                <span className=" pl-2 font-normal text-[var(--brown-dark-700)]">
                                  ( {item?.chequeNumber} ){" "}
                                  <span>( {item?.chequeBank})</span>
                                </span>
                              </p>
                            </span>
                            <span className="flex gap-2 justify-start items-center">
                              <p className="text-sm font-medium text-[var(--brown-dark-800)]">
                                {
                                  branch.find((b) => b?.id === item?.branchId)
                                    .name
                                }
                                <span className="text-[var(--brown-dark-700)] pl-2">
                                  (vto: {formatFechaISO(item.chequeDueDate)})
                                </span>
                              </p>
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                  {checkBooks?.length === 0 && (
                    <div className="flex justify-center bg-[var(--brown-ligth-200)] p-2 rounded-md">
                      <p>No hay cheques en la cartera</p>
                    </div>
                  )}
                </ul>
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
          {selectedCheque === "CHEQUE DE TERCERO" &&
          voucherType === "FACTURA" ? (
            ""
          ) : (
            <div className="flex px-6 gap-2">
              {selectedMethod !== "CHEQUE" && (
                <div className=" pt-4 w-full mb-5">
                  <LabelInvoice text="Fecha de emisión" />
                  <input
                    name="receivetAt"
                    type="date"
                    value={emissionDateValue}
                    onChange={(e) => setEmissionDateValue(e.target.value)}
                    className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                    required
                  />
                </div>
              )}
              <div className=" pt-4 w-full mb-5">
                <LabelInvoice text={"Monto a abonar"} />
                <div className="relative flex flex-col w-full">
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
            </div>
          )}

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
      </div>
    </div>
  );
};

export default RegisterPaymentModal;
