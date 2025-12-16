import { useState } from "react";
import { useFindAllBranch } from "../../../../../../../../../../api/branch/branch.queries";
import {
  Button,
  FormattedNumberInput,
  LabelInvoice,
  Message,
} from "../../../../../../../../widgets";
import { motion } from "framer-motion";
import Method from "../../../../../../../voucher/Containers/Payments/Method";
import {
  AddCard,
  BankIcon,
  Cheque,
  CreditCard,
  Dollar,
  Lamp,
  ProfileMan,
  Social,
  Transfer,
} from "../../../../../../../../../../assets/icons";
import { useForm } from "react-hook-form";
import { useGetAllCards } from "../../../../../../../../../../api/card/card.queries";
import { useBanks } from "../../../../../../../../../../api/banks/banks.queries";
import ModalCreateCard from "../../../../../../../voucher/Containers/Payments/ModalCreateCard";
import ModalCreateBank from "../../../../../../../voucher/Containers/Payments/ModalCreateBank";
import { useSearchContacts } from "../../../../../../../../../../api/contacts/contacts.queries";
import { useGetAllBoxCategories } from "../../../../../../../../../../api/box-category/box-category.queries";
import ModalCreateBoxCategory from "./ModalCreateBoxCategory";
import {
  useExpenseByCategory,
  useExpenseEmployeed,
  useExpenseTransferByBranch,
} from "../../../../../../../../../../api/transactions/transaction.queries";
import { useMessageStore } from "../../../../../../../../../../store/useMessage";

const TypeOfExpenses = ({
  setShowExpenseModal,
  boxId,
  selectedExpense,
  selectedBranchId,
  selectedBranchName,
}) => {
  const { control, handleSubmit, watch, register } = useForm({
    defaultValues: { monto: 0, observations: "" },
  });

  const monto = watch("monto");

  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [selectedCheque, setSelectedCheque] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedBoxCategory, setSelectedBoxCategory] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [showAddBoxCategoryModal, setShowAddBoxCategoryModal] = useState(false);

  const { setMessage } = useMessageStore();
  const { data: cards } = useGetAllCards();
  const { data: boxCategories } = useGetAllBoxCategories();
  const { data: banks, isLoading: isBanksLoading } = useBanks();
  const { data: branch } = useFindAllBranch();
  const { data: contacts = [], isContactLoading } = useSearchContacts({
    type: "SELLER",
    offset: 1,
    limit: 100,
  });
  const { mutate: createExpenseTransfer, isLoading } =
    useExpenseTransferByBranch({
      onSuccess: (data) => {
        console.log(data);
        if (data?.status === 500) {
          setMessage({
            text: data.message,
            type: "error",
          });
        } else {
          setMessage({
            text: "✅ Transferencia creada correctamente",
            type: "success",
          });
          setShowExpenseModal(false);
        }
      },
      onError: (err) => {
        setMessage({
          text: `Ocurrió un error al crear el pago: ${err}`,
          type: "error",
        });
      },
    });

  const { mutate: createExpenseEmployeed, isLoading: employeedLoading } =
    useExpenseEmployeed({
      onSuccess: (data) => {
        if (data?.status === 500) {
          setMessage({
            text: data.message,
            type: "error",
          });
        } else {
          setMessage({
            text: "Pago creada correctamente",
            type: "success",
          });
          setShowExpenseModal(false);
        }
      },
      onError: (err) => {
        setMessage({
          text: `Ocurrió un error al crear el pago: ${err}`,
          type: "error",
        });
      },
    });

  const { mutate: createExpenseByCategory, isLoading: categoryLoading } =
    useExpenseByCategory({
      onSuccess: (data) => {
        if (data?.status === 500) {
          setMessage({
            text: data.message,
            type: "error",
          });
        } else {
          setMessage({
            text: "Pago creada correctamente",
            type: "success",
          });
          setShowExpenseModal(false);
        }
      },
      onError: (err) => {
        setMessage({
          text: `Ocurrió un error al crear el pago: ${err}`,
          type: "error",
        });
      },
    });

  const methods = [
    { icon: <Dollar />, label: "EFECTIVO" },
    { icon: <CreditCard />, label: "TARJETA" },
    { icon: <Transfer />, label: "TRANSFERENCIA" },
    { icon: <Cheque />, label: "CHEQUE" },
  ];

  const onSelect = (contact) => {
    setSelectedContact(contact);
  };

  const onSubmit = (formData) => {
    if (selectedExpense === "SUCURSAL") {
      createExpenseTransfer({
        branchId: selectedBranch,
        branchName: branch.find((b) => b.id === selectedBranch)?.name || "",
        boxId,
        amount: Number(formData.monto),
        paymentMethod:
          selectedMethod === "CHEQUE" && selectedCheque
            ? `${
                selectedCheque === "CHEQUE DE TERCERO"
                  ? "CHEQUE_TERCERO"
                  : "CHEQUE"
              }`
            : selectedMethod,
        currency: selectedCurrency === "DOLARES" ? "USD" : "ARS",
        branchIdOrigen: selectedBranchId,
        branchNameOrigen: selectedBranchName,
      });
    } else if (selectedExpense === "EMPLEADOS (VALES)") {
      createExpenseEmployeed({
        boxId,
        amount: Number(formData.monto),
        paymentMethod:
          selectedMethod === "CHEQUE" && selectedCheque
            ? `${
                selectedCheque === "CHEQUE DE TERCERO"
                  ? "CHEQUE_TERCERO"
                  : "CHEQUE"
              }`
            : selectedMethod,
        currency: selectedCurrency === "DOLARES" ? "USD" : "ARS",
        employeedId: selectedContact?.id,
        employeedName: selectedContact?.name,
      });
    } else if (selectedExpense === "CATEGORIA") {
      createExpenseByCategory({
        boxId,
        amount: Number(formData.monto),
        paymentMethod:
          selectedMethod === "CHEQUE" && selectedCheque
            ? `${
                selectedCheque === "CHEQUE DE TERCERO"
                  ? "CHEQUE_TERCERO"
                  : "CHEQUE"
              }`
            : selectedMethod,
        currency: selectedCurrency === "DOLARES" ? "USD" : "ARS",
        categoryId: selectedBoxCategory?.id,
        categoryName: selectedBoxCategory?.name,
      });
    }
  };

  if (isContactLoading || isBanksLoading) return <p>Cargando...</p>;
  if (contacts?.data?.length === 0)
    // return <p>{`No hay ${tipo} disponibles.`}</p>;

    return (
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* BRANCHES */}
          {selectedExpense === "SUCURSAL" && (
            <div className="px-6 pt-4">
              <LabelInvoice text={"Enviar dinero a:"} />
              <div className="flex px-6 mt-2 w-full transition-all duration-500 gap-4 flex-wrap">
                {branch
                  // 🔥 Filtramos para que NO aparezca la sucursal origen
                  .filter((b) => b.id !== selectedBranchId)
                  .map((m) => (
                    <motion.div
                      key={m.id}
                      animate={{
                        opacity: selectedBranch
                          ? selectedBranch === m.id
                            ? 1
                            : 0.3
                          : 1,
                        scale: selectedBranch === m.id ? 1.02 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Method
                        icon={<Social />}
                        label={m.name.toUpperCase()}
                        selected={selectedBranch === m.id}
                        onClick={() =>
                          setSelectedBranch(selectedBranch === m.id ? "" : m.id)
                        }
                      />
                    </motion.div>
                  ))}
              </div>
            </div>
          )}

          {selectedExpense === "EMPLEADOS (VALES)" && (
            <div className="space-y-4 overflow-y-scroll max-h-[250px] w-auto scroll-pl-6  p-5 ">
              <LabelInvoice text={"Pagar Vale a:"} />

              <ul className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 w-full">
                {contacts?.data?.map((item) => (
                  <li
                    key={item?.id}
                    onClick={() => onSelect(item)}
                    className="w-auto"
                  >
                    <div
                      className={`flex items-center justify-between px-3 py-2 rounded-md transition shadow-sm cursor-pointer w-auto
              ${
                selectedContact?.id === item.id
                  ? "bg-[var(--brown-ligth-200)] ring-2 ring-[var(--brown-dark-600)]"
                  : "bg-[var(--brown-ligth-50)] hover:bg-[var(--brown-ligth-200)]"
              }`}
                    >
                      <div className="flex items-center gap-3 ">
                        <div className="bg-[var(--brown-ligth-300)] rounded-full">
                          <ProfileMan size="40" />
                        </div>
                        <div>
                          <span className="flex gap-2 justify-start items-center">
                            <p className="text-sm font-medium text-[var(--brown-dark-900)]">
                              {item?.name}
                              <span className=" pl-2 font-normal text-[var(--brown-dark-700)]">
                                (
                                {
                                  branch.find((b) => b?.id === item?.branchId)
                                    .name
                                }
                                )
                              </span>
                            </p>
                            <p className="text-xs text-[var(--brown-dark-900)]">
                              {item?.documentNumber || ""}{" "}
                              {item?.businessName || ""}
                            </p>
                          </span>
                          <span className="flex gap-2 justify-start items-center">
                            <p className="text-sm font-medium text-[var(--brown-dark-500)]">
                              {item?.phone || "Sin Télefono"}
                            </p>
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedExpense === "CATEGORIA" && (
            <div className="px-6 pt-4">
              <LabelInvoice text="Seleccionar categoria" />
              <ul className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 w-full">
                {boxCategories?.map((boxCategory) => (
                  <motion.li
                    key={boxCategory.id}
                    animate={{
                      opacity:
                        selectedBoxCategory?.id === boxCategory.id ? 1 : 0.8,
                      scale: selectedBoxCategory?.id === boxCategory.id ? 1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Method
                      icon={<Lamp />}
                      label={boxCategory.name}
                      type={boxCategory.code}
                      holderName={boxCategory.holderName}
                      selected={selectedBoxCategory?.id === boxCategory.id}
                      onClick={() =>
                        setSelectedBoxCategory(
                          selectedBoxCategory?.id === boxCategory.id
                            ? null
                            : boxCategory
                        )
                      }
                    />
                  </motion.li>
                ))}

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <Method
                    icon={<Lamp size={24} />}
                    label="Agregar categoria"
                    onClick={() => setShowAddBoxCategoryModal(true)}
                  />
                </motion.div>
              </ul>
            </div>
          )}

          {/* METODO DE PAGOS */}
          <div className="px-6 pt-4">
            <LabelInvoice text={"Método de pagos"} />
            <div
              className={`flex px-6 mt-2 w-full transition-all duration-500 gap-4`}
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
              <ul className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3 w-full">
                {cards?.map((card) => (
                  <motion.li
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
                  </motion.li>
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
              </ul>
            </div>
          )}

          {/* SELECCIÓN DE BANCOS */}
          {selectedMethod === "TRANSFERENCIA" && (
            <div className="px-6 pt-4">
              <LabelInvoice text="Seleccionar banco" />
              <ul className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3 w-full">
                {banks?.map((bank) => (
                  <motion.li
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
                  </motion.li>
                ))}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Method
                    icon={<BankIcon size={24} />}
                    label="Agregar banco"
                    onClick={() => setShowAddBankModal(true)}
                  />
                </motion.div>
              </ul>
            </div>
          )}

          {selectedMethod === "CHEQUE" && (
            <div className="px-6 pt-4 w-full">
              <LabelInvoice text={"Tipo de Cheque"} />
              <div
                className={`flex px-6 mt-2 w-full transition-all duration-500 gap-4`}
              >
                {["CHEQUE PROPIO", "CHEQUE DE TERCERO"].map((c) => (
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

          {/* MONEDA */}
          <div className="px-6 pt-4 w-full">
            <LabelInvoice text={"Moneda"} />
            <div
              className={`flex px-6 mt-2 w-full transition-all duration-500 gap-4`}
            >
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
            </div>
          </div>

          {/* BOTONES */}
          <div className="flex gap-3 justify-end px-12 pt-4 w-full">
            <Button
              type="submit"
              text={isLoading ? "Procesando..." : "REALIZAR PAGO"}
              disabled={
                isLoading ||
                !monto ||
                !selectedMethod ||
                (selectedExpense === "SUCURSAL" && !selectedBranch)
              }
            />
            <Button
              text={"CANCELAR"}
              onClick={() => setShowExpenseModal(false)}
            />
          </div>
        </form>

        {/* MODAL AGREGAR TARJETA */}
        <ModalCreateCard
          showAddCardModal={showAddCardModal}
          setShowAddCardModal={setShowAddCardModal}
        />

        {/* MODAL AGREGAR BANCO */}
        <ModalCreateBank
          showAddBankModal={showAddBankModal}
          setShowAddBankModal={setShowAddBankModal}
        />

        {/* MODAL AGREGAR CATEGORIA */}
        <ModalCreateBoxCategory
          showAddBoxCategoryModal={showAddBoxCategoryModal}
          setShowAddBoxCategoryModal={setShowAddBoxCategoryModal}
        />
      </div>
    );
};

export default TypeOfExpenses;
