import { ClosedIcon } from "../../../../../../../../assets/icons";
import { formatFechaISO } from "../../../SupplierContent/tables/InvoiceTable";
import { TransactionType } from "../CurrentBox/Transactions/transaction-type.enum";
import { motion } from "framer-motion";

const transactionType = {
  [TransactionType.INCOME_SALE]: {
    name: "INGRESO DE VENTA",
  },
  [TransactionType.INCOME_TRANSFER_BRANCH]: {
    name: "TRASNFERENCIA RECIBIDA DE UNA SUCURSAL",
  },
  [TransactionType.INCOME_FROM_VOUCHER_CANCELLATION]: {
    name: "DEVOLUCIÓN POR ANULACIÓN DE COMPRA",
  },
  [TransactionType.EXPENSE_BY_CATEGORY]: {
    name: "GASTO EN CATEGORIA",
  },

  [TransactionType.EXPENSE_FROM_VOUCHER_P_CANCELLATION]: {
    name: "ANULACIÓN DE VENTA (P)",
  },
  [TransactionType.EXPENSE_SUPPLIER]: {
    name: "GASTO POR PAGO A PROVEEDOR",
  },
  [TransactionType.EXPENSE_EMPLOYEED]: {
    name: "GASTO POR EMPLEADO (VALE)",
  },
  [TransactionType.EXPENSE_TRANSFER_BRANCH]: {
    name: "GASTO POR TRANSFERENCIA A SUCURSAL",
  },
};

const BoxDetailsModal = ({ selectedBox, setShowModalDetailBox }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[var(--brown-dark-900)]/40 w-full z-[999999999]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="w-[750px] rounded-md bg-[var(--brown-ligth-100)] shadow-xl border border-[var(--brown-ligth-200)] max-h-[90vh] overflow-hidden flex flex-col "
      >
        {/* HEADER */}
        <div className="flex justify-between px-6 pb-3 pt-6 border-b-[1px] border-[var(--brown-ligth-200)] rounded-t-md bg-[var(--brown-ligth-200)]/40">
          <div className="flex gap-4 items-center">
            <span className="bg-[var(--brown-ligth-400)] rounded-full w-[50px] h-[50px] flex justify-center items-center shadow-inner">
              <ClosedIcon size={35} />
            </span>
            <div>
              <h1 className="font-semibold text-[var(--brown-dark-900)] text-lg">
                DETALLES DE LA CAJA #{selectedBox.number}
              </h1>
              <p className="text-[var(--brown-dark-700)]">
                {selectedBox.branchName}
              </p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto p-6 px-3 space-y-6">
          {/* INFO PRINCIPAL */}
          <div className="grid grid-cols-3 gap-4 text-[var(--brown-dark-900)] text-md w-full text-start">
            <div>
              <p className="font-semibold">Fecha de Apertura:</p>
              <p>{formatFechaISO(selectedBox.openedAt)}</p>
            </div>
            <div>
              <p className="font-semibold">Fecha de Cierre:</p>
              <p>{formatFechaISO(selectedBox.closedAt)}</p>
            </div>
            <div>
              <p className="font-semibold">Abierta por:</p>
              <p>{selectedBox.openedBy}</p>
            </div>
            <div>
              <p className="font-semibold">Cerrada por:</p>
              <p>{selectedBox.closedBy}</p>
            </div>
            <div>
              <p className="font-semibold">Saldo inicial:</p>
              <p className=" text-[var(--text-state-green)]">
                $
                {selectedBox.openingAmount.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div>
              <p className="font-semibold">Saldo final:</p>
              <p>
                $
                {selectedBox.closingAmount.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div>
              <p className="font-semibold">Total ventas:</p>
              <p>
                $
                {selectedBox.totalSales.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div>
              <p className="font-semibold">Total gastos:</p>
              <p className=" text-[var(--text-state-red)]">
                $
                {selectedBox.totalExpenses.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div>
              <p className="font-semibold">Ingresos totales:</p>
              <p>
                $
                {selectedBox.income.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          {/* DIFERENCIA */}
          <div className="bg-[var(--brown-ligth-200)] rounded-md p-3 mt-4 text-[var(--brown-dark-900)] flex justify-between items-center">
            <span className="font-semibold">Diferencia real:</span>
            <span
              className={`font-bold ${
                selectedBox.realAmount < 0
                  ? "text-[var(--text-state-red)]"
                  : "text-[var(--text-state-green)]"
              }`}
            >
              $
              {selectedBox.realAmount.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>

          {/* TRANSACCIONES */}
          <div className="mt-6">
            <h2 className="text-md font-semibold text-[var(--brown-dark-900)] mb-3 border-b border-[var(--brown-ligth-300)] pb-1">
              Transacciones
            </h2>
            {selectedBox.transactions?.length > 0 ? (
              <div className="h-auto  border border-[var(--brown-ligth-200)] rounded-md">
                <table className="w-full text-xs">
                  <thead className="bg-[var(--brown-ligth-200)] text-[var(--brown-dark-800)] sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">Tipo</th>
                      <th className="px-3 py-2 text-center">Método</th>
                      <th className="px-3 py-2 text-center">Monto</th>
                      <th className="px-3 py-2 text-center">Sucursal</th>
                      <th className="px-3 py-2 ">Contacto / Motivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBox.transactions.map((t) => (
                      <tr
                        key={t.id}
                        className="odd:bg-[var(--brown-ligth-50)] even:bg-[var(--brown-ligth-100)]/70 text-[var(--brown-dark-800)] text-center"
                      >
                        <td className="px-3 py-2 text-start">
                          {transactionType[t.transactionType].name}
                        </td>
                        <td className="px-3 py-2">{t.paymentMethod}</td>
                        <td
                          className={`px-3 py-2 font-semibold ${
                            t.transactionType.startsWith("INCOME")
                              ? "text-[var(--text-state-green)]"
                              : "text-[var(--text-state-red)]"
                          }`}
                        >
                          $
                          {t.amount.toLocaleString("es-AR", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-3 py-2">{t.branchName || "-"}</td>
                        <td className="px-3 py-2">
                          {t.clientName ||
                            t.supplierName ||
                            t.employeedName ||
                            t.categoryName}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-[var(--brown-dark-700)] italic">
                No hay transacciones registradas.
              </p>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-[var(--brown-ligth-200)] flex justify-end bg-[var(--brown-ligth-100)]">
          <button
            className="px-4 py-2 bg-[var(--brown-dark-800)] text-white rounded-md hover:bg-[var(--brown-dark-900)] transition"
            onClick={() => setShowModalDetailBox(false)}
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BoxDetailsModal;
