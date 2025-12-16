import {
  HideEyes,
  Initial,
  NotFound,
  ShowEyes,
  TransactionsIcon,
} from "../../../../../../../../../assets/icons";
import { StockIcon } from "../../../../../../../../../assets/icons/Icon";
import { motion } from "framer-motion";
import Items from "./Items";

const Transactions = ({ transactions, saldoInicial, estado, branchId }) => {
  return (
    <div
      className="bg-[var(--brown-ligth-100)] px-4 pb-2 rounded-xl shadow-md font-[var(--font-outfit)] 
  text-[var(--brown-dark-950)] w-full h-full"
    >
      {/* Header */}
      <div className="flex gap-4 items-center border-b-[1px] p-4 border-[var(--brown-ligth-200)]">
        <div className="bg-[var(--brown-ligth-300)] p-2 rounded-full">
          <TransactionsIcon size={31} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--brown-dark-900)]">
            TRANSACCIONES
          </h3>
          <p className="text-[14px] text-[var(--brown-dark-700)] font-normal">
            Movimientos Recientes
          </p>
        </div>
      </div>

      {/* Contenido dinámico */}
      <div className="mt-2 h-[520px] overflow-auto ">
        {/* SALDO INICIAL */}
        {saldoInicial !== 0 && (
          <div className="bg-[var(--bg-state-green)] px-2 py-2 rounded-xl shadow-sm flex items-center justify-between gap-4 w-full font-[var(--font-outfit)] mb-2">
            <div className="flex gap-4">
              <div className="bg-[var(--text-state-green-ligth)] p-2 rounded-full">
                <Initial />
              </div>

              <div className="flex flex-col items-start">
                <p className="text-md font-bold text-[var(--brown-dark-900)]">
                  <span className="text-[var(--text-state-green)] flex justify-center items-center">
                    ${saldoInicial?.toLocaleString("es-AR")}{" "}
                    <span className="pl-1">ARS</span>{" "}
                    <span className="pl-1">
                      <StockIcon type={"up"} />
                    </span>
                  </span>
                </p>
                <h3 className="text-xs flex gap-2 font-medium text-[var(--brown-dark-800)]">
                  SALDO INICIAL
                </h3>
              </div>
            </div>
            <div className="self-start pt-1"></div>
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
                >
                  <ShowEyes size={30} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Lista con scroll */}
        <div className="flex-1 mt-1">
          {transactions?.map((item, index) => (
            <Items
              key={index}
              id={item?.id}
              branchId={branchId}
              paymentId={item?.paymentId}
              amount={`$${item?.amount}`}
              branchName={item?.branchName}
              cancelledInvoiceNumber={item?.cancelledInvoiceNumber}
              categoryName={item?.categoryName}
              clientName={item?.clientName}
              createdAt={item?.createdAt}
              currency={item?.currency}
              description={item?.description}
              employeedName={item?.employeedName}
              paymentMethod={item?.paymentMethod}
              supplierName={item?.supplierName}
              transactionType={item?.transactionType}
              voucherNumber={item?.voucherNumber}
              voucherId={item?.voucherId}
            />
          ))}

          {transactions?.length === 0 && (
            <div className="w-full h-full flex justify-center items-center">
              <NotFound
                text={"SIN TRANSACCIONES"}
                colorText={"text-[var(--text-state-red)]"}
                color={"var(--text-state-red"}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
