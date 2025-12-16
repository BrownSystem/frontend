import {
  Cheque,
  CreditCard,
  Danger,
  Dollar,
  Transfer,
} from "../../../../../../assets/icons";
import { Button, EntryCard, Message } from "../../../../widgets";
import { shouldShowAmountCard } from "./amountCards";
import VoucherAmountCard from "./VoucherAmountCard";
import ModalPaymentCreate from "./ModalPaymentCreate";
import { useState } from "react";
import ModalPaymentDetail from "./ModalPaymentDetail";

const Payments = ({ voucher, boxDaily }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const paymentIcons = {
    EFECTIVO: <Dollar />,
    TARJETA: <CreditCard />,
    CHEQUE: <Cheque />,
    CHEQUE_TERCERO: <Cheque />,
    TRANSFERENCIA: <Transfer />,
    DOLLAR: <Dollar />,
  };

  const amountCards = [
    {
      label: "TOTAL",
      amount: voucher?.totalAmount,

      bgColor:
        voucher?.status !== "PENDIENTE"
          ? "--bg-state-green"
          : "--bg-state-yellow",
      borderColor:
        voucher?.status !== "PENDIENTE"
          ? "--text-state-green"
          : "--text-state-yellow",
      textColor: "--brown-dark-950",
    },
    {
      label: "ABONADO",
      amount: voucher?.paidAmount,
      bgColor: "--bg-state-green",
      borderColor: "--text-state-green",
      textColor: "--text-state-green",
    },
    {
      label: "SALDO",
      amount: voucher?.remainingAmount,
      bgColor: "--bg-state-red",
      borderColor: "--text-state-red",
      textColor: "--text-state-red",
    },
  ];

  return (
    <>
      {voucher?.type !== "REMITO" && (
        <div className="flex flex-col items-center justify-center gap-3  w-full py-2 rounded-md ">
          <div className="flex  px-5 self-start justify-center p-4 bg-[var(--brown-ligth-200)] rounded-md w-full">
            <div className="w-full flex flex-col justify-center">
              <span className="text-[var(--brown-dark-950)] font-semibold">
                RESÚMEN DE PAGOS
              </span>
              <div className="text-[var(--brown-dark-800)]">
                {voucher?.type === "NOTA_CREDITO_CLIENTE" ||
                voucher?.type === "NOTA_CREDITO_PROVEEDOR" ? (
                  <div className="flex gap-2">Se anuló el pago</div>
                ) : voucher?.payments?.length > 0 ? (
                  <div>
                    Cantidad de pagos:
                    <span className="pl-2 text-[var(--brown-dark-950)] font-semibold">
                      {voucher?.payments?.length}
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    No se han realizado pagos
                    <span className="text-[var(--brown-dark-950)] font-semibold">
                      <Danger color={"var(--text-state-yellow)"} />
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              {amountCards
                .filter((card) =>
                  shouldShowAmountCard(
                    voucher?.type,
                    card.label,
                    voucher?.totalAmount ?? 0,
                    voucher?.paidAmount ?? 0,
                    voucher?.remainingAmount ?? 0
                  )
                )
                .map((card, idx) => (
                  <VoucherAmountCard
                    key={idx}
                    label={card.label}
                    amount={card.amount}
                    bgColor={`bg-[var(${card.bgColor})]`}
                    borderColor={`border-[var(${card.borderColor})]`}
                    textColor={`text-[var(${card.textColor})]`}
                  />
                ))}
            </div>
          </div>

          {/* Render dinámico de campos de metodos de pago */}
          <div className="w-full px-13 grid grid-cols-2 gap-3 ">
            {voucher?.payments?.map((item, index, arr) => {
              const isLast = index === arr.length - 1;
              const isOdd = arr.length % 2 !== 0; // true si es impar

              // Solo si es el último y la cantidad es impar, ocupar 2 columnas
              const spanClass = isLast && isOdd ? "col-span-2" : "col-span-1";

              return (
                <div key={index} className={spanClass}>
                  <EntryCard
                    icon={paymentIcons[item?.method] || null}
                    date={item?.receivedAt}
                    currency={item?.currency}
                    method={item?.method}
                    mount={item?.amount}
                    onClick={() => setSelectedPayment(item)}
                  />
                </div>
              );
            })}
          </div>

          {/* {boxDaily?.length === 0 || */}
          {voucher?.type !== "NOTA_CREDITO_CLIENTE" &&
            voucher?.type !== "NOTA_CREDITO_PROVEEDOR" &&
            voucher?.remainingAmount !== 0 && (
              <div className="flex px-20 self-start justify-center w-full">
                <div className="bg-[var(--brown-ligth-100)] py-2 w-full justify-center flex rounded-md">
                  <Button
                    text={"Añadir pago"}
                    onClick={() => setShowPaymentModal(true)}
                  />
                </div>
              </div>
            )}

          {/* MODAL PAYMENT */}
          {showPaymentModal && (
            <ModalPaymentCreate
              voucher={voucher}
              boxDaily={boxDaily}
              setShowPaymentModal={setShowPaymentModal}
            />
          )}

          {selectedPayment && (
            <ModalPaymentDetail
              payment={selectedPayment}
              icon={paymentIcons[selectedPayment?.method] || null}
              onClose={() => setSelectedPayment(null)}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Payments;
