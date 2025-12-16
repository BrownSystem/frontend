import { motion } from "framer-motion";
import {
  Cheque,
  CreditCard,
  CreditNoteIcon,
  Delete,
  Dollar,
  Edit,
  HideEyes,
  InvoiceIcon,
  Lamp,
  Person,
  ProfileMan,
  Proveedores,
  ShowEyes,
  Social,
  Transfer,
} from "../../../../../../../../../assets/icons";
import { StockIcon } from "../../../../../../../../../assets/icons/Icon";
import { TransactionType } from "./transaction-type.enum";
import { useState } from "react";
import { Button, Message } from "../../../../../../../widgets";
import { useVerifyPassword } from "../../../../../../../../../api/auth/auth.queries";
import { useAuthStore } from "../../../../../../../../../api/auth/auth.store";
import { PasswordConfirmModal } from "../../../../../../../../common";
import { useMessageStore } from "../../../../../../../../../store/useMessage";
import { useDeletePayment } from "../../../../../../../../../api/vouchers/vouchers.queries";
import { useDeleteTransactions } from "../../../../../../../../../api/boxDaily/boxDaily.queries";
import { useNavigate } from "react-router-dom";

const transactionConfig = {
  [TransactionType.INCOME_SALE]: {
    bg: "bg-[var(--bg-state-green)]",
    iconBg: "bg-[var(--text-state-green-ligth)]",
    icon: <InvoiceIcon />,
    stock: <StockIcon type="up" />,
    textColor: "text-[var(--text-state-green)]",
  },
  [TransactionType.INCOME_TRANSFER_BRANCH]: {
    bg: "bg-[var(--bg-state-green)]",
    iconBg: "bg-[var(--text-state-green-ligth)]",
    icon: <Social />,
    stock: <StockIcon type="up" />,
    textColor: "text-[var(--text-state-green)]",
  },
  [TransactionType.INCOME_FROM_VOUCHER_CANCELLATION]: {
    bg: "bg-[var(--bg-state-green)]",
    iconBg: "bg-[var(--text-state-green-ligth)]",
    icon: <CreditNoteIcon size={28} />,
    stock: <StockIcon type="up" />,
    textColor: "text-[var(--text-state-green)]",
  },
  [TransactionType.EXPENSE_BY_CATEGORY]: {
    bg: "bg-[var(--bg-state-red)]",
    iconBg: "bg-[var(--text-state-red-ligth)]",
    icon: <Lamp />,
    stock: <StockIcon type="low" />,
    textColor: "text-[var(--text-state-red)]",
  },

  [TransactionType.EXPENSE_FROM_VOUCHER_P_CANCELLATION]: {
    bg: "bg-[var(--bg-state-red)]",
    iconBg: "bg-[var(--text-state-red-ligth)]",
    icon: <CreditNoteIcon size={28} />,
    stock: <StockIcon type="low" />,
    textColor: "text-[var(--text-state-red)]",
  },
  [TransactionType.EXPENSE_SUPPLIER]: {
    bg: "bg-[var(--bg-state-red)]",
    iconBg: "bg-[var(--text-state-red-ligth)]",
    icon: <InvoiceIcon />,
    stock: <StockIcon type="low" />,
    textColor: "text-[var(--text-state-red)]",
  },
  [TransactionType.EXPENSE_EMPLOYEED]: {
    bg: "bg-[var(--bg-state-red)]",
    iconBg: "bg-[var(--text-state-red-ligth)]",
    icon: <Person />,
    stock: <StockIcon type="low" />,
    textColor: "text-[var(--text-state-red)]",
  },
  [TransactionType.EXPENSE_TRANSFER_BRANCH]: {
    bg: "bg-[var(--bg-state-red)]",
    iconBg: "bg-[var(--text-state-red-ligth)]",
    icon: <InvoiceIcon />,
    stock: <StockIcon type="low" />,
    textColor: "text-[var(--text-state-red)]",
  },
};

const Item = ({
  id,
  paymentId,
  branchId,
  amount,
  branchName,
  clientName,
  supplierName,
  categoryName,
  createdAt,
  currency,
  paymentMethod,
  transactionType,
  employeedName,
  voucherNumber,
  voucherId,
}) => {
  const navigate = useNavigate();

  const [showModalTransaction, setModalTransaction] = useState(false);
  const [modalConfirmation, setModalConfirmation] = useState(false);
  const [tempPassword, setTempPassword] = useState("");

  const { setMessage } = useMessageStore();
  const user = useAuthStore((state) => state.user);

  const {
    mutate: verifyPassword,
    isLoading: verifying,
    error: verifyError,
  } = useVerifyPassword();

  const { mutate: deleteTransactionMutate } = useDeleteTransactions(branchId);

  const { mutate: deletePaymentMutate, isLoading: deletingPayment } =
    useDeletePayment({
      onSuccess: () => {},
      onError: (error) => {
        setMessage({
          text: `No se pudo eliminar: ${error}`,
          type: "error",
        });
      },
    });

  const openVoucher = (id) => {
    navigate(`/dashboard/comprobantes/${voucherId}`);
  };

  const handlerDelete = () => {
    setModalConfirmation(true);
  };

  const confirmPasswordAndDelete = (password) => {
    verifyPassword(
      { email: user.email, password },
      {
        onSuccess: () => {
          deleteTransactionMutate({ id });
          deletePaymentMutate({ paymentId });
          setModalConfirmation(false);
          setTempPassword("");
          setMessage({ text: "Transacción eliminada", type: "success" }); // acá usás tu mutación real
        },
        onError: (error) => {
          setMessage({
            text: `Contraseña incorrecta: ${error}`,
            type: "error",
          });
        },
      }
    );
  };

  const config = transactionConfig[transactionType];
  if (!config) return null;

  const title =
    branchName ||
    clientName ||
    supplierName ||
    categoryName ||
    employeedName ||
    "—";
  const formattedAmount = `${amount?.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;

  const date = new Date(createdAt).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const paymentIcons = {
    EFECTIVO: <Dollar />,
    TARJETA: <CreditCard />,
    CHEQUE: <Cheque />,
    CHEQUE_TERCERO: <Cheque />,
    TRANSFERENCIA: <Transfer />,
    DOLLAR: <Dollar />,
  };

  return (
    <>
      {modalConfirmation && (
        <PasswordConfirmModal
          password={tempPassword}
          onPasswordChange={setTempPassword}
          onCancel={() => {
            setModalConfirmation(false);
            setModalTransaction(false);
            setTempPassword("");
          }}
          onConfirm={(password) => {
            confirmPasswordAndDelete(password);
            setModalTransaction(false);
          }}
          isLoading={verifying}
          error={verifyError?.message}
        />
      )}

      {/* MODAL */}

      {showModalTransaction && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 flex justify-center items-center bg-black/50"
        >
          <div className={`${config.bg} rounded-md w-[400px]`}>
            <div className="flex gap-4 items-center border-b-[1px] p-4 border-[var(--brown-ligth-200)]">
              <div className={`${config.iconBg} p-2 rounded-full`}>
                {config.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--brown-dark-900)]">
                  {voucherNumber && `${voucherNumber}`}{" "}
                  <span className="text-[var(--brown-dark-800)] font-medium">
                    ({title})
                  </span>
                </h3>
                <p className="text-[14px] text-[var(--brown-dark-700)] font-medium flex items-center gap-1">
                  {paymentIcons[paymentMethod]}
                  {paymentMethod}
                </p>
              </div>
            </div>
            <div className="p-4 w-full">
              <div
                className={`${config.textColor} flex justify-start items-center font-semibold text-2xl gap-2 mb-5 mt-2`}
              >
                <p className="pl-5">{formattedAmount}</p>
              </div>
              <div className="flex gap-2 justify-end w-full">
                <Button
                  text={"Cerrar"}
                  onClick={() => setModalTransaction(false)}
                />

                {voucherNumber ? (
                  <Button
                    text={"Ver comprobante"}
                    onClick={() => openVoucher()}
                  />
                ) : (
                  ""
                )}

                <Button Icon={<Delete />} onClick={() => handlerDelete()} />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* CARD */}
      <div
        className={`${config.bg} px-2 py-2 rounded-xl shadow-sm flex items-center justify-between gap-4 w-full font-[var(--font-outfit)] mb-2`}
      >
        <div className="flex justify-center items-center gap-4">
          <div className={`${config.iconBg} p-2 rounded-full`}>
            {config.icon}
          </div>
          <div>
            <p className="text-md font-bold text-[var(--brown-dark-900)]">
              <span
                className={`${config.textColor} flex justify-start items-center`}
              >
                {formattedAmount}
                <span className="pl-1">{config.stock}</span>
              </span>
            </p>
            <h3 className="text-xs flex gap-2 font-medium text-[var(--brown-dark-800)]">
              {title} ({paymentMethod}) {voucherNumber && `- ${voucherNumber}`}
            </h3>
          </div>
        </div>
        <div className="self-start pt-1">
          <p className="text-xs text-[var(--brown-dark-800)]">({date})</p>
        </div>
        {/* OJOS */}
        <motion.div
          className="cursor-pointer"
          initial="closed"
          whileHover="open"
        >
          <div className="flex items-center justify-center relative w-7 h-7">
            <motion.div
              key="closed"
              variants={{
                closed: { opacity: 1, scale: 1 },
                open: { opacity: 0, scale: 0.8 },
              }}
              transition={{ duration: 0.2 }}
              className="absolute"
            >
              <HideEyes size={28} />
            </motion.div>
            <motion.div
              key="open"
              variants={{
                closed: { opacity: 0, scale: 0.8 },
                open: { opacity: 1, scale: 1 },
              }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-[0.5px] left-[0.5px]"
              onClick={() => setModalTransaction(true)}
            >
              <ShowEyes size={30} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Item;
