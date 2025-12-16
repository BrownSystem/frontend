import { useState } from "react";
import {
  Button,
  FormattedNumberInput,
  LabelInvoice,
} from "../../../../widgets";
import {
  AddCard,
  BankIcon,
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
import { useBanks } from "../../../../../../api/banks/banks.queries";
import ModalCreateBank from "./ModalCreateBank";
import { useMessageStore } from "../../../../../../store/useMessage";
import {
  useCheckBook,
  useDeleteCheckBook,
} from "../../../../../../api/check-book/check-book.queries";
import { useFindAllBranch } from "../../../../../../api/branch/branch.queries";
import { formatFechaISO } from "../../../stocks/content/SupplierContent/tables/InvoiceTable";

const ModalPaymentCreate = ({
  voucher,
  setShowPaymentModal,
  currentUser,
  boxDaily,
}) => {
  // Calcular fechas
  const today = new Date();
  const emissionDate = today.toISOString().split("T")[0]; // formato YYYY-MM-DD
  const dueDate = new Date(today.setDate(today.getDate() + 30))
    .toISOString()
    .split("T")[0];
  const { setMessage } = useMessageStore();

  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [selectedCheque, setSelectedCheque] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedCheckBook, setSelectedCheckBook] = useState(null);

  const [nameBank, setNameBank] = useState("");
  const [chequeNumber, setChequeNumber] = useState("");
  const [emissionDateValue, setEmissionDateValue] = useState(emissionDate);
  const [dueDateValue, setDueDateValue] = useState(dueDate);

  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false);

  const { control, handleSubmit, watch, register, setValue, reset } = useForm({
    defaultValues: { monto: 0, observations: "" },
  });

  const monto = watch("monto");
  const saldo = voucher?.remainingAmount - monto;

  const { data: cards } = useGetAllCards();
  const { data: banks, isLoading: isBanksLoading } = useBanks();
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
  const { mutate: deleteCheckBook } = useDeleteCheckBook();

  const { data: branch } = useFindAllBranch();
  const { data: checkBooks } = useCheckBook();

  const resetMethodStates = () => {
    setSelectedCard(null);
    setSelectedBank(null);
    setSelectedCheque("");
    setSelectedCheckBook(null);
    setChequeNumber("");
    setNameBank("");
    setSelectedCurrency("");
    setValue("monto", 0);
    reset({ monto: 0, observations: "" }); // opcional
  };

  const onSelect = (checkBook) => {
    setSelectedCheckBook(checkBook);
    setValue("monto", parseFloat(checkBook.amount));

    setChequeNumber(checkBook.chequeNumber || "");
    setNameBank(checkBook.chequeBank || "");
  };

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
      method:
        selectedMethod === "CHEQUE" && selectedCheque
          ? `${
              selectedCheque === "CHEQUE DE TERCERO"
                ? "CHEQUE_TERCERO"
                : "CHEQUE"
            }`
          : selectedMethod,
      amount: parseFloat(monto),
      currency: selectedCurrency === "PESOS" ? "ARS" : "USD",
      exchangeRate: 1,
      originalAmount: parseFloat(monto),
      cardId: selectedCard?.id || null,
      bankId: selectedBank?.id || null,
      receivedBy: currentUser?.id || null,
      observation: data.observations || "",
      // boxId: boxDaily[0].id,
      chequeNumber: chequeNumber || null,
      chequeDueDate: selectedMethod === "CHEQUE" ? dueDateValue : "",
      chequeReceived: selectedMethod === "CHEQUE" ? emissionDateValue : "",
      chequeBank: nameBank || null,
      receivedAt: emissionDateValue,
    };

    setMessage({ text: "Pago registrado correctamente ✅", type: "success" });
    deleteCheckBook(selectedCheckBook?.id);
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
              <p className="text-[var(--brown-dark-800)] flex items-center">
                Saldo Pendiente:
                <span
                  className={`pl-2 ${
                    saldo < 0
                      ? "text-[var(--text-state-red)]"
                      : "text-[var(--text-state-green)]"
                  }`}
                >
                  $
                  {voucher?.remainingAmount?.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
                {saldo < 0 && (
                  <span className="pl-2 flex items-center">
                    <Danger size={22} color={"#a83228"} />
                  </span>
                )}
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
                      resetMethodStates();
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

          {/* SELECCION DE CHEQUE */}
          {selectedMethod === "CHEQUE" && (
            <div className="px-6 pt-4 w-full">
              <LabelInvoice text={"Tipo de Cheque"} />
              <div
                className={`flex px-6 mt-2 w-full transition-all duration-500 gap-4`}
              >
                {(voucher?.type !== "P"
                  ? ["CHEQUE PROPIO", "CHEQUE DE TERCERO"]
                  : ["CHEQUE DE TERCERO"]
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
          {selectedCheque === "CHEQUE PROPIO" &&
            voucher?.type === "FACTURA" && (
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

          {/* FORM DE CHEQUES SI ABONAN*/}
          {selectedCheque === "CHEQUE DE TERCERO" && voucher?.type === "P" && (
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

          {/* CARTERA DE CHEQUE */}
          {selectedCheque === "CHEQUE DE TERCERO" &&
            voucher?.type === "FACTURA" && (
              <div className="space-y-4 overflow-y-scroll max-h-[250px] scroll-pl-6  p-5 ">
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
          {selectedCheque === "CHEQUE DE TERCERO" &&
          voucher?.type === "FACTURA" ? (
            ""
          ) : (
            <div className="flex px-12 gap-2">
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
              <div className="pt-4 w-full mb-5">
                <LabelInvoice text={"Monto a abonar"} />
                <div className="relative flex flex-col w-full">
                  <FormattedNumberInput
                    name="monto"
                    control={control}
                    decimals={2}
                    className={`w-full bg-[var(--brown-ligth-50)] border border-[var(--brown-ligth-400)] rounded px-3 py-2 `}
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
            </div>
          )}

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

      <ModalCreateBank
        showAddBankModal={showAddBankModal}
        setShowAddBankModal={setShowAddBankModal}
      />
    </div>
  );
};

export default ModalPaymentCreate;
