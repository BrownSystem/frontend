import { Button, LabelInvoice } from "../../../../widgets";
import { motion, AnimatePresence } from "framer-motion";
import { formatFechaISO } from "../../../stocks/content/SupplierContent/tables/InvoiceTable";
import { useGetOneCard } from "../../../../../../api/card/card.queries";
import { useBanks } from "../../../../../../api/banks/banks.queries";

const ModalPaymentDetail = ({ payment, onClose, icon }) => {
  const { data: card, isLoading } = useGetOneCard(payment?.cardId);
  const { data: banks, isLoading: isBanksLoading } = useBanks();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex justify-center items-center bg-black/50"
    >
      <div className="bg-[var(--brown-ligth-50)] rounded-md w-[400px]">
        <div className="flex gap-4 items-center mb-4 border-b-[1px] p-4 border-[var(--brown-ligth-200)]">
          <div className="bg-[var(--brown-ligth-300)] p-2 rounded-full">
            {icon}
          </div>
          <div>
            <h3 className="flex items-center gap-1 text-lg font-bold text-[var(--brown-dark-900)]">
              {payment.method}
              <p className="text-[14px] font-semibold text-[var(--brown-dark-700)]">
                {card && !isLoading
                  ? `( ${card?.name} - ${
                      card?.cardType === "CREDIT" ? "CRÉDITO" : "DÉBITO"
                    }) `
                  : ""}
              </p>
              <p className="text-[14px] font-semibold text-[var(--brown-dark-700)]">
                {payment.bankId && !isLoading
                  ? `( ${
                      banks.find((bank) => payment.bankId === bank.id)?.name
                    })`
                  : ""}
              </p>
              <p className="text-[14px] font-semibold text-[var(--brown-dark-700)]">
                {payment.chequeBank
                  ? `( ${payment?.chequeBank} - ${payment?.chequeNumber}) `
                  : ""}
              </p>
            </h3>
            <p className="text-[14px] text-[var(--brown-dark-700)] font-normal">
              Recibido: {formatFechaISO(payment.receivedAt)}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 px-4 pb-4">
          <div className="flex w-full flex-col bg-[var(--brown-ligth-200)] p-3 rounded-md">
            <LabelInvoice
              text="Monto"
              other={
                <p className="text-[14px] font-semibold text-[var(--brown-dark-700)]">
                  {card && !isLoading ? `( ${card?.quotas}  cuotas) ` : ""}
                </p>
              }
            />
            <p className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]">
              ${payment.amount?.toLocaleString("es-AR")}
            </p>
          </div>

          <div className="flex w-full flex-col bg-[var(--brown-ligth-200)] p-3 rounded-md">
            <LabelInvoice text="Observación" />
            <p className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]">
              {payment.observation || "Sin observación"}
            </p>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button text="Cerrar" onClick={() => onClose(false)} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModalPaymentDetail;
